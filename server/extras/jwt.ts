import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import path from "path";

require("dotenv").config({ path: path.join(__dirname, "/../.env") });

const JWT_TOKEN_SECRET = process.env["JWT_TOKEN_SECRET"] as string;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.json({ message: "Token not found" });
	// eslint-disable-next-line no-unused-vars
	return jwt.verify(token, JWT_TOKEN_SECRET, (err: any) => {
		console.log("authenticateToken err", err);

		if (err) {
			if (err.name === "TokenExpiredError") return res.json({ message: "Token expired" });
			if (err.name === "JsonWebTokenError") return res.json({ message: "Token invalid" });
		}

		return next();
	});
};

export const generateAccessToken = (email: string): string => jwt.sign({ email }, JWT_TOKEN_SECRET, { expiresIn: "6h" });
