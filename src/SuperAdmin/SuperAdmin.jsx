import React from "react";
import { Route, Routes } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSideBar";
import Customers from "./SuperAdminCustomerTable/Customers";
import SuperAdminRestaurant from "./Restaurants/SuperAdminRestaurant";
import RestaurantRequest from "./RestaurantRequest/RestaurantRequest";
import SuperAdminDashboard from "./SuperAdminDashboard/SuperAdminDashboard";
import { useState } from "react";

const SuperAdmin = () => {
	const [openSideBar, setOpenSideBar] = useState(false);
	const handleOpenSideBar = () => setOpenSideBar(true);
	const handleCloseSideBar = () => setOpenSideBar(false);

	return (
		<div className="lg:flex justify-between">
			<div className="">
				<SuperAdminSidebar
					handleClose={handleCloseSideBar}
					open={openSideBar}
				/>
			</div>

			<div className="flex-1 p-6 md:p-8">
				<Routes>
					<Route path="/" element={<SuperAdminDashboard />}></Route>
					<Route path="/customers" element={<Customers />}></Route>
					<Route path="/restaurants" element={<SuperAdminRestaurant />}></Route>
					<Route
						path="/restaurant-request"
						element={<RestaurantRequest />}></Route>
				</Routes>
			</div>
		</div>
	);
};

export default SuperAdmin;
