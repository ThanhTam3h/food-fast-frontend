import { Route, Routes } from "react-router-dom";
import Drone from "./Drone/Drone";
import SuperAdminApprove from "./Restaurants/SuperAdminApprove";
import SuperAdminMerchant from "./Restaurants/SuperAdminRestaurant";
import SuperAdminCustomer from "./SuperAdminCustomerTable/Customers";
import SuperAdminDashboard from "./SuperAdminDashboard/SuperAdminDashboard";
import SuperAdminSidebar from "./SuperAdminSideBar";

import OrderDrone  from "./OrderDrone/OrderDrone";
import DroneHub from "./DroneHub/DroneHub";

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
          <Route path="/drone" element={<Drone />} />
          <Route path="/drone-order" element={<OrderDrone />} />
          <Route path="/drone-hub" element={<DroneHub />} />
        </Routes>
      </div>
    </div>
  );
};

export default SuperAdmin;
