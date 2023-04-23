import { Dispatch } from "redux";

import axiosInstance from "src/js/Axios";
import { UPDATE_SETTING, SET_SETTINGS } from "../constants";

export const getSettings = () => async (dispatch: Dispatch) => {
	await axiosInstance()
		.get("/settings")
		.then(({ data }) => {
			const { settings } = data;

			dispatch({
				type: SET_SETTINGS,
				settings,
			});
		});
};

export const updateSettings = (setting) => ({
	type: UPDATE_SETTING,
	setting,
});
