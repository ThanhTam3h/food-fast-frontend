import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, XCircle } from "lucide-react";
import PlusIcon from "../Components/PlusIcon.jsx";

const ReorderGroupModal = ({ categories, onSave, onClose }) => {
	const [list, setList] = useState(categories);

	const handleMove = (index, direction) => {
		const newList = [...list];
		const newIndex = direction === "up" ? index - 1 : index + 1;
		if (newIndex >= 0 && newIndex < newList.length) {
			[newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
			setList(newList);
		}
	};

	// Nút Di chuyển (Mô phỏng kéo thả)
	const ReorderButton = ({ direction, index, total }) => {
		const isMovable =
			(direction === "up" && index > 0) ||
			(direction === "down" && index < total - 1);
		const Icon = direction === "up" ? ChevronUp : ChevronDown;

		return (
			<button
				onClick={() => handleMove(index, direction)}
				disabled={!isMovable}
				className={`p-1 rounded-full transition-colors ${
					isMovable
						? "hover:bg-gray-200 text-gray-700"
						: "text-gray-300 cursor-not-allowed"
				}`}>
				<Icon className="w-5 h-5" />
			</button>
		);
	};

	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
				{/* Header Modal */}
				<div className="flex justify-between items-center p-4 border-b">
					<h2 className="text-xl font-semibold text-gray-800">Sửa Nhóm</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
						<XCircle className="w-6 h-6" />
					</button>
				</div>

				{/* Danh sách nhóm món */}
				<div className="p-4 space-y-2">
					<p className="text-sm text-gray-500 mb-4">
						Kéo thả vị trí nhóm món và chọn Lưu
					</p>
					{list.map((group, index) => (
						<div
							key={group.id}
							className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
							<div className="flex items-center space-x-2 text-gray-800 font-medium">
								<GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
								<span>{group.name}</span>
							</div>
							<div className="flex items-center space-x-1">
								<ReorderButton
									direction="up"
									index={index}
									total={list.length}
								/>
								<ReorderButton
									direction="down"
									index={index}
									total={list.length}
								/>
							</div>
						</div>
					))}
					<button className="w-full text-orange-500 font-medium py-2 mt-4 hover:bg-orange-50 rounded-lg">
						<PlusIcon className="w-4 h-4 inline mr-1" /> Thêm Nhóm Mới
					</button>
				</div>

				{/* Footer Modal */}
				<div className="p-4 border-t flex justify-center bg-gray-50 rounded-b-xl">
					<button
						onClick={() => {
							onSave(list);
							onClose();
						}}
						className="w-full bg-orange-500 text-white font-medium py-3 rounded-lg shadow-md hover:bg-orange-600 transition-colors">
						Lưu
					</button>
				</div>
			</div>
		</div>
	);
};

export default ReorderGroupModal;
