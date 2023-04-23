import { UPDATE_LOADING } from "../constants";

export const updateLoading = (key: string, value: boolean) => ({
	type: UPDATE_LOADING,
	key,
	value,
});
