/* eslint-disable import/no-import-module-exports */
import mongoose from "mongoose";
import express, { Router as IRouter } from "express";
import models from "../extras/mongodb";

const Router: IRouter = express.Router();

/** Get settings */
Router.get("/", async (req, res) => {
	const message = "Success";
	const settings = await models.Settings.find({});

	res.json({ message, settings });
});

/** Update settings */
Router.put("/update/:settingId", async (req, res) => {
	const { setting } = req.body;
	const { name } = setting;
	const _id = new mongoose.Types.ObjectId(req.params.settingId);
	const message: string = "Setting updated";
	const data = await models.Settings.updateOne({ _id }, { $set: { [name]: setting[name] } }, { upsert: true });

	if (data.modifiedCount === 1) res.json({ message });
});

module.exports = Router;
