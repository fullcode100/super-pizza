import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema(
	{
		// _id: Schema.Types.ObjectId,
		n_order: Schema.Types.String,
		status: Schema.Types.Mixed,
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		pizzas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pizza" }],
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
