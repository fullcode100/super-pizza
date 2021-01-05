import mongoose from "mongoose";

const Schema = mongoose.Schema;

const settingsSchema = new mongoose.Schema({
	order_capacity_by_hour: Schema.Types.Number,
});

const Setting = mongoose.model("Setting", settingsSchema);

export default Setting;
