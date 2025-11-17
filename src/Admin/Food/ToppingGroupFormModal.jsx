import { useState } from "react";
import { XCircle, GripVertical, Trash2 } from "lucide-react";
import PlusIcon from "../Components/PlusIcon.jsx";
import InputField from "../Components/InputField.jsx";

const ToppingGroupFormModal = ({ toppingGroup, onClose }) => {
	const [groupData, setGroupData] = useState(
		toppingGroup || {
			name: "",
			required: true,
			min: 1,
			max: 1,
			options: [{ id: Math.random(), name: "Topping 1", price: 0 }],
		}
	);

	const handleOptionChange = (id, field, value) => {
		setGroupData((prev) => ({
			...prev,
			options: prev.options.map((opt) =>
				opt.id === id ? { ...opt, [field]: value } : opt
			),
		}));
	};

	const handleAddOption = () => {
		setGroupData((prev) => ({
			...prev,
			options: [...prev.options, { id: Math.random(), name: "", price: 0 }],
		}));
	};

	const handleRemoveOption = (id) => {
		setGroupData((prev) => ({
			...prev,
			options: prev.options.filter((opt) => opt.id !== id),
		}));
	};

	const handleSave = () => {
		console.log("Lưu Nhóm Topping:", groupData);
		alert(`Đã lưu Nhóm Topping: ${groupData.name}. (Mock API call)`);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center p-4 border-b">
					<h2 className="text-xl font-semibold text-gray-800">
						{toppingGroup ? "Chỉnh Sửa" : "Thêm"} Nhóm Topping
					</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
						<XCircle className="w-6 h-6" />
					</button>
				</div>

				<div className="p-6 space-y-6">
					{/* Tên nhóm */}
					<InputField
						label="Tên Nhóm Topping"
						value={groupData.name}
						onChange={(e) =>
							setGroupData((p) => ({ ...p, name: e.target.value }))
						}
					/>

					{/* Cấu hình bắt buộc/tùy chọn */}
					<div className="p-4 border rounded-lg bg-blue-50 space-y-3">
						<h3 className="font-semibold text-gray-700">Quyền tùy chọn</h3>

						<label className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer">
							<span className="text-sm font-medium">Không bắt buộc</span>
							<input
								type="radio"
								name="requiredOption"
								checked={!groupData.required}
								onChange={() =>
									setGroupData((p) => ({ ...p, required: false, min: 0 }))
								}
								className="text-orange-500 w-4 h-4 border-gray-300 focus:ring-orange-500"
							/>
						</label>

						<label className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer">
							<span className="text-sm font-medium">Bắt buộc</span>
							<input
								type="radio"
								name="requiredOption"
								checked={groupData.required}
								onChange={() =>
									setGroupData((p) => ({ ...p, required: true, min: 1 }))
								}
								className="text-orange-500 w-4 h-4 border-gray-300 focus:ring-orange-500"
							/>
						</label>

						<div className="grid grid-cols-2 gap-4">
							<InputField
								label="Số lượng tối thiểu"
								type="number"
								value={groupData.min}
								disabled={groupData.required}
								onChange={(e) =>
									setGroupData((p) => ({ ...p, min: parseInt(e.target.value) }))
								}
							/>
							<InputField
								label="Số lượng tối đa"
								type="number"
								value={groupData.max}
								onChange={(e) =>
									setGroupData((p) => ({ ...p, max: parseInt(e.target.value) }))
								}
							/>
						</div>
					</div>

					{/* Danh sách Topping Options */}
					<div className="space-y-3">
						<h3 className="font-semibold text-gray-700">Danh sách Topping</h3>
						{groupData.options.map((option, index) => (
							<div
								key={option.id}
								className="flex items-center space-x-2 p-3 border rounded-lg bg-gray-50">
								<GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
								<input
									type="text"
									placeholder="Tên Topping"
									value={option.name}
									onChange={(e) =>
										handleOptionChange(option.id, "name", e.target.value)
									}
									className="flex-1 p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
								/>
								<input
									type="number"
									placeholder="Giá (₫)"
									value={option.price}
									onChange={(e) =>
										handleOptionChange(
											option.id,
											"price",
											parseInt(e.target.value) || 0
										)
									}
									className="w-24 p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm"
								/>
								<button
									onClick={() => handleRemoveOption(option.id)}
									className="text-red-500 p-2 rounded-full hover:bg-red-100">
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						))}
						<button
							onClick={handleAddOption}
							className="w-full text-orange-500 font-medium py-2 border border-dashed border-orange-300 rounded-lg hover:bg-orange-50 mt-2">
							<PlusIcon className="w-4 h-4 inline mr-1" /> Thêm Topping
						</button>
					</div>
				</div>

				<div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-xl">
					<button
						onClick={handleSave}
						className="bg-orange-500 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors">
						Hoàn tất
					</button>
				</div>
			</div>
		</div>
	);
};

export default ToppingGroupFormModal;
