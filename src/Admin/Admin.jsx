import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./Dashboard/AdminDashboard";
import AdminSidebar from "./AdminSidebar";
import RestaurantDashboard from "./Dashboard/RestaurantDashboard";
import RestaurantsOrder from "./Orders/RestaurantsOrder";
import RestaurantsMenu from "./Food/RestaurantsMenu";
import AddMenuForm from "./Food/AddMenuForm";
import CreateRestaurantForm from "./AddRestaurants/CreateRestaurantForm";
import IngredientTable from "./Events/Events";
import Category from "./Category/Category";
import Ingredients from "./Ingredients/Ingredients";
import { useDispatch, useSelector } from "react-redux";
import {
	getIngredientCategory,
	getIngredientsOfRestaurant,
} from "../State/Admin/Ingredients/Action";
import { getRestaurantsCategory } from "../State/Customers/Restaurant/restaurant.action";
import Details from "./Details/Details";
import AdminNavbar from "./AdminNavbar";
import { getUsersOrders } from "../State/Customers/Orders/Action";
import { fetchRestaurantsOrder } from "../State/Admin/Order/restaurants.order.action";
import OrderPage from "./Orders/OrdersPage";
import MenuManagement from "./Food/MenuManagement";
const Admin = () => {
	const dispatch = useDispatch();
	const [openSideBar, setOpenSideBar] = useState(false);
	const handleOpenSideBar = () => setOpenSideBar(true);
	const handleCloseSideBar = () => setOpenSideBar(false);
	const { auth, restaurant, ingredients } = useSelector((store) => store);
	const jwt = localStorage.getItem("jwt");
	useEffect(() => {
		if (restaurant.usersRestaurant) {
			dispatch(
				getIngredientCategory({ jwt, id: restaurant.usersRestaurant?.id })
			);
			dispatch(
				getIngredientsOfRestaurant({ jwt, id: restaurant.usersRestaurant?.id })
			);
			dispatch(
				getRestaurantsCategory({
					jwt: auth.jwt || jwt,
					restaurantId: restaurant.usersRestaurant?.id,
				})
			);

			dispatch(
				fetchRestaurantsOrder({
					restaurantId: restaurant.usersRestaurant?.id,
					jwt: auth.jwt || jwt,
				})
			);
		}
	}, [restaurant.usersRestaurant]);
	return (
		<div className="bg-gray-100 min-h-screen">
			<div className="">
				<AdminSidebar handleClose={handleCloseSideBar} open={openSideBar} />
			</div>
			<div className="lg:ml-64">
				<AdminNavbar handleOpenSideBar={handleOpenSideBar} />

				<div className=" pt-5 bg-gray bg-white">
					<Routes>
						<Route path="/" element={<RestaurantDashboard />} />
						<Route path="/add-menu" element={<AddMenuForm />} />
						<Route path="/add-restaurant" element={<CreateRestaurantForm />} />
						<Route path="/event" element={<IngredientTable />} />
						<Route path="/ingredients" element={<Ingredients />} />
						<Route path="/category" element={<Category />} />
						<Route path="/details" element={<Details />} />
						<Route path="/order" element={<OrderPage />} />
						<Route path="/menu" element={<MenuManagement />} />
					</Routes>
				</div>
			</div>
		</div>
	);
};

export default Admin;
