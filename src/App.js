import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Routers from "./Routers/Routers";
import { getUser } from "./State/Authentication/Action";
import darkTheme from "./theme/DarkTheme";

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const user = useSelector((state) => state.auth?.user);
  const jwt = localStorage.getItem("jwt") || auth.jwt;

  useEffect(() => {
    if (!jwt) return;

    // Try to get id from user object (common shape: user.id)
    let id = user?.id || user?.data?.id || user?.userId;

    // If no id in state, try to decode JWT payload (robust fallback)
    if (!id && jwt) {
      try {
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        id = payload?.id || payload?.sub || payload?.userId || payload?.uid;
      } catch (e) {
        // ignore decode errors
      }
    }

    if (id) {
      dispatch(getUser({ id, jwt }));
    }
  }, []);

  // useEffect(() => {
  //   if (user?.role === "ROLE_RESTAURANT_OWNER") {
  //     dispatch(getRestaurantByUserId(auth.jwt || jwt));
  //   }
  // }, [user, auth.jwt, dispatch, jwt]);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routers />
    </ThemeProvider>
  );
}

export default App;
