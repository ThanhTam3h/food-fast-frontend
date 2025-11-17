import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMenuItemsByRestaurantId } from "../../State/Customers/Menu/menu.action";
import { Grid } from "@mui/material";
import OrdersPage from "../Orders/OrdersPage";
import MenuItemTable from "../Food/MenuItemTable";
import AvgCard from "../ReportCard/ReportCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SellIcon from "@mui/icons-material/Sell";
import FastfoodIcon from "@mui/icons-material/Fastfood";

const RestaurantDashboard = () => {
	const { id } = useParams();
	const { restaurant } = useSelector((store) => store);
	const dispatch = useDispatch();
	const jwt = localStorage.getItem("jwt");

	useEffect(() => {
		if (restaurant.usersRestaurant) {
			dispatch(
				getMenuItemsByRestaurantId({
					restaurantId: restaurant.usersRestaurant.id,
					jwt: jwt,
				})
			);
		}
	}, [restaurant.usersRestaurant, dispatch, jwt]);

	return (
		<div className="p-6 md:p-8">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">
				Trang Chủ Dashboard
			</h1>

			<Grid container spacing={3}>
				<Grid item lg={3} xs={12}>
					<AvgCard
						title={"Total Earnings"}
						value={`Rs. ${450}`}
						growValue={70}
						icon={
							<CurrencyRupeeIcon sx={{ fontSize: "3rem", color: "gold" }} />
						}
					/>
				</Grid>
				<Grid item lg={3} xs={12}>
					<AvgCard
						title={"Total Selles"}
						value={`${390}`}
						growValue={35}
						icon={<SellIcon sx={{ fontSize: "3rem", color: "green" }} />}
					/>
				</Grid>

				<Grid lg={6} xs={12} item>
					<OrdersPage name={"Recent Order"} isDashboard={true} />
				</Grid>
				<Grid lg={6} xs={12} item>
					<MenuItemTable isDashboard={true} name={"Recently Added Menu"} />
				</Grid>
			</Grid>
		</div>
	);
};

export default RestaurantDashboard;
