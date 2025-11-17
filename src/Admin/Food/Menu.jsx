import { Edit, GripVertical } from "lucide-react";

const formatCurrency = (amount) => amount.toLocaleString("vi-VN") + "₫";

const MenuItem = ({ item, onToggleStatus, onEdit, onReorder }) => {
	const isSaleable = item.isAvailable && item.status === "Đang bán";
	const statusColor = isSaleable
		? "text-green-600 bg-green-100"
		: "text-red-600 bg-red-100";

	return (
		<div className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors">
			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium text-gray-800 truncate">
					{item.name}
					{item.promo && (
						<span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
							{item.promo}
						</span>
					)}
				</div>
				<p className="text-xs text-gray-500 mt-1">
					{item.category} | {formatCurrency(item.price)}
				</p>
			</div>

			<div className="flex items-center space-x-4">
				{/* Trạng thái */}
				<div
					className="text-xs font-semibold uppercase hidden lg:block"
					style={{ width: "80px" }}>
					<span className={`px-2 py-1 rounded-full ${statusColor}`}>
						{item.status}
					</span>
				</div>

				{/* Nút chỉnh sửa/xóa (Edit/Reorder) */}
				<div className="flex space-x-2">
					<button
						onClick={() => onEdit(item)}
						className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
						title="Chỉnh Sửa Món">
						<Edit className="w-4 h-4" />
					</button>
					<button
						onClick={onReorder} // Sẽ mở modal sắp xếp nhóm món
						className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors hidden md:block"
						title="Sắp xếp nhóm món">
						<GripVertical className="w-4 h-4" />
					</button>
				</div>

				{/* Toggle Switch */}
				<label className="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						checked={isSaleable}
						onChange={() => onToggleStatus(item.id)}
						className="sr-only peer"
					/>
					<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
				</label>
			</div>
		</div>
	);
};
export default MenuItem;
