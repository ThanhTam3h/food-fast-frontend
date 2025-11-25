// src/merchant/components/Menu/CategoryModal.jsx
import { Package, X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../../../State/Admin/Menu/menu.action";

export const CategoryModal = ({ category, merchantId, onClose }) => {
  const dispatch = useDispatch();
  const isEdit = !!category?.id;

    console.log(category);

  const [formData, setFormData] = useState({
    name: category?.name || "",
    isActive: category?.isActive ?? true,
  });

  console.log(merchantId);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Vui lòng nhập tên danh mục!");

    setLoading(true);
    try {
        const payload = { ...formData, merchantId: Number(merchantId) };
        

      if (isEdit) {
        await dispatch(updateCategory(category.id, payload));
      } else {
        await dispatch(createCategory(payload));
      }

      dispatch(getCategories(merchantId));
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Lưu danh mục thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-gray-700 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <Package className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-3 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
          >
            <X className="w-7 h-7 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Gà Rán, Burger, Đồ Uống..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl  focus:border-transparent transition"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-5 h-5 text-green-600 rounded"
              disabled={loading}
            />
            <label htmlFor="isActive" className="text-gray-700 font-medium">
              Hiển thị danh mục này trên menu
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-8 py-3 text-gray-600 font-medium border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-70 flex items-center gap-3"
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isEdit ? "Cập nhật" : "Tạo danh mục"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
