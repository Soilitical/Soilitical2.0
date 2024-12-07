import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json"
	}
});

// Authentication API functions
export const registerUser = (data) =>
	api.post("api/user/register/", {
		username: data.username,
		password: data.password,
		confirm_password: data.confirm_password // Include confirm_password
	});

export const obtainToken = (data) => api.post("api/token/", data);
export const refreshToken = (data) => api.post("api/token/refresh/", data);

// History API functions
export const getUserHistory = () => api.get("api/history/");
export const createUserHistory = (data) => api.post("api/history/", data);
export const deleteUserHistory = (id) => api.delete(`api/history/${id}/`);

// Set Authorization header
export const setAuthToken = (token) => {
	if (token) {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete api.defaults.headers.common["Authorization"];
	}
};

export default api;
