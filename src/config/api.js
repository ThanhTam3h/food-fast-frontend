import axios from "axios";

export const API_URL = "http://localhost:3000/api/v1";

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});
// 1. Interceptor đính kèm JWT vào Header của Request
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("jwt");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 2. Interceptor xử lý lỗi 401 từ Response
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response && error.response.status === 401) {
			console.error(
				"401 Unauthorized: Clearing token and redirecting to login."
			);
			// Tự động xóa token khi bị 401
			localStorage.removeItem("jwt");
			// Dọn dẹp Redux State (nếu cần)
			// window.location.href = "/super-admin/login"; // Có thể chuyển hướng cứng
		}
		return Promise.reject(error);
	}
);
