import Swal from "sweetalert2";

import axiosInstance from "../js/Axios";
import { isAdmin, signout } from "../js/Helpers";

import {
	SET_ORDERS,
	SET_PIZZAS,
	CREATE_PIZZA,
	SET_USERS,
	UPDATE_LOADING,
	UPDATE_PIZZA,
	DELETE_PIZZA,
	CREATE_USER,
	SET_LOGIN,
	SET_LOGOUT,
	UPDATE_USER,
	DELETE_USER,
	UPDATE_ORDER,
	DELETE_ORDER,
	UPDATE_SETTING,
	SET_SETTINGS,
	ADD_TO_CART,
	REMOVE_FROM_CART,
} from "../constants/action-types";

import { IOrder, IPizza, IUser } from "src/interfaces/interfaces";

/* -------------------------------------------------------------------------- */
/*                                    USERS                                   */
/* -------------------------------------------------------------------------- */

export const createUser = (user: IUser) => async (dispatch) => {
	dispatch({
		type: CREATE_USER,
		payload: { user },
	});
	setTimeout(() => dispatch(updateLoading("users", false)), 600);
};

export const updateUser = (user: IUser) => async (dispatch) => {
	dispatch({
		type: UPDATE_USER,
		payload: { user },
	});
	setTimeout(() => dispatch(updateLoading("users", false)), 600);
};

export const deleteUser = (user: IUser) => async (dispatch) => {
	dispatch({
		type: DELETE_USER,
		payload: { user },
	});
	setTimeout(() => dispatch(updateLoading("users", false)), 600);
};

export const getUsers = () => async (dispatch) => {
	updateLoading("users", true);
	await axiosInstance()
		.get("/users")
		.then(({ data }) => {
			const users: IUser[] = data.users;

			dispatch({
				type: SET_USERS,
				payload: { users },
			});
		});
};

export const login = (user: IUser, showModal: boolean = true) => {
	showModal &&
		Swal.fire({
			title: "Connexion",
			text: "Vous êtes authentifié(e) !",
			icon: "success",
			confirmButtonText: "OK",
		});
	window.localStorage.setItem("user", JSON.stringify(user));

	return {
		type: SET_LOGIN,
		payload: { user },
	};
};

export const logout = () => (dispatch) => {
	axiosInstance().post("/logout");
	signout("Vous êtes déconnecté(e) !", () => {
		dispatch({ type: SET_LOGOUT });
	});
};

/* -------------------------------------------------------------------------- */
/*                                   ORDERS                                   */
/* -------------------------------------------------------------------------- */

export const addToCart = (pizza: IPizza) => async (dispatch) => {
	dispatch({
		type: ADD_TO_CART,
		pizza,
	});
};

export const removeFromCart = (pizza: IPizza) => async (dispatch) => {
	dispatch({
		type: REMOVE_FROM_CART,
		pizza,
	});
};

export const getOrders = (user: IUser) => async (dispatch) => {
	const path = !isAdmin(user) ? `/orders/${user._id}` : "/orders";

	updateLoading("orders", true);
	await axiosInstance()
		.get(path)
		.then(({ data }) => {
			const orders: IOrder[] = data.orders;

			dispatch({
				type: SET_ORDERS,
				payload: { orders },
			});
		});
};

export const updateOrder = (order: IOrder) => async (dispatch) => {
	dispatch({
		type: UPDATE_ORDER,
		payload: { order },
	});
	setTimeout(() => dispatch(updateLoading("orders", false)), 600);
};

export const deleteOrder = (order: IOrder) => async (dispatch) => {
	dispatch({
		type: DELETE_ORDER,
		payload: { order },
	});
	setTimeout(() => dispatch(updateLoading("orders", false)), 600);
};

/* -------------------------------------------------------------------------- */
/*                                   PIZZAS                                   */
/* -------------------------------------------------------------------------- */

export const getPizzas = () => async (dispatch) => {
	updateLoading("pizzas", true);
	await axiosInstance()
		.get("/pizzas")
		.then(({ data }) => {
			const pizzas: IPizza[] = data.pizzas;

			dispatch({
				type: SET_PIZZAS,
				payload: { pizzas },
			});
		});
};

export const createPizza = (pizza: IPizza) => async (dispatch) => {
	dispatch({
		type: CREATE_PIZZA,
		payload: { pizza },
	});
	setTimeout(() => dispatch(updateLoading("pizzas", false)), 600);
};

export const updatePizza = (pizza: IPizza) => async (dispatch) => {
	dispatch({
		type: UPDATE_PIZZA,
		payload: { pizza },
	});
	setTimeout(() => dispatch(updateLoading("pizzas", false)), 600);
};

export const deletePizza = (pizza: IPizza) => async (dispatch) => {
	dispatch({
		type: DELETE_PIZZA,
		payload: { pizza },
	});
	setTimeout(() => dispatch(updateLoading("pizzas", false)), 600);
};

/* -------------------------------------------------------------------------- */

export const updateLoading = (key: string, value: boolean) => {
	return {
		type: UPDATE_LOADING,
		key,
		value,
	};
};

/* -------------------------------------------------------------------------- */
/*                                  SETTINGS                                  */
/* -------------------------------------------------------------------------- */

export const getSettings = (settings) => async (dispatch) => {
	await axiosInstance()
		.get("/settings")
		.then(({ data }) => {
			const settings: IPizza[] = data.settings;

			dispatch({
				type: SET_SETTINGS,
				settings,
			});
		});
};

export const updateSettings = (setting) => {
	return {
		type: UPDATE_SETTING,
		setting,
	};
};
