import mongoose from "mongoose";

const Schema = mongoose.Schema;

const pizzaSchema = new mongoose.Schema(
	{
		// _id: Schema.Types.ObjectId,
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

const Pizza = mongoose.model("Pizza", pizzaSchema);

export default Pizza;
