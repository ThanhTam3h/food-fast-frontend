import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  createToppingGroup,
  updateToppingGroup,
} from "../../../State/Admin/Menu/menu.action";
import { InputField } from "../Common/InputField";

export const ToppingGroupFormModal = ({
  toppingGroup,
  onClose,
  merchantId,
  onSaved,
}) => {
  const dispatch = useDispatch();

  const [data, setData] = useState({
    id: toppingGroup?.id || null,
    name: toppingGroup?.name || "",
    is_required: toppingGroup?.is_required ?? true,
    minSelection: toppingGroup?.minSelection ?? 1,
    maxSelection: toppingGroup?.maxSelection ?? 1,
    toppings:
      toppingGroup?.toppings?.length > 0
        ? toppingGroup.toppings.map((t) => ({
            id: t.id || null,
            name: t.name || "",
            price: t.price || 0,
            is_active: t.is_active ?? true,
            is_default: t.is_default ?? false,
          }))
        : [
            {
              id: null,
              name: "",
              price: 0,
              is_active: true,
              is_default: false,
            },
          ],
  });

  const [loading, setLoading] = useState(false);

  // Helper functions cho toppings
  const addTopping = () => {
    setData((prev) => ({
      ...prev,
      toppings: [
        ...prev.toppings,
        { id: null, name: "", price: 0, is_active: true, is_default: false },
      ],
    }));
  };

  const removeTopping = (index) => {
    setData((prev) => ({
      ...prev,
      toppings: prev.toppings.filter((_, i) => i !== index),
    }));
  };

  const updateTopping = (index, field, value) => {
    setData((prev) => ({
      ...prev,
      toppings: prev.toppings.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      ),
    }));
  };

  // Xử lý lưu
  const handleSave = async () => {
    if (!data.name.trim()) {
      alert("Vui lòng nhập tên nhóm topping!");
      return;
    }

    // Validate ít nhất 1 topping có tên
    const hasValidTopping = data.toppings.some((t) => t.name.trim());
    if (!hasValidTopping) {
      alert("Vui lòng nhập ít nhất 1 topping hợp lệ!");
      return;
    }

    setLoading(true);

    const payload = {
      name: data.name.trim(),
      is_required: data.is_required,
      minSelection: data.is_required
        ? Math.max(1, data.minSelection)
        : data.minSelection,
      maxSelection: Math.max(data.minSelection, data.maxSelection),
      merchantId: Number(merchantId),
      toppings: data.toppings
        .filter((t) => t.name.trim()) // chỉ gửi topping có tên
        .map((t) => ({
          id: t.id || undefined,
          name: t.name.trim(),
          price: Number(t.price) || 0,
          is_active: t.is_active,
          is_default: t.is_default,
        })),
    };

    try {
      if (data.id) {
        // Cập nhật
        await dispatch(updateToppingGroup(data.id, payload));
      } else {
        // Tạo mới
        await dispatch(createToppingGroup(payload));
      }

      onSaved?.(); // callback để refresh danh sách ngoài modal
      onClose();
    } catch (err) {
      console.error("Lưu topping group thất bại:", err);
      alert("Có lỗi xảy ra khi lưu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {data.id ? "Chỉnh sửa" : "Tạo mới"} nhóm topping
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
            disabled={loading}
          >
            <X className="w-7 h-7 text-gray-500" />
          </button>
        </div>

        <div className="p-8 space-y-8 text-gray-700">
          {/* Tên nhóm */}
          <InputField
            label="Tên nhóm topping"
            placeholder="VD: Size, Phô mai, Topping thêm..."
            value={data.name}
            onChange={(e) =>
              setData((prev) => ({ ...prev, name: e.target.value }))
            }
            disabled={loading}
          />

          {/* Quyền tùy chọn */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h3 className="font-bold text-lg mb-4 text-gray-700">
              Quyền tùy chọn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  data.is_required
                    ? "border-green-500 bg-green-50 shadow-lg"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div>
                  <span className="font-semibold text-gray-800">
                    Bắt buộc chọn
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    Khách phải chọn ít nhất 1
                  </p>
                </div>
                <input
                  type="radio"
                  name="req"
                  checked={data.is_required}
                  onChange={() =>
                    setData((prev) => ({
                      ...prev,
                      is_required: true,
                      minSelection: Math.max(1, prev.minSelection),
                    }))
                  }
                  disabled={loading}
                />
              </label>

              <label
                className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  !data.is_required
                    ? "border-green-500 bg-green-50 shadow-lg"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div>
                  <span className="font-semibold text-gray-800">Tùy chọn</span>
                  <p className="text-xs text-gray-600 mt-1">
                    Khách có thể bỏ qua
                  </p>
                </div>
                <input
                  type="radio"
                  name="req"
                  checked={!data.is_required}
                  onChange={() =>
                    setData((prev) => ({ ...prev, is_required: false }))
                  }
                  disabled={loading}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField
                label="Số lượng tối thiểu"
                type="number"
                value={data.minSelection}
                min="0"
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    minSelection: +e.target.value || 0,
                  }))
                }
                disabled={loading}
              />
              <InputField
                label="Số lượng tối đa"
                type="number"
                value={data.maxSelection}
                min={data.minSelection}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    maxSelection: Math.max(
                      data.minSelection,
                      +e.target.value || 1
                    ),
                  }))
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Danh sách topping */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                Danh sách topping
              </h3>
              <span className="text-sm text-gray-500">
                {data.toppings.length} mục
              </span>
            </div>

            {data.toppings.map((opt, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border hover:border-green-300 transition-all"
              >
                <GripVertical className="w-6 h-6 text-gray-400 cursor-move" />

                <input
                  type="text"
                  placeholder={`Tên topping ${index + 1}`}
                  value={opt.name}
                  onChange={(e) => updateTopping(index, "name", e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm font-medium"
                  disabled={loading}
                />

                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={opt.price}
                    onChange={(e) =>
                      updateTopping(index, "price", +e.target.value || 0)
                    }
                    className="w-32 px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm font-medium"
                    disabled={loading}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    ₫
                  </span>
                </div>

                <button
                  onClick={() => removeTopping(index)}
                  className="p-3 text-red-500 hover:bg-red-100 rounded-full transition-all"
                  disabled={loading || data.toppings.length === 1}
                  title="Xóa topping"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              onClick={addTopping}
              disabled={loading}
              className="w-full py-4 border-2 border-dashed border-green-400 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all flex items-center justify-center gap-3 group"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              Thêm topping mới
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-white flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-8 py-4 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {data.id ? "Cập nhật nhóm" : "Tạo nhóm topping"}
          </button>
        </div>
      </div>
    </div>
  );
};
