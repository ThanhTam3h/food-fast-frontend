import { ChevronUp, ChevronDown, XCircle, GripVertical } from "lucide-react";
import { useState } from "react";

export const ReorderGroupModal = ({ categories, onSave, onClose }) => {
  const [list, setList] = useState(categories);

  const move = (i, dir) => {
    const newList = [...list];
    const target = dir === "up" ? i - 1 : i + 1;
    if (target >= 0 && target < newList.length) {
      [newList[i], newList[target]] = [newList[target], newList[i]];
      setList(newList);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Sắp xếp nhóm món</h2>
          <button onClick={onClose}>
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {list.map((cat, i) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                <span className="font-medium">{cat.name}</span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => move(i, "up")}
                  disabled={i === 0}
                  className="p-1 disabled:opacity-30"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <button
                  onClick={() => move(i, "down")}
                  disabled={i === list.length - 1}
                  className="p-1 disabled:opacity-30"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={() => {
              onSave(list);
              onClose();
            }}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
