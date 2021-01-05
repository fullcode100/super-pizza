import mongoose from "mongoose";

export interface IUser {
	_id?: string;
	username: string;
	email: string;
	role: string;
	password: string;
	created_at?: string;
}

export interface IOrder {
	_id?: string;
	n_order: string;
	pizzas: mongoose.Types.ObjectId[];
	user: mongoose.Types.ObjectId;
	status: "waiting" | "in_progress" | "ready" | "finish";
	created_at?: string;
}

export interface IPizza {
	_id?: string;
	name: string;
	price: string;
	description: string;
	qty: number;
	img_path?: string;
	created_at?: string;
}

export interface State {
	users: IUser[];
	user: IUser;
	orders: IOrder[];
	pizzas: IPizza[];
	cart: IPizza[];
	settings: any;
	loading: {
		[x: string]: boolean;
	};
}

export interface ISettings {
	[x: string]: any;
}
