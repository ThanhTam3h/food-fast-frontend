import { ClipboardList, Package, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import OrderRow from "./OrderRow";
import OrderDetailModal from "./OrderDetails";
import ToastNotification from "../Components/Notification";

const initialOrders = [
	{
		id: "SFD-231031-099",
		time: "Hôm qua",
		status: "CANCELLED",
		total: 80000,
		type: "COD",
		customer: "Lê Hoàng D",
		items: [{ name: "Bún Bò", qty: 1, price: 80000 }],
	},
];

const OrdersPage = () => {
	const [orders, setOrders] = useState(initialOrders);
	const [activeTab, setActiveTab] = useState("ALL");
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [showNewOrderToast, setShowNewOrderToast] = useState(false);

	// Mock new order function (Mô phỏng đơn hàng mới đổ về)
	useEffect(() => {
		const interval = setInterval(() => {
			if (Math.random() < 0.3) {
				// 30% chance of a new order
				const newOrder = {
					id: `SFD-${Date.now().toString().slice(-6)}`,
					time: "vài giây trước",
					status: "NEW",
					total: Math.floor(Math.random() * 500 + 100) * 1000,
					type: Math.random() < 0.5 ? "COD" : "Online",
					customer: `Khách VIP ${Math.floor(Math.random() * 100)}`,
					items: initialOrders[0].items.map((item) => ({ ...item, qty: 1 })),
				};
				setOrders((prev) => [newOrder, ...prev]);
				setShowNewOrderToast(true);
				setTimeout(() => setShowNewOrderToast(false), 5000); // Hide toast after 5s
			}
		}, 15000); // Check for new order every 15s

		return () => clearInterval(interval);
	}, []);

	// Xử lý hành động từ Modal (Chấp nhận, Sẵn sàng, Hủy)
	const handleOrderAction = (id, newStatus) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === id
					? { ...order, status: newStatus, time: "Vừa cập nhật" }
					: order
			)
		);
		setSelectedOrder(null); // Close modal
		// Chuyển tab sau khi hành động (nếu cần)
		if (newStatus !== "COMPLETED" && newStatus !== "CANCELLED") {
			setActiveTab(newStatus);
		}
	};

	// Lọc danh sách theo Tab
	const filteredOrders = orders.filter(
		(order) => activeTab === "ALL" || order.status === activeTab
	);

	// Đếm số lượng đơn hàng theo trạng thái
	const orderCounts = orders.reduce(
		(acc, order) => {
			acc[order.status] = (acc[order.status] || 0) + 1;
			acc["ALL"] = acc["ALL"] + 1;
			return acc;
		},
		{ ALL: 0 }
	);

	const tabs = [
		{
			key: "NEW",
			label: "Đơn Mới",
			count: orderCounts.NEW || 0,
			color: "text-orange-600",
		},
		{
			key: "PREPARING",
			label: "Đang Làm",
			count: orderCounts.PREPARING || 0,
			color: "text-yellow-600",
		},
		{
			key: "READY",
			label: "Sẵn Sàng",
			count: orderCounts.READY || 0,
			color: "text-blue-600",
		},
		{
			key: "COMPLETED",
			label: "Hoàn Tất",
			count: orderCounts.COMPLETED || 0,
			color: "text-green-600",
		},
		{
			key: "CANCELLED",
			label: "Đã Hủy",
			count: orderCounts.CANCELLED || 0,
			color: "text-red-600",
		},
		{
			key: "ALL",
			label: "Tất Cả",
			count: orderCounts.ALL || 0,
			color: "text-gray-600",
		},
	];

	return (
		<div className="p-6 md:p-8 bg-white rounded-xl shadow-lg ">
			<h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center ">
				<ClipboardList className="w-6 h-6 mr-2 text-orange-500" /> Quản Lý Đơn
				Hàng
			</h1>

			{/* Thanh Tabs Trạng thái */}
			<div className="flex flex-wrap border-b bg-gray border-black-200 mb-6 bg-white p-2 rounded-xl shadow-lg">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setActiveTab(tab.key)}
						className={`px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center justify-center ${
							activeTab === tab.key
								? "border-b-2 border-orange-500 text-orange-600"
								: "text-gray-500 hover:text-gray-700"
						}`}>
						{tab.label}
						{tab.count > 0 && (
							<span
								className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
									tab.key === "NEW"
										? "bg-red-500 text-white animate-pulse"
										: "bg-gray-200 text-gray-700"
								}`}>
								{tab.count}
							</span>
						)}
					</button>
				))}
			</div>

			{/* Danh sách đơn hàng */}
			<div className="bg-white shadow-xl rounded-xl overflow-hidden">
				{/* Header/Cột tiêu đề */}
				<div className="hidden md:flex p-4 border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
					<div className="w-40">Mã ĐH & Thời Gian</div>
					<div className="w-32 text-center">Trạng Thái</div>
					<div className="flex-1 px-4">Khách Hàng & TT</div>
					<div className="w-32 text-right">Tổng Tiền</div>
				</div>

				{filteredOrders.length > 0 ? (
					filteredOrders.map((order) => (
						<OrderRow
							key={order.id}
							order={order}
							onViewDetail={setSelectedOrder}
						/>
					))
				) : (
					<div className="p-8 text-center text-gray-500">
						<Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
						<p>Không có đơn hàng nào trong trạng thái này.</p>
					</div>
				)}
			</div>

			<div className="mt-6 flex justify-end">
				<button
					onClick={() => setOrders(initialOrders)}
					className="text-gray-500 hover:text-gray-800 text-sm flex items-center">
					<RotateCw className="w-4 h-4 mr-1" />
					Làm mới (Reset Mock Data)
				</button>
			</div>

			{/* RENDER MODALS */}
			{selectedOrder && (
				<OrderDetailModal
					order={selectedOrder}
					onAction={handleOrderAction}
					onClose={() => setSelectedOrder(null)}
				/>
			)}

			{/* TOAST NOTIFICATION */}
			{showNewOrderToast && (
				<ToastNotification
					message={`Đơn hàng mới (${orderCounts.NEW}) đang chờ!`}
					onClose={() => setShowNewOrderToast(false)}
				/>
			)}
		</div>
	);
};

export default OrdersPage;
