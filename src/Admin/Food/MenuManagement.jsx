import { useState } from "react";
import { Search } from "lucide-react";
import PlusIcon from "../Components/PlusIcon.jsx";
import MenuItem from "./Menu.jsx";
import ToppingListPage from "./ToppingList.jsx";
import EditDishModal from "./EditDishModal.jsx";
import ReorderGroupModal from "./ReOrder.jsx";
import ToppingGroupFormModal from "./ToppingGroupFormModal.jsx";

const initialMenuItems = [
	{
		id: 1,
		name: "Gà BBQ Mùa Lửa Hồng (6 Miếng)",
		price: 149000,
		category: "Gà Chiên",
		status: "Đang bán",
		isAvailable: true,
		promo: "12/12",
	},
	{
		id: 2,
		name: "Gà Không Xương Xốt Mật Tokkong",
		price: 119000,
		category: "Gà Chiên",
		status: "Hết hàng",
		isAvailable: false,
		promo: null,
	},
];

const initialCategories = [
	{ id: "cat1", name: "Gà Chiên", dishCount: 3 },
	{ id: "cat2", name: "Món Chính", dishCount: 1 },
];

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

const MenuManagementPage = () => {
	const [menu, setMenu] = useState(initialMenuItems);
	const [activeTab, setActiveTab] = useState("dish"); // 'dish' hoặc 'topping'

	// State quản lý Modal
	const [modal, setModal] = useState({
		type: null, // 'edit_dish', 'reorder_groups', 'edit_topping_group'
		data: null,
		isOpen: false,
	});

	const handleToggleStatus = (id) => {
		setMenu((prevMenu) =>
			prevMenu.map((item) =>
				item.id === id
					? {
							...item,
							isAvailable: !item.isAvailable,
							status: item.isAvailable ? "Hết hàng" : "Đang bán",
					  }
					: item
			)
		);
		console.log(`Toggle status cho món ID: ${id}`);
	};

	const handleEditDish = (item) => {
		setModal({ type: "edit_dish", data: item, isOpen: true });
	};

	const handleReorderGroups = () => {
		setModal({ type: "reorder_groups", data: initialCategories, isOpen: true });
	};

	const handleEditToppingGroup = (group) => {
		setModal({ type: "edit_topping_group", data: group, isOpen: true });
	};

	const handleCreateToppingGroup = () => {
		setModal({ type: "edit_topping_group", data: null, isOpen: true }); // data: null -> Create
	};

	const closeModal = () => setModal({ type: null, data: null, isOpen: false });

	return (
		<div className="p-6 md:p-8">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">Thực Đơn</h1>

			{/* Thanh tìm kiếm và Tabs */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
				{/* Thanh tìm kiếm */}
				<div className="relative w-full md:w-80">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input
						type="text"
						placeholder="Tìm món, topping, nhóm topping"
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
					/>
				</div>

				{/* Tabs: Món | Nhóm Topping */}
				<div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
					<button
						onClick={() => setActiveTab("dish")}
						className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
							activeTab === "dish"
								? "bg-white text-orange-600 shadow-md"
								: "text-gray-600 hover:bg-gray-200"
						}`}>
						Món ({menu.length})
					</button>
					<button
						onClick={() => setActiveTab("topping")}
						className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
							activeTab === "topping"
								? "bg-white text-orange-600 shadow-md"
								: "text-gray-600 hover:bg-gray-200"
						}`}>
						Nhóm Topping ({initialToppingGroups.length})
					</button>
				</div>

				{/* Nút thêm mới */}
				<button
					className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors text-sm w-full md:w-auto justify-center md:justify-start"
					onClick={() =>
						activeTab === "dish"
							? handleEditDish({
									id: Date.now(),
									name: "Món Mới",
									price: 0,
									category: "Khác",
									status: "Đang bán",
									isAvailable: true,
									promo: null,
							  })
							: handleCreateToppingGroup()
					}>
					<PlusIcon className="w-4 h-4 mr-2" />
					{activeTab === "dish" ? "Thêm Món Mới" : "Thêm Nhóm Topping"}
				</button>
			</div>

			{/* Bảng/Danh sách món ăn hoặc Topping */}
			{activeTab === "dish" ? (
				<div className="bg-white shadow-xl rounded-xl overflow-hidden">
					{/* Header/Cột tiêu đề */}
					<div className="hidden md:flex p-4 border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
						<div className="flex-1">Tên Món & Giá</div>
						<div className="w-40 text-center">Trạng Thái</div>
						<div className="w-20 text-center">Hành Động</div>
					</div>

					{/* Danh sách món ăn */}
					{menu.map((item, index) => (
						<MenuItem
							key={item.id}
							item={item}
							index={index}
							onToggleStatus={handleToggleStatus}
							onEdit={handleEditDish}
							onReorder={handleReorderGroups} // Mở modal sắp xếp nhóm món
						/>
					))}

					{/* Footer (Phân trang/Tóm tắt) */}
					<div className="p-4 flex justify-between items-center text-sm text-gray-500">
						<span>
							Hiển thị 1 đến {menu.length} trên {menu.length} món
						</span>
						<div className="space-x-2">
							<button className="p-2 border rounded-lg hover:bg-gray-100">
								Trước
							</button>
							<button className="p-2 border rounded-lg bg-orange-500 text-white">
								1
							</button>
							<button className="p-2 border rounded-lg hover:bg-gray-100">
								Sau
							</button>
						</div>
					</div>
				</div>
			) : (
				<ToppingListPage onEdit={handleEditToppingGroup} />
			)}

			{/* RENDER MODALS */}
			{modal.isOpen && modal.type === "edit_dish" && (
				<EditDishModal dish={modal.data} onClose={closeModal} />
			)}

			{modal.isOpen && modal.type === "reorder_groups" && (
				<ReorderGroupModal
					categories={modal.data}
					onSave={(newList) => console.log("Sắp xếp nhóm món mới:", newList)}
					onClose={closeModal}
				/>
			)}

			{modal.isOpen && modal.type === "edit_topping_group" && (
				<ToppingGroupFormModal
					toppingGroup={modal.data} // null cho tạo mới, object cho chỉnh sửa
					onClose={closeModal}
				/>
			)}
		</div>
	);
};

export default MenuManagementPage;
