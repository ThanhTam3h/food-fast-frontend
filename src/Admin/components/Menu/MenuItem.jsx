import { Edit, GripVertical } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export const MenuItem = ({ item, onToggleStatus, onEdit, onReorder }) => {
  const isSaleable = item.isAvailable && item.status === "Đang bán";
  const statusColor = isSaleable
    ? "text-green-600 bg-green-100"
    : "text-red-600 bg-red-100";

  return (
    <div className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">
          {item.name}
          {item.promo && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {item.promo}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {item.category} | {formatCurrency(item.price)}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-xs font-semibold uppercase hidden lg:block w-20">
          <span className={`px-2 py-1 rounded-full ${statusColor}`}>
            {item.status}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 rounded-full text-blue-500 hover:bg-blue-100"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onReorder}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hidden md:block"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isSaleable}
            onChange={() => onToggleStatus(item.id)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
      </div>
    </div>
  );
};
