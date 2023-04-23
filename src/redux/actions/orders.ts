import Swal from "sweetalert2";

import { IOrder, IPizza, IUser } from "src/interfaces";
import { Dispatch } from "redux";

import { isAdmin } from "src/js/Helpers";
import { updateLoading } from "src/redux/actions";
import axiosInstance from "src/js/Axios";
import { SET_ORDERS, UPDATE_ORDER, DELETE_ORDER, ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "../constants";

/**
 * Add pizza to cart
 */
export const addToCart = (pizza: IPizza) => async (dispatch: Dispatch) => {
	dispatch({
		type: ADD_TO_CART,
		pizza,
	});
	return Swal.fire({
		title: "Info",
		text: `${pizza.name} à été ajoutée au panier`,
		icon: "info",
		confirmButtonText: "OK",
	});
};

/**
 * Remove pizza from cart
 */
export const removeFromCart = (pizza: IPizza) => async (dispatch: Dispatch) => {
	dispatch({
		type: REMOVE_FROM_CART,
		pizza,
	});
};

/**
 * Clear cart
 */
export const clearCart = () => ({
	type: CLEAR_CART,
});

/**
 * Get orders list
 * @param user
 */
export const getOrders = (user: IUser) => async (dispatch: Dispatch) => {
	const path = !isAdmin(user) ? `/orders/${user._id}` : "/orders";

	updateLoading("orders", true);
	await axiosInstance()
		.get(path)
		.then(({ data }) => {
			const { orders } = data;

			dispatch({
				type: SET_ORDERS,
				payload: { orders },
			});
		});
};

/**
 * Update an order
 */
export const updateOrder = (order: IOrder) => async (dispatch: Dispatch) => {
	dispatch({
		type: UPDATE_ORDER,
		payload: { order },
	});
	setTimeout(() => dispatch(updateLoading("orders", false)), 600);
};

/**
 * Delete order
 */
export const deleteOrder = (order: IOrder) => async (dispatch: Dispatch) => {
	dispatch({
		type: DELETE_ORDER,
		payload: { order },
	});
	setTimeout(() => dispatch(updateLoading("orders", false)), 600);
};
