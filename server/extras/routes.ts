/* eslint-disable import/no-import-module-exports */
import mongoose from "mongoose";
import express, { Router as IRouter } from "express";
import bcrypt from "bcrypt";

import { dev } from "../index";
import models from "./mongodb";
import { authenticateToken, generateAccessToken } from "./jwt";
import { hashPass, orderNumber, uploadImgPizza } from "./helpers";

import { IOrder, IPizza, ISettings, IUser } from "../../src/interfaces";

const Router: IRouter = express.Router();
const SALT_ROUNDS = 10;

/* -------------------------------------------------------------------------- */

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
	const settings = await models.Settings.find({});

	res.json({ message, settings });
});

/** Update settings */
Router.put("/settings/update/:settingId", authenticateToken, async (req, res) => {
	const { setting } = req.body;
	const { name } = setting;
	const _id = new mongoose.Types.ObjectId(req.params.settingId);
	const message: string = "Setting updated";
	const data = await models.Settings.updateOne({ _id }, { $set: { [name]: setting[name] } }, { upsert: true });

	if (data.modifiedCount === 1) res.json({ message });
});

/* -------------------------------------------------------------------------- */
/*                                   PIZZAS                                   */
/* -------------------------------------------------------------------------- */

/** Get pizzas */
Router.get("/pizzas", async (req, res) => {
	const pizzas = await models.Pizza.find({});

	res.json({ message: "Success", pizzas });
});

/** Create pizza */
Router.post("/pizzas/create", authenticateToken, async (req, res) => {
	const { body } = req;
	const { name } = body;
	const { description } = body;
	const query = models.Pizza.where({ name });
	const pizza = await query.findOne();

	if (pizza) {
		return res.json({ message: "Pizza already exist" });
	}

	const imgPath = uploadImgPizza(req);
	const p: IPizza = { name, description, price: body.price, qty: body.qty, img_path: imgPath };

	return models.Pizza.create(p).then((pizza) => {
		res.json({ message: "Pizza created", pizza });
	});
});

/** Update pizza */
Router.put("/pizzas/update/:pizzaId", authenticateToken, async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.pizzaId);
	const { body } = req;
	const { description, name } = body;
	const message: string = "Pizza info updated";
	const p: IPizza = { name, description, price: body.price, qty: body.qty };

	// if (body.oldImgPath) deleteImg(body.oldImgPath);
	if (req["files"]) p["img_path"] = uploadImgPizza(req);

	const data = await models.Pizza.updateOne({ _id }, { $set: { ...p } }, { upsert: true });

	if (data.modifiedCount === 1) res.json({ message, pizza: p });
});

/** Delete pizza */
Router.delete("/pizzas/delete/:pizzaId", authenticateToken, async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.pizzaId);
	// const pizza = await query.findOne({}).select("img_path");
	// if (pizza) deleteImg(pizza.img_path);
	await models.Pizza.deleteOne({ _id });
	return res.json({ message: "Pizza deleted" });
});

/* -------------------------------------------------------------------------- */
/*                                   ORDERS                                   */
/* -------------------------------------------------------------------------- */

/** Get orders */
Router.get("/orders", authenticateToken, async (req, res) => {
	const orders = await models.Order.find({}).populate("pizzas").populate({
		path: "user",
		select: "-password",
	});

	res.json({ message: "Success", orders });
});

/** Get order by id */
Router.get("/orders/:userId", authenticateToken, async (req, res) => {
	const message = "Success";
	const userId = new mongoose.Types.ObjectId(req.params.userId);
	const query = models.User.where({ _id: userId });
	const user = (await query.findOne()) as IUser;
	const ordersQuery = models.Order.where({ user: { $in: [user._id] } });
	// Get the _ids of the users of the selected country.
	// Get the posts whose _creator is in that set of ids
	const orders = await ordersQuery.find().populate("pizzas").populate({
		path: "user",
		select: "-password",
	});

	res.json({ message, orders });
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
	const settings = (await models.Settings.findOne({ order_capacity_by_hour: { $exists: true } })) as ISettings;
	const orderCapacityByHour = settings["order_capacity_by_hour"];
	const query = models.Order.where({ status: { $eq: "in_progress" } });
	const orders = await query.find({});
	const wait = orders.length >= orderCapacityByHour;
	order.status = wait ? "waiting" : "in_progress";
	const message = wait ? "Order waiting" : "Order in progress";

	models.Order.create(order).then((order) => {
		res.json({ message, order });
	});
});

/** Update order */
Router.put("/orders/update/:orderId", authenticateToken, async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.orderId);
	const { status, pizzas } = req.body;
	const message: string = "Order info updated";

	if (status === "finish") {
		(pizzas as IPizza[]).map((p) => {
			const pizzaId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(p._id);

			if (p.qty > 0) {
				models.Pizza.updateOne({ _id: pizzaId }, { $set: { qty: p.qty - 1 } });
			}
		});
	}

	const data = await models.Order.updateOne({ _id }, { $set: { status } }, { upsert: true });

	// Send a mail for notification

	if (data.modifiedCount === 1) res.json({ message });
});

/* -------------------------------------------------------------------------- */
/*                              USERS & CONNECTION                            */
/* -------------------------------------------------------------------------- */

/** Get users */
Router.get("/users", authenticateToken, async (req, res) => {
	// exclude password, include other fields
	const users = await models.User.find({}).select("-password");

	return res.json({ message: "Success", users });
});

/** Registration */
Router.post("/registration", async (req, res) => {
	const { password } = req.body.user;
	const { email } = req.body.user;
	const query = models.User.where({ email });
	const user = await query.findOne();

	if (user) {
		return res.json({ message: "User already exist" });
	}

	return hashPass(password, (hash: string) => {
		models.User.create({ ...req.body.user, password: hash }).then(() => {
			res.json({ message: "User created" });
		});
	});
});

/** Login */
Router.post("/login", async (req, res) => {
	const { email, password } = req.body.user;
	const query = models.User.where({ email });
	const user = await query.findOne();

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

/** Create admin */
Router.post("/admins/create", async (req, res) => {
	const { email, password } = req.body.user;
	const query = models.User.where({ email });
	const user = await query.findOne();

	if (user) {
		return res.json({ message: "User already exist" });
	}

	return bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash: string) => {
			models.User.create({ ...req.body.user, role: "Administrateur", password: hash }).then(() => {
				res.json({ message: "User created" });
			});
		});
	});
});

/** Create user by admin */
Router.post("/users/create", authenticateToken, async (req, res) => {
	const { email, password } = req.body.user;
	const query = models.User.where({ email });
	const user = await query.findOne();

	if (user) {
		return res.json({ message: "User already exist" });
	}

	return bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash: string) => {
			models.User.create({ ...req.body.user, password: hash }).then((user) => {
				res.json({ message: "User created", user });
			});
		});
	});
});

/** Update user by admin */
Router.put("/users/update/:userId", authenticateToken, (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.userId);
	const message: string = "User info updated";
	const user = { ...req.body };
	const result = async (password?: string) => {
		if (password) user.password = password;
		const data = await models.User.updateOne({ _id }, { $set: { ...user } }, { upsert: true });

		if (data.modifiedCount === 1) res.json({ message });
	};

	if (req.body.password) {
		const { password } = req.body;

		hashPass(password, (hash: string) => result(hash));
	}

	return result();
});

/** Delete user by admin */
Router.delete("/users/delete/:userId", authenticateToken, async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.userId);
	const message: string = "User deleted";

	await models.User.deleteOne({ _id });
	res.json({ message });
});

/** Logout */
Router.post("/logout", authenticateToken, (req, res) => {
	res.json({ message: "User deconnected" });
});

module.exports = Router;
