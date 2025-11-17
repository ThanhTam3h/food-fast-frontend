import { Edit } from "lucide-react";

const initialToppingGroups = [
	{
		id: 101,
		name: "Size",
		required: true,
		min: 1,
		max: 1,
		options: [
			{ id: 1, name: "Size S", price: 0 },
			{ id: 2, name: "Size L", price: 30000 },
		],
	},
	{
		id: 102,
		name: "Topping Phô Mai",
		required: false,
		min: 0,
		max: 3,
		options: [
			{ id: 3, name: "Phô Mai Bột", price: 15000 },
			{ id: 4, name: "Phô Mai Kéo Sợi", price: 20000 },
		],
	},
];

const ToppingListPage = ({ onEdit }) => (
	<div className="bg-white shadow-xl rounded-xl overflow-hidden">
		<div className="hidden md:flex p-4 border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
			<div className="flex-1">Tên Nhóm Topping</div>
			<div className="w-32 text-center">Tùy Chọn</div>
			<div className="w-24 text-center">Hành Động</div>
		</div>

		{initialToppingGroups.map((group) => (
			<div
				key={group.id}
				className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors">
				<div className="flex-1 min-w-0">
					<div className="text-sm font-medium text-gray-800 truncate">
						{group.name}
					</div>
					<p className="text-xs text-gray-500 mt-1">
						Gồm {group.options.length} loại topping
					</p>
				</div>
				<div className="w-32 text-center text-sm">
					{group.required ? (
						<span className="text-blue-600 font-semibold">Bắt buộc</span>
					) : (
						<span className="text-green-600 font-semibold">Tùy chọn</span>
					)}
				</div>
				<div className="w-24 text-center">
					<button
						onClick={() => onEdit(group)}
						className="p-2 rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
						title="Chỉnh Sửa Nhóm">
						<Edit className="w-4 h-4" />
					</button>
				</div>
			</div>
		))}

		<div className="p-4 flex justify-between items-center text-sm text-gray-500">
			<span>
				Hiển thị 1 đến {initialToppingGroups.length} trên{" "}
				{initialToppingGroups.length} nhóm
			</span>
		</div>
	</div>
);

export default ToppingListPage;
