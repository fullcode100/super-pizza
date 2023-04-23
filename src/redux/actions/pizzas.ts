import { IPizza } from "src/interfaces";
import { Dispatch } from "redux";

import { updateLoading } from "src/redux/actions";
import axiosInstance from "src/js/Axios";
import { SET_PIZZAS, CREATE_PIZZA, UPDATE_PIZZA, DELETE_PIZZA } from "../constants";

export const getPizzas = () => async (dispatch: Dispatch) => {
	updateLoading("pizzas", true);
	await axiosInstance()
		.get("/pizzas")
		.then(({ data }) => {
			const { pizzas } = data;

			dispatch({
				type: SET_PIZZAS,
				payload: { pizzas },
			});
		});
};

export const createPizza = (pizza: IPizza) => async (dispatch: Dispatch) => {
	dispatch({
		type: CREATE_PIZZA,
		payload: { pizza },
	});
	setTimeout(() => dispatch(updateLoading("pizzas", false)), 600);
};

export const updatePizza = (pizza: IPizza) => async (dispatch: Dispatch) => {
	dispatch({
		type: UPDATE_PIZZA,
		payload: { pizza },
	});
	setTimeout(() => dispatch(updateLoading("pizzas", false)), 600);
};

export const deletePizza = (pizza: IPizza) => async (dispatch: Dispatch) => {
	dispatch({
		type: DELETE_PIZZA,
		payload: { pizza },
	});
	setTimeout(() => dispatch(updateLoading("pizzas", false)), 600);
};
