import { CheckCircle, Package, Trash2, Truck, XCircle } from "lucide-react";

const formatCurrency = (amount) => amount.toLocaleString("vi-VN") + "₫";

const OrderDetailModal = ({ order, onAction, onClose }) => {
	const isNew = order.status === "NEW";
	const isPreparing = order.status === "PREPARING";
	const isReady = order.status === "READY";
	const isCompletedOrCancelled =
		order.status === "COMPLETED" || order.status === "CANCELLED";

	const getStatusStyle = (status) => {
		switch (status) {
			case "NEW":
				return "bg-orange-100 text-orange-600";
			case "PREPARING":
				return "bg-yellow-100 text-yellow-600";
			case "READY":
				return "bg-blue-100 text-blue-600";
			case "COMPLETED":
				return "bg-green-100 text-green-600";
			case "CANCELLED":
				return "bg-red-100 text-red-600";
			default:
				return "bg-gray-100 text-gray-600";
		}
	};

	return (
		<div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
				{/* Header Modal */}
				<div className="p-4 border-b bg-gray-50 rounded-t-xl">
					<h2 className="text-xl font-bold text-gray-800">Chi Tiết Đơn Hàng</h2>
					<p className="text-sm text-gray-500 mt-1 flex items-center justify-between">
						Mã ĐH: <span className="font-mono text-gray-700">{order.id}</span>
						<span
							className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(
								order.status
							)}`}>
							{order.status === "NEW"
								? "ĐƠN MỚI"
								: order.status === "PREPARING"
								? "ĐANG LÀM"
								: order.status === "READY"
								? "SẴN SÀNG"
								: order.status === "COMPLETED"
								? "HOÀN TẤT"
								: "ĐÃ HỦY"}
						</span>
					</p>
				</div>

				{/* Nội dung chi tiết */}
				<div className="p-6 space-y-4">
					{/* Thông tin chung */}
					<div className="border p-4 rounded-lg bg-indigo-50/50 space-y-2">
						<div className="flex justify-between text-sm">
							<span className="text-gray-600 font-medium">Khách Hàng:</span>
							<span className="font-semibold text-gray-800">
								{order.customer}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-600 font-medium">Thời Gian Đặt:</span>
							<span className="text-gray-800">{order.time}</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-gray-600 font-medium">Hình Thức TT:</span>
							<span
								className={`font-semibold ${
									order.type === "COD" ? "text-red-500" : "text-green-500"
								}`}>
								{order.type}
							</span>
						</div>
					</div>

					{/* Danh sách món */}
					<h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
						Danh Sách Món ({order.items.length})
					</h3>
					<div className="space-y-3 max-h-48 overflow-y-auto pr-2">
						{order.items.map((item, index) => (
							<div key={index} className="border-b pb-2">
								<div className="flex justify-between text-sm">
									<span className="font-medium text-gray-800">
										{item.qty}x {item.name}
									</span>
									<span className="text-gray-700">
										{formatCurrency(item.qty * item.price)}
									</span>
								</div>
								{item.note && (
									<p className="text-xs text-red-500 italic mt-1 ml-4">
										Lưu ý: {item.note}
									</p>
								)}
							</div>
						))}
					</div>

					{/* Tổng cộng */}
					<div className="pt-4 border-t border-dashed">
						<div className="flex justify-between text-base font-bold text-gray-800">
							<span>TỔNG CỘNG:</span>
							<span className="text-2xl text-orange-600">
								{formatCurrency(order.total)}
							</span>
						</div>
					</div>
				</div>

				{/* Footer Modal - Hành động */}
				<div className="p-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
					<button
						onClick={onClose}
						className="p-2 rounded-full text-gray-500 hover:bg-gray-200">
						<XCircle className="w-6 h-6" />
					</button>

					{!isCompletedOrCancelled && (
						<>
							{isNew && (
								<button
									onClick={() => onAction(order.id, "PREPARING")}
									className="flex items-center bg-green-500 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-colors">
									<CheckCircle className="w-5 h-5 mr-2" /> Chấp Nhận
								</button>
							)}

							{isPreparing && (
								<button
									onClick={() => onAction(order.id, "READY")}
									className="flex items-center bg-blue-500 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors">
									<Package className="w-5 h-5 mr-2" /> Sẵn Sàng Giao
								</button>
							)}

							{(isNew || isPreparing) && (
								<button
									onClick={() => onAction(order.id, "CANCELLED")}
									className="flex items-center border border-red-500 text-red-500 font-medium py-3 px-4 rounded-lg shadow-md hover:bg-red-50 transition-colors">
									<Trash2 className="w-5 h-5 mr-2" /> Hủy Đơn
								</button>
							)}

							{isReady && (
								<button
									onClick={() => onAction(order.id, "COMPLETED")}
									className="flex items-center bg-gray-500 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-colors">
									<Truck className="w-5 h-5 mr-2" /> Giao Thành Công (Mock)
								</button>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrderDetailModal;
