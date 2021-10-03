import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
	{
		// _id: Schema.Types.ObjectId,
		username: Schema.Types.String,
		email: Schema.Types.String,
		role: Schema.Types.String,
		password: Schema.Types.String,
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

userSchema.pre("remove", function (next) {
	this.model("Order").deleteMany({ user: this._id }, next as any);
});

const User = mongoose.model("User", userSchema);

export default User;
