import * as React from "react";
import Drawer from "@mui/material/Drawer";
import { useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../State/Authentication/Action";

import {
	ClipboardList,
	Gift,
	Home,
	Menu,
	MessageSquare,
	Settings,
	Package,
	LayoutGrid,
	Megaphone,
	Info,
	LogOut,
} from "lucide-react";

const menuItems = [
	{ name: "Trang Chủ", icon: Home, path: "/" },
	{ name: "Đơn Hàng", icon: ClipboardList, path: "/order" },
	{ name: "Thực Đơn", icon: Menu, path: "/menu" },
	{ name: "Danh Mục", icon: LayoutGrid, path: "/category" },
	{ name: "Nguyên Liệu", icon: Package, path: "/ingredients" },
	{ name: "Sự Kiện", icon: Megaphone, path: "/event" },
	{ name: "Chi Tiết", icon: Info, path: "/details" },
	{ name: "Khuyến Mãi", icon: Gift, path: "/promo" },
	{ name: "Hỗ Trợ", icon: MessageSquare, path: "/support" },
];

export default function AdminSidebar({ handleClose, open }) {
	const isSmallScreen = useMediaQuery("(max-width:1080px)");
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const handleNavigate = (path) => {
		navigate(`/admin/restaurant${path}`);
		handleClose();
	};

	const handleLogout = () => {
		navigate("/");
		dispatch(logout());
		handleClose();
	};

	return (
		<React.Fragment>
			<Drawer
				sx={{
					zIndex: 10,
					"& .MuiDrawer-paper": {
						borderRight: "none",
					},
				}}
				anchor={"left"}
				open={open}
				onClose={handleClose}
				variant={isSmallScreen ? "temporary" : "permanent"}>
				<div className="bg-white shadow-xl min-h-screen w-[70vw] md:w-64 flex flex-col">
					<div className="p-4 flex items-center justify-center lg:justify-start h-20 border-b">
						<span className="text-xl font-bold text-orange-500">SFD Admin</span>
					</div>
					<nav className="p-2 flex-1">
						{menuItems.map((item) => {
							const isActive =
								location.pathname === `/admin/restaurant${item.path}`;

							return (
								<div
									key={item.name}
									className={`flex items-center space-x-3 p-3 my-1 rounded-lg cursor-pointer transition-colors ${
										isActive
											? "bg-orange-100 text-orange-600 font-semibold" // Style khi active
											: "text-gray-600 hover:bg-gray-100" // Style mặc định
									}`}
									onClick={() => handleNavigate(item.path)}>
									<item.icon className="w-5 h-5 flex-shrink-0" />
									<span className="text-sm">{item.name}</span>
								</div>
							);
						})}
					</nav>

					<div className="p-2 border-t">
						<div className="flex items-center justify-center lg:justify-start space-x-3 text-gray-600 p-3 my-1 rounded-lg cursor-pointer hover:bg-gray-100">
							<Settings className="w-5 h-5" />
							<span className="text-sm font-medium">Cài Đặt</span>
						</div>
						<div
							className="flex items-center justify-center lg:justify-start space-x-3 text-red-500 p-3 my-1 rounded-lg cursor-pointer hover:bg-red-50"
							onClick={handleLogout}>
							<LogOut className="w-5 h-5" />
							<span className="text-sm font-medium">Đăng Xuất</span>
						</div>
					</div>
				</div>
			</Drawer>
		</React.Fragment>
	);
}
