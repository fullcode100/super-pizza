/* eslint-disable import/no-import-module-exports */
import mongoose from "mongoose";
import express, { Router as IRouter } from "express";
import bcrypt from "bcrypt";
import models from "../extras/mongodb";
import { hashPass } from "../extras/helpers";

const Router: IRouter = express.Router();
const SALT_ROUNDS = 10;

/** Get users */
Router.get("/", async (req, res) => {
	// exclude password, include other fields
	const users = await models.User.find({}).select("-password");

	return res.json({ message: "Success", users });
});

/** Create user by admin */
Router.post("/create", async (req, res) => {
	const { email, password } = req.body.user;
	/** Create admin (only for test, create first admin manually) */
	const { isAdmin = false } = req.body;
	const query = models.User.where({ email });
	const user = await query.findOne();

	if (user) {
		return res.json({ message: "User already exist" });
	}

	return bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash: string) => {
			const role = isAdmin ? "Administrateur" : "Utilisateur";

			models.User.create({ ...req.body.user, role, password: hash }).then((user) => {
				res.json({ message: "User created", user });
			});
		});
	});
});

/** Update user by admin */
Router.put("/update/:userId", (req, res) => {
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
Router.delete("/delete/:userId", async (req, res) => {
	const _id = new mongoose.Types.ObjectId(req.params.userId);
	const message: string = "User deleted";

	await models.User.deleteOne({ _id });
	res.json({ message });
});

module.exports = Router;
