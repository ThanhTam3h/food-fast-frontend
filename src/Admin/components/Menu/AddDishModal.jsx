import { Image, Plus, X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct, getProducts } from "../../../State/Admin/Menu/menu.action";
import { InputField } from "../Common/InputField";
import { SelectField } from "../Common/SelectField";
import { TextAreaField } from "../Common/TextAreaField";

export const AddDishModal = ({
  categories,
  toppingGroups,
  merchantId,
  onClose,
}) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    price: 0,
    description: "",
    categoryId: categories[0]?.id || null,
    isActive: true,
  });

  const [file, setFile] = useState(null);
  const [showToppingSelector, setShowToppingSelector] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const toggleToppingGroup = (groupId) => {
    if (selectedGroups.find((g) => g.id === groupId)) {
      setSelectedGroups((prev) => prev.filter((g) => g.id !== groupId));
    } else {
      const group = toppingGroups.find((g) => g.id === groupId);
      if (group) setSelectedGroups((prev) => [...prev, group]);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên món!");
    if (form.price <= 0) return alert("Giá phải lớn hơn 0!");

    const productData = {
      name: form.name,
      description: form.description,
      basePrice: Number(form.price),
      categoryId: Number(form.categoryId),
      merchantId,
      isActive: form.isActive,
      productToppingGroups: selectedGroups.map((g) => ({
        toppingGroupId: g.id,
      })),
    };

    try {
      await dispatch(createProduct(productData, file));
      await dispatch(getProducts({ merchantId }));
      alert("Tạo món mới thành công!");
      onClose();
    } catch (err) {
      alert("Lỗi tạo món: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto text-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-green-500 to-white">
          <h2 className="text-2xl font-bold text-gray-800">Thêm món mới</h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition hover:scale-110"
          >
            <X className="w-7 h-7 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ảnh món */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <>
                  <Image className="w-20 h-20 text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">Chưa có ảnh</p>
                </>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Form */}
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
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </SelectField>

            <TextAreaField
              label="Mô tả món ăn"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Món gà giòn tan..."
            />

            {/* Trạng thái bán */}
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <div>
                <p className="font-bold text-gray-800">Trạng thái bán</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Topping */}
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

              {/* Selector */}
              {showToppingSelector && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-white rounded-xl border">
                  {toppingGroups.map((group) => {
                    const isSelected = selectedGroups.find(
                      (g) => g.id === group.id
                    );
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
                            {group.is_required ? "Bắt buộc chọn" : "Tùy chọn"}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={!!isSelected}
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
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Tạo món mới
          </button>
        </div>
      </div>
    </div>
  );
};
