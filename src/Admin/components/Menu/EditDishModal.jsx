// src/merchant/components/menu/EditDishModal.jsx
import { Image, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { InputField } from "../Common/InputField";
import { SelectField } from "../Common/SelectField";
import { TextAreaField } from "../Common/TextAreaField";

// Danh sách topping groups mẫu (sẽ lấy từ API thật sau)
const availableToppingGroups = [
  { id: 101, name: "Size", required: true },
  { id: 102, name: "Topping Phô Mai", required: false },
  { id: 103, name: "Đồ Uống Kèm", required: false },
  { id: 104, name: "Độ Cay", required: true },
];

export const EditDishModal = ({ dish, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: dish.name || "",
    price: dish.price || 0,
    description: dish.description || "",
    category: dish.category || "Gà Chiên",
    isAvailable: dish.isAvailable ?? true,
    toppingGroups: dish.toppingGroups || [], // Mảng các id nhóm topping được chọn
  });

  const [showToppingSelector, setShowToppingSelector] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleToppingGroup = (groupId) => {
    setForm((prev) => ({
      ...prev,
      toppingGroups: prev.toppingGroups.includes(groupId)
        ? prev.toppingGroups.filter((id) => id !== groupId)
        : [...prev.toppingGroups, groupId],
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên món!");
    if (form.price <= 0) return alert("Giá phải lớn hơn 0!");

    const savedDish = {
      ...dish,
      ...form,
      toppingGroups: form.toppingGroups.map((id) =>
        availableToppingGroups.find((g) => g.id === id)
      ),
    };

    onSave?.(savedDish);
    alert(`Đã lưu món: "${form.name}"`);
    onClose();
  };

  const selectedGroups = availableToppingGroups.filter((g) =>
    form.toppingGroups.includes(g.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {dish.id ? "Chỉnh sửa món ăn" : "Thêm món mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition hover:scale-110"
          >
            <X className="w-7 h-7 text-gray-500" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ảnh món */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <Image className="w-20 h-20 text-gray-400 mb-4" />
              <p className="text-gray-500 font-medium">Chưa có ảnh</p>
            </div>
            <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105">
              Tải ảnh món ăn
            </button>
          </div>

          {/* Form chính */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Tên món ăn"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="VD: Gà Rán Không Xương"
              />
              <InputField
                label="Giá bán"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                suffix="₫"
              />
            </div>

            <SelectField
              label="Danh mục"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {[
                "Gà Chiên",
                "Món Chính",
                "Combo",
                "Burger",
                "Đồ Uống",
                "Tráng Miệng",
                "Món Phụ",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </SelectField>

            <TextAreaField
              label="Mô tả món ăn"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Món gà giòn tan, thơm lừng, sốt cay ngọt đậm đà..."
            />

            {/* Trạng thái bán */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <div>
                <p className="font-bold text-gray-800">Trạng thái bán</p>
                <p className="text-sm text-gray-600">
                  Bật để hiển thị trên menu khách hàng
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* === PHẦN CHỌN TOPPING MỚI SIÊU ĐẸP === */}
            <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  Nhóm Topping áp dụng
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full font-bold">
                    {selectedGroups.length}
                  </span>
                </h3>
                <button
                  onClick={() => setShowToppingSelector(!showToppingSelector)}
                  className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  {showToppingSelector ? "Ẩn" : "Chọn topping"}
                </button>
              </div>

              {/* Danh sách đã chọn */}
              {selectedGroups.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {selectedGroups.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border-2 border-purple-300 shadow-md"
                    >
                      <span className="font-semibold text-purple-700">
                        {group.name}
                      </span>
                      <button
                        onClick={() => toggleToppingGroup(group.id)}
                        className="text-red-500 hover:bg-red-100 rounded-full p-1 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selector dropdown */}
              {showToppingSelector && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-white rounded-xl border">
                  {availableToppingGroups.map((group) => {
                    const isSelected = form.toppingGroups.includes(group.id);
                    return (
                      <label
                        key={group.id}
                        className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-50 shadow-lg"
                            : "border-gray-300 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {group.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {group.required ? "Bắt buộc chọn" : "Tùy chọn"}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleToppingGroup(group.id)}
                          className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-white flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-4 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            {dish.id ? "Cập nhật món" : "Tạo món mới"}
          </button>
        </div>
      </div>
    </div>
  );
};
