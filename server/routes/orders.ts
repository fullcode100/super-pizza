/* eslint-disable import/no-import-module-exports */
import mongoose from "mongoose";
import express, { Router as IRouter } from "express";

import { IOrder, IPizza, ISettings, IUser } from "../../src/interfaces";
import models from "../extras/mongodb";
import { orderNumber } from "../extras/helpers";

const Router: IRouter = express.Router();

/** Create order */
Router.post("/create", async (req, res) => {
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
Router.put("/update/:orderId", async (req, res) => {
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

/** Get orders */
Router.get("/", async (req, res) => {
	const orders = await models.Order.find({}).populate("pizzas").populate({
		path: "user",
		select: "-password",
	});

	res.json({ message: "Success", orders });
});

/** Get order by id */
Router.get("/:userId", async (req, res) => {
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

module.exports = Router;
