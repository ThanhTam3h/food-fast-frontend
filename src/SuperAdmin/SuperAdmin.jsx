import React from "react";
import { Route, Routes } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSideBar";
import SuperAdminDashboard from "./SuperAdminDashboard/SuperAdminDashboard";
import SuperAdminCustomer from "./SuperAdminCustomerTable/Customers";
import SuperAdminMerchant from "./Restaurants/SuperAdminRestaurant";
import SuperAdminApprove from "./Restaurants/SuperAdminApprove";

const SuperAdmin = () => {
	return (
		<div className="flex justify-between bg-gray-100 min-h-screen text-gray-800 font-sans">
			{/* Sidebar cố định bên trái */}
			<div className="w-[20vw] h-full fixed top-0 left-0 border-r border-gray-200 bg-white z-10">
				<SuperAdminSidebar />
			</div>

			{/* Content bên phải */}
			<div className="w-[80vw] ml-[20vw] p-6">
				<Routes>
					<Route path="/" element={<SuperAdminDashboard />} />
					<Route path="/customers" element={<SuperAdminCustomer />} />
					<Route path="/merchants" element={<SuperAdminMerchant />} />
					<Route path="/approve" element={<SuperAdminApprove />} />
				</Routes>
			</div>
		</div>
	);
};

export default SuperAdmin;
