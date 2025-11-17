import { Bell, CheckCircle, Loader, Truck, XCircle } from "lucide-react";

const formatCurrency = (amount) => amount.toLocaleString("vi-VN") + "₫";

const OrderRow = ({ order, onViewDetail }) => {
	const isNew = order.status === "NEW";
	const isPreparing = order.status === "PREPARING";
	const isCompleted = order.status === "COMPLETED";

	const statusMap = {
		NEW: {
			text: "ĐƠN MỚI",
			color: "bg-orange-100 text-orange-600",
			icon: Bell,
		},
		PREPARING: {
			text: "ĐANG LÀM",
			color: "bg-yellow-100 text-yellow-600",
			icon: Loader,
		},
		READY: {
			text: "SẴN SÀNG",
			color: "bg-blue-100 text-blue-600",
			icon: Truck,
		},
		COMPLETED: {
			text: "HOÀN TẤT",
			color: "bg-green-100 text-green-600",
			icon: CheckCircle,
		},
		CANCELLED: {
			text: "ĐÃ HỦY",
			color: "bg-red-100 text-red-600",
			icon: XCircle,
		},
	};

	const statusInfo = statusMap[order.status] || statusMap.CANCELLED;
	const IconComponent = statusInfo.icon;

	return (
		<div
			className={`flex items-center p-4 border-b transition-colors cursor-pointer  ${
				isNew
					? "bg-orange-50 hover:bg-orange-100/70 shadow-lg"
					: "hover:bg-gray-50"
			}`}
			onClick={() => onViewDetail(order)}>
			{/* ID & Thời gian */}
			<div className="w-40 min-w-[100px] text-sm">
				<p className="font-semibold text-gray-800">{order.id}</p>
				<p className="text-xs text-gray-500">{order.time}</p>
			</div>

			{/* Trạng thái */}
			<div className="w-32 text-center text-sm">
				<span
					className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center ${statusInfo.color}`}>
					<IconComponent className="w-3 h-3 mr-1 hidden sm:inline" />
					{statusInfo.text}
				</span>
			</div>

			{/* Khách hàng & Loại TT */}
			<div className="flex-1 min-w-0 px-4 hidden md:block">
				<p className="text-sm font-medium text-gray-800 truncate">
					{order.customer}
				</p>
				<p
					className={`text-xs font-semibold ${
						order.type === "COD" ? "text-red-500" : "text-green-500"
					}`}>
					{order.type}
				</p>
			</div>

			{/* Tổng tiền */}
			<div className="w-32 text-right">
				<p className="font-bold text-orange-600 text-lg">
					{formatCurrency(order.total)}
				</p>
			</div>
		</div>
	);
};

export default OrderRow;
