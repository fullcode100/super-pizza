/* eslint-disable import/no-import-module-exports */
import express, { Router as IRouter } from "express";
import bcrypt from "bcrypt";

import { hashPass } from "../extras/helpers";
import models from "../extras/mongodb";
import { authenticateToken, generateAccessToken } from "../extras/jwt";

const Router: IRouter = express.Router();

/** Registration */
Router.post("/registration", async (req, res) => {
	const { email, password } = req.body.user;
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

/** Logout */
Router.post("/logout", authenticateToken, (req, res) => {
	res.json({ message: "User deconnected" });
});

module.exports = Router;
