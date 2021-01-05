// const MongoClient = require("mongodb");
import mongoose from "mongoose";

import User from "./models/User";
import Order from "./models/Order";
import Pizza from "./models/Pizza";
import Settings from "./models/Setting";

const dbConnect = () => {
	return mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});
};

const models = { Settings, Pizza, User, Order };

export { dbConnect };
export default models;
