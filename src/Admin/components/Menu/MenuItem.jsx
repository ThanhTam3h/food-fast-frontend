
import { Edit3 } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export const MenuItem = ({ item, onEdit }) => {
  const isAvailable = item.status;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 border-b hover:bg-orange-50 transition-all">
      {/* Tên món + promo */}
      <div className="md:col-span-5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{item?.name}</p>
        </div>
      </div>

      {/* Giá */}
      <div className="md:col-span-2 text-center">
        <p className="font-semibold text-orange-600 text-lg">
          {formatCurrency(item?.price)}
        </p>
      </div>

      {/* Danh mục */}
      <div className="md:col-span-2 text-center">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {item?.category}
        </span>
      </div>

      {/* Trạng thái */}
      <div className="md:col-span-2 text-center">
        <span
          className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold ${
            isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isAvailable ? "Đang bán" : "Tạm ẩn"}
        </span>
      </div>

      {/* Hành động: Toggle + Edit */}
      <div className="md:col-span-1 flex justify-center items-center gap-3">
        {/* Toggle bật/tắt */}

        {/* Nút Edit */}
        <button
          onClick={() => onEdit(item)}
          className="p-2.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
