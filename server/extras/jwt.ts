const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next: () => void): void => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) return res.json({ message: "Token not found" });

	jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err: { name: string }, user: any) => {
		console.log("authenticateToken err", err);

		if (err) {
			if (err.name === "TokenExpiredError") return res.json({ message: "Token expired" });
			if (err.name === "JsonWebTokenError") return res.json({ message: "Token invalid" });
		}

		next();
	});
};

const generateAccessToken = (email: string): string => {
	return jwt.sign({ email }, process.env.JWT_TOKEN_SECRET, { expiresIn: "6h" });
};

export { authenticateToken, generateAccessToken };
