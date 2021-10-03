import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.json({ message: "Token not found" });
	// eslint-disable-next-line no-unused-vars
	return jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err: { name: string }) => {
		console.log("authenticateToken err", err);

		if (err) {
			if (err.name === "TokenExpiredError") return res.json({ message: "Token expired" });
			if (err.name === "JsonWebTokenError") return res.json({ message: "Token invalid" });
		}

		return next();
	});
};

const generateAccessToken = (email: string): string => {
	return jwt.sign({ email }, process.env.JWT_TOKEN_SECRET, { expiresIn: "6h" });
};

export { authenticateToken, generateAccessToken };
