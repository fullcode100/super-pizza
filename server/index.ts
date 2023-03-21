import path from "path";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

import { dbConnect } from "./extras/mongodb";

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app: Application = express();
const dev: boolean = process.env.NODE_ENV === "development";
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }) as any);

if (!dev) app.use(express.static(path.join(`${__dirname}/../`)));

app.use(require("./extras/routes"));

dbConnect().catch((err) => console.log(err));

app.listen(port, () => console.log(`Server listen on PORT ${port}`));

export { dev };
export default app;
