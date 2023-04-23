/* eslint-disable import/no-import-module-exports */
import mongoose from "mongoose";
import express, { Router as IRouter } from "express";

import { IPizza } from "../../src/interfaces";
import models from "../extras/mongodb";
import { authenticateToken } from "../extras/jwt";
import { uploadImgPizza } from "../extras/helpers";

const Router: IRouter = express.Router();

/** Get pizzas */
Router.get("/", async (req, res) => {
	const pizzas = await models.Pizza.find({});

	res.json({ message: "Success", pizzas });
});

/** Create pizza */
Router.post("/create", authenticateToken, async (req, res) => {
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
Router.put("/update/:pizzaId", authenticateToken, async (req, res) => {
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
Router.delete("/delete/:pizzaId", authenticateToken, async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.pizzaId);
	// const pizza = await query.findOne({}).select("img_path");
	// if (pizza) deleteImg(pizza.img_path);
	await models.Pizza.deleteOne({ _id });
	return res.json({ message: "Pizza deleted" });
});

module.exports = Router;
