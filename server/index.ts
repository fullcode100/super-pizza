import path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import { dbConnect } from "./extras/mongodb";
import { authenticateToken } from "./extras/jwt";

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app: express.Express = express();
const dev: boolean = process.env["NODE_ENV"] === "development";
const port = process.env["APP_PORT"] || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }) as any);

if (!dev) {
	app.use(express.static(path.join(`${__dirname}/../`)));

	app.get("/", (req, res) => {
		res.sendFile("./index.html", { root: `${__dirname}/../` });
	});
}

app.use("/auth", require("./routes/auth"));

app.use("/orders", authenticateToken, require("./routes/orders"));

app.use("/pizzas", require("./routes/pizzas"));

app.use("/settings", authenticateToken, require("./routes/settings"));

app.use("/users", authenticateToken, require("./routes/users"));

dbConnect().catch((err) => console.log(err));

app.listen(port, () => console.log(`Server listen on PORT ${port}`));

export { dev };
export default app;
