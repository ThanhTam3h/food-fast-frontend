import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  getIngredientCategory,
  getIngredientsOfRestaurant,
} from "../State/Admin/Ingredients/Action";
import { fetchRestaurantsOrder } from "../State/Admin/Order/restaurants.order.action";
import { getRestaurantsCategory } from "../State/Customers/Restaurant/restaurant.action";
import CreateRestaurantForm from "./AddRestaurants/CreateRestaurantForm";
import AdminNavbar from "./AdminNavbar";
import Category from "./Category/Category";
import Details from "./Details/Details";
import IngredientTable from "./Events/Events";
import AddMenuForm from "./Food/AddMenuForm";
import RestaurantsMenu from "./Food/RestaurantsMenu";
import Ingredients from "./Ingredients/Ingredients";
import RestaurantsOrder from "./Orders/RestaurantsOrder";
import RestaurantDashboard from "./pages/RestaurantDashboard";

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
    <div>
      <AdminNavbar handleOpenSideBar={handleOpenSideBar} />
      <div className="lg:flex justify-between">
        {/* <div className="">
          <AdminSidebar handleClose={handleCloseSideBar} open={openSideBar} />
        </div> */}

        <div className="w-full">
          <Routes>
            <Route path="/" element={<RestaurantDashboard />} />
            <Route path="/orders" element={<RestaurantsOrder />} />
            <Route path="/menu" element={<RestaurantsMenu />} />
            <Route path="/add-menu" element={<AddMenuForm />} />
            <Route path="/add-restaurant" element={<CreateRestaurantForm />} />
            <Route path="/event" element={<IngredientTable />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/category" element={<Category />} />
            <Route path="/details" element={<Details />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
