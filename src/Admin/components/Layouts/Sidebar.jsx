import { ClipboardList, Home, Menu } from "lucide-react";

const navItems = [
  { name: "Trang Chủ", icon: Home, page: "home" },
  { name: "Thực Đơn", icon: Menu, page: "menu" },
  { name: "Đơn Hàng", icon: ClipboardList, page: "orders" },
];

export const Sidebar = ({ currentPage, onNavigate }) => (
  <div className="bg-white shadow-xl min-h-screen w-16 lg:w-64 fixed top-0 left-0 z-10 hidden md:block">
    <div className="p-4 h-20 border-b flex items-center justify-center lg:justify-start">
      <span className="text-2xl font-bold text-orange-500">SF</span>
    </div>
    <nav className="p-2">
      {navItems.map((item) => (
        <button
          key={item.page}
          onClick={() => onNavigate(item.page)}
          className={`w-full flex items-center space-x-3 p-3 my-1 rounded-lg transition-colors ${
            currentPage === item.page
              ? "bg-orange-100 text-orange-600 font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span className="hidden lg:block">{item.name}</span>
        </button>
      ))}
    </nav>
  </div>
);
