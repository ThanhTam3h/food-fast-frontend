import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./State/Authentication/Action";
import { getRestaurantByUserId } from "./State/Customers/Restaurant/restaurant.action";
import Routers from "./Routers/Routers";
import lightTheme from "./theme/LightTheme";

function App() {
	const dispatch = useDispatch();
	const { auth } = useSelector((store) => store);
	useEffect(() => {
		// Chỉ chạy khi:
		// 1. auth.jwt đã được nạp (từ redux-persist)
		// 2. auth.user cũng đã được nạp (và có id)
		if (auth.jwt && auth.user?.id) {
			dispatch(getUser({ id: auth.user.id, jwt: auth.jwt }));
		}
	}, [dispatch, auth.jwt, auth.user?.id]); // <-- Phụ thuộc vào state của Redux

	// 2. useEffect để lấy nhà hàng (nếu là chủ)
	useEffect(() => {
		if (auth.jwt && auth.user?.role === "ROLE_RESTAURANT_OWNER") {
			dispatch(getRestaurantByUserId(auth.jwt));
		}
	}, [dispatch, auth.jwt, auth.user?.role]);
	return (
		<ThemeProvider theme={lightTheme}>
			<CssBaseline />
			<Routers />
		</ThemeProvider>
	);
}

export default App;
