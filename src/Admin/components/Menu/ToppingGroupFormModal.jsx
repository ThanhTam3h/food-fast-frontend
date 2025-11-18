// src/merchant/components/menu/ToppingGroupFormModal.jsx
import { useState, useEffect } from "react";
import { GripVertical, Trash2, X, Plus } from "lucide-react";
import { InputField } from "../Common/InputField";

export const ToppingGroupFormModal = ({ toppingGroup, onClose, onSave }) => {
  const [data, setData] = useState({
    id: toppingGroup?.id || Date.now(),
    name: toppingGroup?.name || "",
    required: toppingGroup?.required ?? true,
    min: toppingGroup?.min ?? 1,
    max: toppingGroup?.max ?? 1,
    options:
      toppingGroup?.options?.length > 0
        ? toppingGroup.options
        : [{ id: Date.now(), name: "", price: 0 }],
  });

  // Tự động cập nhật min/max khi đổi required
  useEffect(() => {
    if (data.required && data.min === 0) {
      setData((prev) => ({ ...prev, min: 1 }));
    }
  }, [data.required]);

  const updateOption = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === id
          ? { ...opt, [field]: field === "price" ? +value || 0 : value }
          : opt
      ),
    }));
  };

  const addOption = () => {
    setData((prev) => ({
      ...prev,
      options: [...prev.options, { id: Date.now(), name: "", price: 0 }],
    }));
  };

  const removeOption = (id) => {
    if (data.options.length <= 1) {
      alert("Phải có ít nhất 1 topping trong nhóm!");
      return;
    }
    setData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }));
  };

  const handleSave = () => {
    // Validation
    if (!data.name.trim()) {
      alert("Vui lòng nhập tên nhóm topping!");
      return;
    }
    if (data.options.some((opt) => !opt.name.trim())) {
      alert("Vui lòng nhập tên cho tất cả topping!");
      return;
    }
    if (data.min > data.max) {
      alert("Số lượng tối thiểu không được lớn hơn tối đa!");
      return;
    }

    // Gọi callback (nếu có) hoặc log
    onSave?.(data);
    alert(`Đã lưu thành công nhóm: "${data.name}"`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-50 to-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {toppingGroup ? "Chỉnh sửa" : "Tạo mới"} nhóm topping
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
          >
            <X className="w-7 h-7 text-gray-500" />
          </button>
        </div>

        <div className="p-8 space-y-8 text-gray-700">
          {/* Tên nhóm */}
          <InputField
            label="Tên nhóm topping"
            placeholder="VD: Size, Phô mai, Đồ uống kèm..."
            value={data.name}
            onChange={(e) =>
              setData((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          {/* Bắt buộc / Tùy chọn */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
            <h3 className="font-bold text-lg mb-4 text-gray-700">
              Quyền tùy chọn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  data.required
                    ? "border-orange-500 bg-orange-50 shadow-lg"
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
                  checked={data.required}
                  onChange={() =>
                    setData((prev) => ({
                      ...prev,
                      required: true,
                      min: Math.max(1, prev.min),
                    }))
                  }
                  className="w-6 h-6 text-orange-500"
                />
              </label>

              <label
                className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  !data.required
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
                  checked={!data.required}
                  onChange={() =>
                    setData((prev) => ({ ...prev, required: false }))
                  }
                  className="w-6 h-6 text-green-500"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
              <InputField
                label="Số lượng tối thiểu"
                type="number"
                value={data.min}
                min="0"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, min: +e.target.value || 0 }))
                }
                disabled={!data.required && data.min === 0}
              />
              <InputField
                label="Số lượng tối đa"
                type="number"
                value={data.max}
                min={data.min}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    max: Math.max(data.min, +e.target.value || 1),
                  }))
                }
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
                {data.options.length} mục
              </span>
            </div>

            {data.options.map((opt, index) => (
              <div
                key={opt.id}
                className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border hover:border-orange-300 transition-all"
              >
                <GripVertical className="w-6 h-6 text-gray-400 cursor-move" />

                <input
                  type="text"
                  placeholder={`Topping ${index + 1}`}
                  value={opt.name}
                  onChange={(e) => updateOption(opt.id, "name", e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium"
                />

                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={opt.price}
                    onChange={(e) =>
                      updateOption(opt.id, "price", +e.target.value)
                    }
                    className="w-32 px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    ₫
                  </span>
                </div>

                <button
                  onClick={() => removeOption(opt.id)}
                  className="p-3 text-red-500 hover:bg-red-100 rounded-full transition-all hover:scale-110"
                  title="Xóa topping"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              onClick={addOption}
              className="w-full py-4 border-2 border-dashed border-orange-400 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center gap-3 group"
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
            className="px-8 py-4 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            {toppingGroup ? "Cập nhật nhóm" : "Tạo nhóm topping"}
          </button>
        </div>
      </div>
    </div>
  );
};
