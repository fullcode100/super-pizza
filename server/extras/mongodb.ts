import mongoose from "mongoose";

import User from "../models/User";
import Order from "../models/Order";
import Pizza from "../models/Pizza";
import Settings from "../models/Setting";

const dbConnect = async () => {
	await mongoose.connect(process.env.MONGODB_URI as string, {
		dbName: process.env.MONGODB_NAME,
	});
};

const models = { Settings, Pizza, User, Order };

export { dbConnect };
export default models;
