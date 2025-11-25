// src/merchant/pages/MenuManagementPage.jsx
import { Edit3, GripVertical, Package, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  getProducts,
  getToppingGroups,
} from "../../State/Admin/Menu/menu.action";
import { AddDishModal } from "../components/Menu/AddDishModal";
import { CategoryModal } from "../components/Menu/CategoryModal";
import { EditDishModal } from "../components/Menu/EditDishModal";
import { MenuItem } from "../components/Menu/MenuItem";
import { ToppingGroupFormModal } from "../components/Menu/ToppingGroupFormModal";
import { ToppingList } from "../components/Menu/ToppingList";

// ================== COMPONENT CHÍNH ==================
export const MenuManagementPage = () => {
  const [activeTab, setActiveTab] = useState("dish"); // dish | topping | category
  const [menuItems, setMenuItems] = useState([]);
  const [modal, setModal] = useState({ type: null, data: null });

  const closeModal = () => setModal({ type: null, data: null });
  const dispatch = useDispatch();
  const { jwt, merchant } = useSelector((state) => state.auth);
  const merchantId = merchant?.id;
  const menu = useSelector((state) => state.menuMerchant.products);
  const category = useSelector((state) => state.menuMerchant.categories);
  const toppingGroups = useSelector(
    (state) => state.menuMerchant.toppingGroups
  );

  console.log(menu)

  useEffect(() => {
    if (merchantId) {
      dispatch(getProducts({ merchantId }));
      dispatch(getCategories(merchantId));
      dispatch(getToppingGroups(merchantId));
    }
  }, [merchantId]);

  // Khi Redux có products → set vào menuItems
  useEffect(() => {
    if (menu && Array.isArray(menu)) {
      setMenuItems(
        menu?.map((item) => ({
          id: item?.id,
          name: item?.name,
          image: item?.image,
          price: item?.basePrice,
          description: item?.description,
          category: item?.category?.name || "Chưa phân loại",
          isAvailable: item?.isActive,
          status: item?.isActive,
          productToppingGroups: item?.productToppingGroups || [],
        }))
      );
    }
  }, [menu]);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Thực Đơn</h1>
        <p className="text-gray-500 mt-2 md:mt-0">
          Tổng {menuItems?.length} món • {toppingGroups?.length} nhóm topping •{" "}
          {category?.length} danh mục
        </p>
      </div>

      {/* Search + Tabs + Button */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Tabs - ĐÃ THÊM TAB DANH MỤC */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("dish")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "dish"
                  ? "bg-white shadow-md text-green-600"
                  : "text-gray-600"
              }`}
            >
              Món ăn ({menuItems?.length})
            </button>
            <button
              onClick={() => setActiveTab("topping")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "topping"
                  ? "bg-white shadow-md text-green-600"
                  : "text-gray-600"
              }`}
            >
              Topping ({toppingGroups?.length})
            </button>
            <button
              onClick={() => setActiveTab("category")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "category"
                  ? "bg-white shadow-md text-green-600"
                  : "text-gray-600"
              }`}
            >
              Danh mục ({category?.length})
            </button>
          </div>

          {/* Add button - thay đổi theo tab */}
          <button
            onClick={() => {
              if (activeTab === "dish") {
                setModal({
                  type: "add_dish",
                  data: {
                    id: Date.now(),
                    name: "",
                    price: 0,
                    category: category[0]?.name || "",
                    isAvailable: true,
                  },
                });
              } else if (activeTab === "topping") {
                setModal({ type: "topping", data: null });
              } else if (activeTab === "category") {
                setModal({
                  type: "edit_category",
                  data: null,
                });
              }
            }}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition"
          >
            <Plus className="w-5 h-5" />
            {activeTab === "dish"
              ? "Thêm món"
              : activeTab === "topping"
              ? "Thêm nhóm topping"
              : "Thêm danh mục"}
          </button>
        </div>
      </div>

      {/* ====================== TAB MÓN ĂN ====================== */}
      {activeTab === "dish" && (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-gray-50 text-sm font-bold text-gray-600 border-b">
            <div className="col-span-5">Tên món ăn</div>
            <div className="col-span-2 text-center">Giá</div>
            <div className="col-span-2 text-center">Danh mục</div>
            <div className="col-span-2 text-center">Trạng thái</div>
            <div className="col-span-1 text-center">Hành động</div>
          </div>

          {menuItems.map((item) => (
            <MenuItem
              key={item?.id}
              item={item}
              onEdit={(dish) => setModal({ type: "edit_dish", data: dish })}
            />
          ))}
        </div>
      )}

      {/* ====================== TAB TOPPING ====================== */}
      {activeTab === "topping" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-gray-700 font-semibold">
              Nhóm Topping
            </h2>
            <button
              onClick={() => setModal({ type: "reorder", data: category })}
              className="text-green-600 hover:underline flex items-center gap-2"
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

      {/* ====================== TAB DANH MỤC - MỚI THÊM ====================== */}
      {activeTab === "category" && (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category?.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-green-500 text-white p-4 rounded-xl">
                      <Package className="w-8 h-8" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setModal({ type: "edit_category", data: cat })
                        }
                        className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg text-green-600 transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {cat.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== TẤT CẢ MODAL ========== */}
      {modal.type === "edit_dish" && (
        <EditDishModal
          dish={modal.data}
          categories={category}
          toppingGroups={toppingGroups}
          merchantId={merchantId}
          onClose={closeModal}
        />
      )}

      {modal.type === "edit_category" && (
        <CategoryModal
          category={modal.data}
          merchantId={merchantId}
          onClose={closeModal}
        />
      )}

      {modal.type === "topping" && (
        <ToppingGroupFormModal
          toppingGroup={modal.data}
          merchantId={merchantId}
          onClose={closeModal}
        />
      )}

      {activeTab === "dish" && modal.type === "add_dish" && (
        <AddDishModal
          categories={category}
          toppingGroups={toppingGroups}
          merchantId={merchantId}
          onClose={closeModal}
        />
      )}
    </div>
  );
};
