// src/merchant/components/Menu/EditDishModal.jsx
import { Image, Plus, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  getProducts,
  updateProduct,
} from "../../../State/Admin/Menu/menu.action";

export const EditDishModal = ({
  dish,
  categories,
  toppingGroups,
  merchantId,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(dish.image || "");
  const [toppingGroupsEdited, setToppingGroupsEdited] = useState(false);

  const [form, setForm] = useState({
    name: dish.name || "",
    price: dish.price || 0,
    description: dish.description || "",
    categoryId:
      categories.find((c) => c.name === dish.category)?.id ||
      categories[0]?.id ||
      "",
    isActive: dish.isAvailable,

    productToppingGroups:
      dish.productToppingGroups?.map((g) => g.toppingGroupId) || [],
  });

  const [showToppingSelector, setShowToppingSelector] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ĐÚNG: lưu file thật, không chỉ URL
    setImageFile(file); // ← file thật để gửi API
    setImagePreview(URL.createObjectURL(file)); // ← chỉ để preview
  };

  // const toggleToppingGroup = (groupId) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     productToppingGroups: prev.productToppingGroups.includes(groupId)
  //       ? prev.productToppingGroups.filter((id) => id !== groupId)
  //       : [...prev.productToppingGroups, groupId],
  //   }));
  // };

  const toggleToppingGroup = (groupId) => {
    setForm((prev) => {
      return {
        ...prev,
        productToppingGroups: prev.productToppingGroups.includes(groupId)
          ? prev.productToppingGroups.filter((id) => id !== groupId)
          : [...prev.productToppingGroups, groupId],
      };
    });
    setToppingGroupsEdited(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Vui lòng nhập tên món!");
    if (form.price <= 0) return alert("Giá phải lớn hơn 0!");

    setLoading(true);
    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("basePrice", Number(form.price));
    formData.append("categoryId", Number(form.categoryId));
    formData.append("isActive", form.isActive ? "true" : "false");

    formData.append("merchantId", Number(merchantId));

    // Topping groups
    // form.productToppingGroups.forEach((id, index) => {
    //   formData.append(`productToppingGroups[${index}][toppingGroupId]`, id);
    // });

    // Kiểm tra có chỉnh topping hay không
    if (toppingGroupsEdited) {
      if (form.productToppingGroups.length === 0) {
        formData.append("productToppingGroups", JSON.stringify([])); // xóa tất cả
      } else {
        form.productToppingGroups.forEach((id, index) => {
          formData.append(`productToppingGroups[${index}][toppingGroupId]`, id);
        });
      }
    }

    // SIÊU QUAN TRỌNG: CHỈ GỬI FILE NẾU CÓ THẬT
    if (imageFile && imageFile instanceof File) {
      console.log(
        "Đang gửi file:",
        imageFile.name,
        imageFile.size,
        imageFile.type
      ); // ← kiểm tra log
      formData.append("file", imageFile); // ← tên field phải đúng với backend: FileInterceptor('file')
    } else {
      console.log("Không có ảnh mới hoặc file không hợp lệ");
    }

    // Debug: xem FormData có file không
    for (let [key, value] of formData.entries()) {
      console.log("FormData →", key, value);
    }

    try {
      await dispatch(updateProduct(dish.id, formData));
      await dispatch(getProducts({ merchantId }));
      alert("Cập nhật thành công + ảnh đã lưu!");
      onClose();
    } catch (err) {
      console.error("Lỗi:", err.response?.data || err);
      alert("Lỗi: " + (err?.response?.data?.message || "Không thể cập nhật"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto text-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800">Chỉnh sửa món ăn</h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition hover:scale-110"
          >
            <X className="w-7 h-7 text-gray-500" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột ảnh */}
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-dashed border-gray-300 overflow-hidden relative group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Image className="w-20 h-20 text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">Chưa có ảnh</p>
                </div>
              )}
              <label className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                <Upload className="w-12 h-12 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg text-center transition transform hover:scale-105 flex items-center justify-center gap-3">
                <Upload className="w-6 h-6" />
                Tải ảnh mới
              </div>
            </label>
          </div>

          {/* Form chính */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tên món ăn *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                  placeholder="VD: Gà Rán Cay"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Giá bán *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) || 0 })
                  }
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: Number(e.target.value) })
                }
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mô tả món ăn
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition"
                placeholder="Mô tả hấp dẫn để khách thèm..."
              />
            </div>

            {/* Trạng thái */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
              <div>
                <p className="font-bold text-gray-800">Hiển thị trên menu</p>
                <p className="text-sm text-gray-600">
                  Tắt nếu món đang hết nguyên liệu
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-16 h-9 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Topping Groups */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                  Nhóm Topping
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full font-bold">
                    {form.productToppingGroups.length}
                  </span>
                </h3>
                <button
                  onClick={() => setShowToppingSelector(!showToppingSelector)}
                  className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition"
                >
                  <Plus className="w-5 h-5" />
                  {showToppingSelector ? "Ẩn" : "Chọn nhóm"}
                </button>
              </div>

              {form.productToppingGroups.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {form.productToppingGroups.map((id) => {
                    const group = toppingGroups.find((g) => g.id === id);
                    return group ? (
                      <div
                        key={id}
                        className="bg-white rounded-xl border-2 border-purple-300 shadow-md p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-purple-700">
                            {group.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {group.toppings?.length || 0} tùy chọn
                          </p>
                        </div>
                        <button
                          onClick={() => toggleToppingGroup(id)}
                          className="text-red-500 hover:bg-red-100 rounded-full p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {showToppingSelector && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-white rounded-xl border">
                  {toppingGroups.map((group) => (
                    <label
                      key={group.id}
                      className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        form.productToppingGroups.includes(group.id)
                          ? "border-purple-500 bg-purple-50 shadow-lg"
                          : "border-gray-300 hover:border-purple-300"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{group.name}</p>
                        <p className="text-xs text-gray-500">
                          {group.toppings?.length || 0} topping
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.productToppingGroups.includes(group.id)}
                        onChange={() => toggleToppingGroup(group.id)}
                        className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500"
                      />
                    </label>
                  ))}
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
            disabled={loading}
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-70 flex items-center gap-3"
          >
            {loading && (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Đang lưu..." : "Cập nhật món"}
          </button>
        </div>
      </div>
    </div>
  );
};
