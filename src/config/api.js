import axios from "axios";

export const API_URL =
	process.env.REACT_APP_API_URL ||
	"https://food-fast-frontend.vercel.app/api/v1";

export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});
