import {
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore,
} from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // mặc định dùng localStorage
import thunk from "redux-thunk";

// reducers
import { ingredientReducer } from "../Admin/Ingredients/Reducer";
import restaurantsOrderReducer from "../Admin/Order/restaurants.order.reducer";
import authReducer from "../Authentication/Reducer";
import cartReducer from "../Customers/Cart/Reducer";
import menuItemReducer from "../Customers/Menu/Reducer";
import { orderReducer } from "../Customers/Orders/order.reducer";
import restaurantReducer from "../Customers/Restaurant/Reducer";
import superAdminReducer from "../SuperAdmin/superAdmin.reducer";
import { menuReducer } from "../Admin/Menu/Reducer";

// --- B1: gộp reducers
const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  menu: menuItemReducer,
  menuMerchant: menuReducer,
  cart: cartReducer,
  order: orderReducer,
  restaurantsOrder: restaurantsOrderReducer,
  ingredients: ingredientReducer,
  superAdmin: superAdminReducer,
});

// --- B2: cấu hình persist (chỉ lưu reducer auth)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // chỉ lưu state auth
};

// --- B3: tạo persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// --- B4: tích hợp Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// --- B5: tạo store
export const store = legacy_createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// --- B6: tạo persistor
export const persistor = persistStore(store);


