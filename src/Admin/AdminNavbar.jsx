import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { pink } from "@mui/material/colors";
import { useState } from "react";
import { logout } from "../State/Authentication/Action";
import Auth from "../customers/pages/Auth/Auth";
import { IconButton } from "@mui/material";
import { Clock, ShoppingBag } from "lucide-react";

const AdminNavbar = ({ handleOpenSideBar }) => {
	const navigate = useNavigate();
	const { auth, cart } = useSelector((store) => store);
	const dispatch = useDispatch();
	const storeName = "Cửa hàng A - Quán cơm văn phòng";

	return (
		<header className="bg-white shadow-md h-20 flex items-center justify-between p-4 sticky top-0 w-full">
			{/* 1. PHÍA BÊN TRÁI (ĐÃ GỘP) */}
			<div className="flex items-center">
				{/* Nút MenuIcon: Chỉ hiển thị trên mobile/tablet (lg:hidden) */}
				<IconButton
					onClick={handleOpenSideBar}
					className="lg:hidden" // <-- Quan trọng: Ẩn trên desktop
					sx={{ mr: 1 }} // Thêm khoảng cách
				>
					<MenuIcon />
				</IconButton>

				{/* Tên cửa hàng (từ component Header cũ) */}
				<div className="text-xl font-semibold text-gray-800 flex items-center">
					<ShoppingBag className="w-5 h-5 mr-2 text-orange-500" />
					{storeName} - Quản lý
				</div>
			</div>

			{/* 2. PHÍA BÊN PHẢI (Giữ nguyên) */}
			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-2 text-sm text-gray-600">
					<Clock className="w-4 h-4 text-green-500" />
					<span className="hidden sm:block">Hoạt động: 08:00 - 22:00</span>
				</div>
				<button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors text-sm">
					Đăng Xuất
				</button>
			</div>
		</header>
	);
};

export default AdminNavbar;
