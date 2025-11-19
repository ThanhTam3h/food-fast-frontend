// import { Edit } from "lucide-react";
// import { formatCurrency } from "../../utils/formatCurrency";

// export const MenuItem = ({ item, onToggleStatus, onEdit, onReorder }) => {
//   const isSaleable = item.isAvailable && item.status === "Đang bán";
//   const statusColor = isSaleable
//     ? "text-green-600 bg-green-100"
//     : "text-red-600 bg-red-100";

//   return (
//     <div className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors">
//       <div className="flex-1 min-w-0">
//         <div className="text-sm font-medium text-gray-800 truncate">
//           {item.name}
//           {item.promo && (
//             <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
//               {item.promo}
//             </span>
//           )}
//         </div>
//         <p className="text-xs text-gray-500 mt-1">
//           {item.category} | {formatCurrency(item.price)}
//         </p>
//       </div>

//       <div className="flex items-center space-x-4">
//         <div className="text-xs font-semibold uppercase hidden lg:block w-20">
//           <span className={`px-2 py-1 rounded-full ${statusColor}`}>
//             {item.status}
//           </span>
//         </div>

//         <div className="flex space-x-2">
//           <button
//             onClick={() => onEdit(item)}
//             className="p-2 rounded-full text-blue-500 hover:bg-blue-100"
//           >
//             <Edit className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// src/merchant/components/Menu/MenuItem.jsx
import { Edit3, ToggleLeft, ToggleRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export const MenuItem = ({ item, onToggleStatus, onEdit }) => {
  const isAvailable = item.isAvailable;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 border-b hover:bg-orange-50 transition-all">
      {/* Tên món + promo */}
      <div className="md:col-span-5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{item.name}</p>
        </div>
      </div>

      {/* Giá */}
      <div className="md:col-span-2 text-center">
        <p className="font-semibold text-orange-600 text-lg">
          {formatCurrency(item.price)}
        </p>
      </div>

      {/* Danh mục */}
      <div className="md:col-span-2 text-center">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {item.category}
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
        <button
          onClick={onToggleStatus}
          className="relative inline-flex items-center cursor-pointer group"
        >
          {isAvailable ? (
            <ToggleRight className="w-11 h-11 text-orange-500" />
          ) : (
            <ToggleLeft className="w-11 h-11 text-gray-400" />
          )}
        </button>

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
