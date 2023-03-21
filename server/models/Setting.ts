import mongoose from "mongoose";
import { ISettings } from "../../src/interfaces";

const { Schema } = mongoose;

const settingsSchema = new mongoose.Schema<ISettings>({
	order_capacity_by_hour: Schema.Types.Number,
});

const Setting = mongoose.model<ISettings>("Setting", settingsSchema);

export default Setting;
