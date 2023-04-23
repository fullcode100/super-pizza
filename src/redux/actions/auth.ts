import Swal from "sweetalert2";

import { IUser } from "src/interfaces";

import axiosInstance from "src/js/Axios";
import { SET_LOGIN, SET_LOGOUT } from "../constants";

export const login = (user: IUser, showModal: boolean = true) => {
	if (showModal) {
		Swal.fire({
			title: "Connexion",
			text: "Vous êtes authentifié(e) !",
			icon: "success",
			confirmButtonText: "OK",
		});
	}

	window.localStorage.setItem("user", JSON.stringify(user));

	return {
		type: SET_LOGIN,
		payload: { user },
	};
};

// eslint-disable-next-line no-unused-vars
export const logout = () => async (dispatch: (arg0: any) => void) => {
	await axiosInstance()
		.post("/auth/logout")
		.then((response) => {
			const { data } = response;

			if (data.message === "User deconnected") {
				window.localStorage.removeItem("token");
				window.localStorage.removeItem("user");

				dispatch({ type: SET_LOGOUT });
				Swal.fire({
					title: "Déconnexion",
					text: "Vous êtes déconnecté(e) !",
					icon: "success",
					confirmButtonText: "OK",
				}).then((res) => {
					if (res.isConfirmed) {
						window.location.href = "/";
					}
				});
			}
		});
};
