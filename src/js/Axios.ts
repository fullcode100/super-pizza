import axios, { AxiosRequestConfig } from "axios";

const baseURL = "http://localhost:3000";

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
		(response) => response,
		(error) => {
			// console.warn("Error status", error.response.status);
			// return Promise.reject(error)
			if (error.response) return error.response.data;

			return Promise.reject(error);
		}
	);

	return instance;
};

export default axiosInstance;
