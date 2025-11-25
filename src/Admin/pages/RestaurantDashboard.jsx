import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMerchant, logout } from "../../State/Authentication/Action";
import { Header } from "../components/Layouts/Header";
import { Sidebar } from "../components/Layouts/Sidebar";
import { DashboardHome } from "./DashboardHome";
import { MenuManagementPage } from "./MenuManagementPage";
import { OrdersPage } from "./OrdersPage";

export default function RestaurantDashboard() {
  const [currentPage, setCurrentPage] = useState("orders");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  const ownerId = user?.id;
  console.log("ownerId", ownerId);

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const { jwt, merchant } = useSelector((state) => state.auth);
  console.log(merchant);

  useEffect(() => {
    dispatch(getMerchant(ownerId || merchant?.ownerId, jwt));
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <DashboardHome />;
      case "menu":
        return <MenuManagementPage />;
      case "orders":
        return <OrdersPage />;
      default:
        return <div>Đang phát triển...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header storeName={merchant?.name} onClick={handleLogout} />
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-20 md:ml-16 lg:ml-64 pb-20 md:pb-0">
        {renderPage()}
      </main>
    </div>
  );
}
