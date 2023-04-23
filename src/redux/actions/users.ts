import { IUser } from "src/interfaces";
import { Dispatch } from "redux";

import { updateLoading } from "src/redux/actions";
import axiosInstance from "src/js/Axios";
import { SET_USERS, CREATE_USER, UPDATE_USER, DELETE_USER } from "../constants";

export const createUser = (user: IUser) => async (dispatch: Dispatch) => {
	dispatch({
		type: CREATE_USER,
		payload: { user },
	});
	setTimeout(() => dispatch(updateLoading("users", false)), 600);
};

export const updateUser = (user: IUser) => async (dispatch: Dispatch) => {
	dispatch({
		type: UPDATE_USER,
		payload: { user },
	});
	setTimeout(() => dispatch(updateLoading("users", false)), 600);
};

export const deleteUser = (user: IUser) => async (dispatch: Dispatch) => {
	dispatch({
		type: DELETE_USER,
		payload: { user },
	});
	setTimeout(() => dispatch(updateLoading("users", false)), 600);
};

export const getUsers = () => async (dispatch: Dispatch) => {
	updateLoading("users", true);
	await axiosInstance()
		.get("/users")
		.then(({ data }) => {
			const { users } = data;

			dispatch({
				type: SET_USERS,
				payload: { users },
			});
		});
};
