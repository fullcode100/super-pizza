import mongoose from "mongoose";
import models from "../extras/mongodb";
import { IUser } from "../../src/interfaces";

const userSchema = new mongoose.Schema<IUser>(
	{
		username: mongoose.Schema.Types.String,
		email: mongoose.Schema.Types.String,
		role: mongoose.Schema.Types.String,
		password: mongoose.Schema.Types.String,
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

userSchema.pre("deleteOne", { document: true, query: true }, async function () {
	const query = this.getQuery();

	await models.Order.deleteMany({ user: query._id });
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
