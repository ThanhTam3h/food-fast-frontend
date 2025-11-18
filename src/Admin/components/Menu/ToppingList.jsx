import { Edit } from "lucide-react";

export const ToppingList = ({ groups, onEdit }) => (
  <div className="bg-white shadow-xl rounded-xl overflow-hidden">
    {groups.map((group) => (
      <div
        key={group.id}
        className="flex items-center p-4 border-b hover:bg-gray-50 text-gray-700"
      >
        <div className="flex-1">
          <p className="font-medium">{group.name}</p>
          <p className="text-xs text-gray-500">
            {group.options.length} loại topping
          </p>
        </div>
        <div className="w-32 text-center">
          <span
            className={`text-sm font-semibold ${
              group.required ? "text-blue-600" : "text-green-600"
            }`}
          >
            {group.required ? "Bắt buộc" : "Tùy chọn"}
          </span>
        </div>
        <button
          onClick={() => onEdit(group)}
          className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
);
