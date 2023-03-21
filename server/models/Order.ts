import mongoose from "mongoose";
import { IOrder } from "../../src/interfaces";

const { Schema } = mongoose;

const orderSchema = new mongoose.Schema<IOrder>(
	{
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

const Order = mongoose.model<IOrder>("Order", orderSchema);

export { orderSchema };
export default Order;
