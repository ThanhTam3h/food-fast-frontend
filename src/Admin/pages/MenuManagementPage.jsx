// src/merchant/pages/MenuManagementPage.jsx
import { GripVertical, Plus, Search } from "lucide-react";
import { useState } from "react";

import { EditDishModal } from "../components/Menu/EditDishModal";
import { MenuItem } from "../components/Menu/MenuItem";
import { ReorderGroupModal } from "../components/Menu/ReorderGroupModal";
import { ToppingGroupFormModal } from "../components/Menu/ToppingGroupFormModal";
import { ToppingList } from "../components/Menu/ToppingList";

// ================== DỮ LIỆU MẪU ĐẦY ĐỦ ==================
const menuItemsRaw = [
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
    status: "Đang bán",
    isAvailable: true,
  },
  {
    id: 3,
    name: "Combo Gia Đình 8 Miếng + 2 Khoai + 2 Nước",
    price: 299000,
    category: "Combo",
    status: "Đang bán",
    isAvailable: true,
    promo: "Giảm 50k",
  },
  {
    id: 4,
    name: "Burger Zinger",
    price: 68000,
    category: "Burger",
    status: "Hết hàng",
    isAvailable: false,
  },
  {
    id: 5,
    name: "Trà Đào Cam Sả Size L",
    price: 45000,
    category: "Đồ Uống",
    status: "Đang bán",
    isAvailable: true,
  },
  {
    id: 6,
    name: "Cơm Gà Xối Mỡ",
    price: 65000,
    category: "Món Chính",
    status: "Đang bán",
    isAvailable: true,
    promo: "Mua 2 tặng 1",
  },
  {
    id: 7,
    name: "Khoai Tây Chiên",
    price: 35000,
    category: "Món Phụ",
    status: "Đang bán",
    isAvailable: true,
  },
];

const toppingGroups = [
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
  {
    id: 103,
    name: "Đồ Uống Kèm",
    required: false,
    min: 0,
    max: 2,
    options: [
      { id: 6, name: "Pepsi", price: 15000 },
      { id: 7, name: "Trà Đào", price: 35000 },
    ],
  },
];

const categories = [
  { id: "c1", name: "Gà Chiên", dishCount: 12 },
  { id: "c2", name: "Burger", dishCount: 5 },
  { id: "c3", name: "Combo", dishCount: 8 },
  { id: "c4", name: "Đồ Uống", dishCount: 15 },
  { id: "c5", name: "Món Chính", dishCount: 10 },
  { id: "c6", name: "Món Phụ", dishCount: 7 },
];

// ================== COMPONENT CHÍNH ==================
export const MenuManagementPage = () => {
  const [activeTab, setActiveTab] = useState("dish"); // dish | topping
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState(menuItemsRaw);
  const [modal, setModal] = useState({ type: null, data: null });

  const closeModal = () => setModal({ type: null, data: null });

  // Tìm kiếm realtime
  const filteredMenu = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle bật/tắt bán món
  const toggleAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Thực Đơn</h1>
        <p className="text-gray-500 mt-2 md:mt-0">
          Tổng {menuItems.length} món • {toppingGroups.length} nhóm topping
        </p>
      </div>

      {/* Search + Tabs + Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm món ăn, topping..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("dish")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "dish"
                  ? "bg-white shadow-md text-orange-600"
                  : "text-gray-600"
              }`}
            >
              Món ăn ({menuItems.length})
            </button>
            <button
              onClick={() => setActiveTab("topping")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "topping"
                  ? "bg-white shadow-md text-orange-600"
                  : "text-gray-600"
              }`}
            >
              Topping ({toppingGroups.length})
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={() =>
              activeTab === "dish"
                ? setModal({
                    type: "edit_dish",
                    data: {
                      id: Date.now(),
                      name: "",
                      price: 0,
                      category: "Gà Chiên",
                      isAvailable: true,
                    },
                  })
                : setModal({ type: "topping", data: null })
            }
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition"
          >
            <Plus className="w-5 h-5" />
            {activeTab === "dish" ? "Thêm món" : "Thêm nhóm topping"}
          </button>
        </div>
      </div>

      {/* Nội dung */}
      {activeTab === "dish" ? (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Table header - chỉ hiện desktop */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 text-sm font-bold text-gray-600 border-b">
            <div className="col-span-5">Tên món ăn</div>
            <div className="col-span-2 text-center">Giá</div>
            <div className="col-span-2 text-center">Danh mục</div>
            <div className="col-span-2 text-center">Trạng thái</div>
            <div className="col-span-1 text-center">Hành động</div>
          </div>

          {/* Danh sách món */}
          {filteredMenu.length === 0 ? (
            <div className="p-20 text-center text-gray-400">
              <p className="text-2xl">Không tìm thấy món ăn nào</p>
            </div>
          ) : (
            filteredMenu.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                onToggleStatus={() => toggleAvailability(item.id)}
                onEdit={(dish) => setModal({ type: "edit_dish", data: dish })}
                onReorder={() =>
                  setModal({ type: "reorder", data: categories })
                }
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-gray-700 font-semibold">Nhóm Topping</h2>
            <button
              onClick={() => setModal({ type: "reorder", data: categories })}
              className="text-orange-600 hover:underline flex items-center gap-2"
            >
              <GripVertical className="w-5 h-5" /> Sắp xếp nhóm
            </button>
          </div>
          <ToppingList
            groups={toppingGroups}
            onEdit={(g) => setModal({ type: "topping", data: g })}
          />
        </div>
      )}

      {/* ========== TẤT CẢ MODAL ========== */}
      {modal.type === "edit_dish" && (
        <EditDishModal dish={modal.data} onClose={closeModal} />
      )}
      {modal.type === "reorder" && (
        <ReorderGroupModal
          categories={modal.data}
          onSave={(newOrder) => {
            console.log("Saved order:", newOrder);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
      {modal.type === "topping" && (
        <ToppingGroupFormModal toppingGroup={modal.data} onClose={closeModal} />
      )}
    </div>
  );
};
