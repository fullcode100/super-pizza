import axios, { AxiosRequestConfig } from "axios";

const dev = process.env.NODE_ENV === "development";
const baseURL = dev ? `http://localhost:${process.env.PORT || 3000}` : "https://spizz.herokuapp.com/";

const axiosInstance = (config: AxiosRequestConfig = {}) => {
	let defaultConfig: AxiosRequestConfig = {
		baseURL,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		...config,
	};
	const token = window.localStorage.getItem("token");

	if (token) {
		defaultConfig = {
			...defaultConfig,
			headers: {
				...defaultConfig.headers,
				Authorization: `Bearer ${token}`,
			},
		};
	}

	const instance = axios.create(defaultConfig);

	instance.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			// console.warn("Error status", error.response.status);
			// return Promise.reject(error)
			if (error.response) {
				return error.response.data;
			} else {
				return Promise.reject(error);
			}
		}
	);

	return instance;
};

export default axiosInstance;
