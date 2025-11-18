import { useState } from "react";
import { DashboardHome } from "./DashboardHome";
import { MenuManagementPage } from "./MenuManagementPage";
import { OrdersPage } from "./OrdersPage";
import { Header } from "../components/Layouts/Header";
import { Sidebar } from "../components/Layouts/Sidebar";

export default function RestaurantDashboard() {
  const [currentPage, setCurrentPage] = useState("orders");

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
      <Header storeName="SkyFood - Quán Cơm Văn Phòng" />
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="pt-20 md:ml-16 lg:ml-64 pb-20 md:pb-0">
        {renderPage()}
      </main>
    </div>
  );
}
