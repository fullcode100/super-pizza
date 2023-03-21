import { IOrder, IPizza, IUser, State } from "src/interfaces";
import { AnyAction } from "redux";
import {
	CREATE_PIZZA,
	CREATE_USER,
	DELETE_PIZZA,
	DELETE_USER,
	SET_ORDERS,
	SET_PIZZAS,
	SET_USERS,
	SET_LOGIN,
	SET_LOGOUT,
	UPDATE_LOADING,
	UPDATE_PIZZA,
	UPDATE_SETTING,
	SET_SETTINGS,
	UPDATE_USER,
	ADD_TO_CART,
	REMOVE_FROM_CART,
	CLEAR_CART,
	UPDATE_ORDER,
} from "../constants/action-types";

const initialState: State = {
	users: [],
	orders: [],
	pizzas: [],
	cart: [],
	settings: [],
	user: null,
	loading: {
		app: false,
		users: false,
		orders: false,
		pizzas: false,
		settings: false,
		user: false,
	},
};

// eslint-disable-next-line default-param-last
const rootReducer = (state = initialState, action: AnyAction) => {
	const setLoadingToFalse = (key: string) => ({
		loading: {
			...state.loading,
			[key]: false,
		},
	});
	if (action.type === SET_USERS) {
		const { users } = action.payload;

		return {
			...state,
			users,
			...setLoadingToFalse("users"),
		};
	}
	if (action.type === SET_ORDERS) {
		const { orders } = action.payload;

		return {
			...state,
			...setLoadingToFalse("orders"),
			orders,
		};
	}
	if (action.type === UPDATE_ORDER) {
		const { order } = action.payload;
		const { orders } = state;
		const index: number = orders.findIndex((o: IOrder) => o._id === order._id);
		orders[index] = action.payload.order;

		return { ...state, orders };
	}
	if (action.type === ADD_TO_CART) {
		const cart: IPizza[] = [...state.cart, action.pizza];

		return { ...state, cart };
	}
	if (action.type === CLEAR_CART) {
		return { ...state, cart: [] };
	}
	if (action.type === REMOVE_FROM_CART) {
		const cart = state.cart.filter((c) => c._id !== action.pizza._id);

		return { ...state, cart };
	}
	if (action.type === SET_PIZZAS) {
		const { pizzas } = action.payload;

		return {
			...state,
			pizzas,
			...setLoadingToFalse("pizzas"),
		};
	}
	if (action.type === CREATE_PIZZA) {
		const { pizza } = action.payload;
		const pizzas: IPizza[] = [...state.pizzas, pizza];

		return { ...state, pizzas };
	}
	if (action.type === UPDATE_PIZZA) {
		const { pizzas } = state;
		const index: number = pizzas.findIndex((p: IPizza) => p._id === action.payload.pizza._id);
		pizzas[index] = action.payload.pizza;

		return { ...state, pizzas };
	}
	if (action.type === DELETE_PIZZA) {
		const pizzas = state.pizzas.filter((pizza) => pizza._id !== action.payload.pizza._id);

		return { ...state, pizzas };
	}
	if (action.type === SET_LOGIN) {
		const { user } = action.payload;

		return { ...state, user };
	}
	if (action.type === SET_LOGOUT) {
		return { ...state, user: null };
	}
	if (action.type === CREATE_USER) {
		const { user } = action.payload;
		const users = [...state.users, user];

		return { ...state, users };
	}
	if (action.type === UPDATE_USER) {
		const { users } = state;
		const index = users.findIndex((p: IUser) => p._id === action.payload.user._id);

		users[index] = action.payload.user;

		return { ...state, users };
	}
	if (action.type === DELETE_USER) {
		const users = state.users.filter((user) => user._id !== action.payload.user._id);

		return {
			...state,
			users,
			...setLoadingToFalse("users"),
		};
	}
	if (action.type === UPDATE_LOADING) {
		const { key } = action;
		const { value } = action;
		const loading = {
			...state.loading,
			[key]: value,
		};

		return { ...state, loading };
	}
	if (action.type === SET_SETTINGS) {
		const settings = action.settings || {};

		return {
			...state,
			settings,
			...setLoadingToFalse("settings"),
		};
	}
	if (action.type === UPDATE_SETTING) {
		const { settings } = state;
		const s = action.setting;
		const index = settings.findIndex((st) => st._id === s._id);
		settings[index] = {
			...settings[index],
			...s,
		};

		return {
			...state,
			settings,
			...setLoadingToFalse("settings"),
		};
	}

	return state;
};

export default rootReducer;
