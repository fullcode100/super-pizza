import mongoose from "mongoose";
import express, { Router as IRouter } from "express";
import bcrypt from "bcrypt";

import { dev } from "../index";
import models from "./mongodb";
import { authenticateToken, generateAccessToken } from "./jwt";
import { deleteImg, hashPass, orderNumber, uploadImgPizza } from "./helpers";

import { IOrder, IPizza, IUser } from "../../src/interfaces/interfaces";

const Router: IRouter = express.Router();
/* -------------------------------------------------------------------------- */

const SALT_ROUNDS = 10;

if (!dev) {
	Router.get("/", (req, res) => {
		res.sendFile("./index.html", { root: `${__dirname}/../` });
	});
}

/* -------------------------------------------------------------------------- */
/*                                  SETTINGS                                  */
/* -------------------------------------------------------------------------- */

/** Get settings */
Router.get("/settings", authenticateToken, async (req, res) => {
	const message = "Success";
	// no-shadow
	const settings = await models.Settings.find({}, (err: any, s) => s);

	return res.json({ message, settings });
});

/** Update settings */
Router.put("/settings/update/:settingId", authenticateToken, async (req, res) => {
	const { setting } = req.body;
	const { name } = setting;
	const _id = new mongoose.Types.ObjectId(req.params.settingId);
	const message: string = "Setting updated";
	const data = await models.Settings.updateOne({ _id }, { $set: { [name]: setting[name] } }, { upsert: true });

	if (data.n === 1) res.json({ message });
});

/* -------------------------------------------------------------------------- */
/*                                   PIZZAS                                   */
/* -------------------------------------------------------------------------- */

/** Get pizzas */
Router.get("/pizzas", async (req, res) => {
	const message = "Success";
	const pizzas = await models.Pizza.find({}, (err: any, p: IPizza[]) => p);

	return res.json({ message, pizzas });
});

/** Create pizza */
Router.post("/pizzas/create", authenticateToken, async (req, res) => {
	const { body } = req;
	const { name } = body;
	const { description } = body;
	let message = "Pizza created";

	await models.Pizza.findOne({ name }, "_id", null, (err: any, pizza) => {
		if (pizza) {
			message = "Pizza already exist";

			return res.json({ message });
		}
		const imgPath = uploadImgPizza(req);
		const p: IPizza = { name, description, price: body.price, qty: body.qty, img_path: imgPath };

		return models.Pizza.create(p).then((pizza) => {
			return res.json({ message, pizza });
		});
	});
});

/** Update pizza */
Router.put("/pizzas/update/:pizzaId", authenticateToken, async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.pizzaId);
	const { body } = req;
	const { name } = body;
	const { description } = body;
	const message: string = "Pizza info updated";
	const p: IPizza = { name, description, price: body.price, qty: body.qty };

	if (body.oldImgPath) deleteImg(body.oldImgPath);
	if (req["files"]) p.img_path = uploadImgPizza(req);

	const data = await models.Pizza.updateOne({ _id }, { $set: { ...p } }, { upsert: true });

	if (data.n === 1) res.json({ message, pizza: p });
});

/** Delete pizza */
Router.delete("/pizzas/delete/:pizzaId", authenticateToken, async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.pizzaId);
	const message: string = "Pizza deleted";

	await models.Pizza.findOne({ _id }, (err, pizza: IPizza) => {
		if (pizza) deleteImg(pizza.img_path);

		return res.json({ message });
	});
});

/* -------------------------------------------------------------------------- */
/*                                   ORDERS                                   */
/* -------------------------------------------------------------------------- */

/** Get orders */
Router.get("/orders", authenticateToken, async (req, res) => {
	const message = "Success";
	const orders = await models.Order.find({}, (err: any, orders: IOrder[]) => orders)
		.populate("pizzas")
		.populate({
			path: "user",
			select: "-password",
		});

	return res.json({ message, orders });
});

/** Get order by id */
Router.get("/orders/:userId", authenticateToken, async (req, res) => {
	const message = "Success";
	const userId = new mongoose.Types.ObjectId(req.params.userId);
	// Get the _ids of the users of the selected country.
	await models.User.findOne({ _id: userId }, async (err, user) => {
		// Get the posts whose _creator is in that set of ids
		const orders = await models.Order.find({ user: { $in: [user._id] } }, (err: any, orders: IOrder[]) => orders)
			.populate("pizzas")
			.populate({
				path: "user",
				select: "-password",
			});

		return res.json({ message, orders });
	});
});

/** Create order */
Router.post("/orders/create", async (req, res) => {
	const { pizzasIds } = req.body;
	const { userId } = req.body;
	const order: IOrder = {
		n_order: orderNumber(),
		pizzas: pizzasIds.map((pi) => new mongoose.Types.ObjectId(pi)),
		user: new mongoose.Types.ObjectId(userId),
		status: "in_progress",
	};
	const settings = await models.Settings.findOne({ order_capacity_by_hour: { $exists: true } });
	const orderCapacityByHour = settings["order_capacity_by_hour"];

	await models.Order.find({ status: { $eq: "in_progress" } }, (err, orders: IOrder[]) => {
		const wait = orders.length >= orderCapacityByHour;
		order.status = wait ? "waiting" : "in_progress";
		const message = wait ? "Order waiting" : "Order in progress";

		models.Order.create(order).then((order) => {
			return res.json({ message, order });
		});
	});
});

/** Update order */
Router.put("/orders/update/:orderId", authenticateToken, async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.orderId);
	const { status } = req.body;
	const { pizzas } = req.body;
	const message: string = "Order info updated";

	if (status === "finish") {
		pizzas.map((p) => {
			const pizzaId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(p._id);

			if (p.qty > 0) {
				models.Pizza.updateOne({ _id: pizzaId }, { $set: { qty: p.qty - 1 } });
			}
		});
	}

	const data = await models.Order.updateOne({ _id }, { $set: { status } }, { upsert: true });

	// Send a mail for notification

	if (data.n === 1) res.json({ message });
});

/* -------------------------------------------------------------------------- */
/*                              USERS & CONNECTION                            */
/* -------------------------------------------------------------------------- */

/** Get users */
Router.get("/users", authenticateToken, async (req, res) => {
	const message = "Success";
	const users = await models.User.find({}, (err: any, users: IUser[]) => users).select("-password");

	return res.json({ message, users });
});

/** Registration */
Router.post("/registration", async (req, res) => {
	const { password } = req.body.user;
	const { email } = req.body.user;
	let message = "User created";

	await models.User.findOne({ email }, "_id", null, (err: any, user) => {
		if (user) {
			message = "User already exist";

			return res.json({ message });
		}

		return hashPass(password, (hash: string) => {
			models.User.create({ ...req.body.user, password: hash }).then(() => {
				return res.json({ message });
			});
		});
	});
});

/** Login */
Router.post("/login", async (req, res) => {
	const { email } = req.body.user;
	const { password } = req.body.user;

	await models.User.findOne({ email }, (err, user: IUser) => {
		if (user) {
			return bcrypt.compare(password, user.password, (err, result: boolean) => {
				if (result) {
					const token = generateAccessToken(email);
					const u = {
						_id: user._id,
						username: user.username,
						role: user.role,
						email: user.email,
					};

					return res.json({ message: "User logged in", user: u, token });
				}
				return res.json({ message: "Username or password not match" });
			});
		}

		return res.json({ message: "User not exist" });
	});
});

/** Create user by admin */
Router.post("/users/create", authenticateToken, async (req, res) => {
	const { password } = req.body.user;
	const { email } = req.body.user;
	let message = "User created";

	await models.User.findOne({ email }, "_id", null, (err: any, user) => {
		if (user) {
			message = "User already exist";

			return res.json({ message });
		}

		return bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
			bcrypt.hash(password, salt, (err, hash: string) => {
				models.User.create({ ...req.body.user, password: hash }).then((user) => {
					return res.json({ message, user });
				});
			});
		});
	});
});

/** Update user by admin */
Router.put("/users/update/:userId", authenticateToken, (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.userId);
	const message: string = "User info updated";
	const user = { ...req.body };
	const response = async (password?: string) => {
		if (password) user.password = password;
		const data = await models.User.updateOne({ _id }, { $set: { ...user } }, { upsert: true });

		if (data.n === 1) res.json({ message });
	};

	if (req.body.password) {
		const { password } = req.body;

		hashPass(password, (hash: string) => response(hash));
	}

	return response();
});

/** Delete user by admin */
Router.delete("/users/delete/:userId", authenticateToken, async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.userId);
	const message: string = "User deleted";

	await models.User.deleteOne({ _id });

	return res.json({ message });
});

/** Logout */
Router.post("/logout", authenticateToken, (req, res) => {
	const message: string = "User deconnected";

	return res.json({ message });
});

module.exports = Router;
