import mongoose from "mongoose";
import { IPizza } from "../../src/interfaces";

const { Schema } = mongoose;

const pizzaSchema = new mongoose.Schema<IPizza>(
	{
		name: Schema.Types.String,
		price: Schema.Types.Number,
		description: Schema.Types.String,
		qty: Schema.Types.Number,
		img_path: Schema.Types.String,
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

const Pizza = mongoose.model<IPizza>("Pizza", pizzaSchema);

export default Pizza;
