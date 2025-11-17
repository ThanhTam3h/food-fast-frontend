import { useState } from "react";
import { Image, XCircle } from "lucide-react";
import InputField from "../Components/InputField";
import SelectField from "../Components/SelectField";
import TextAreaField from "../Components/TextAreaField";

const initialToppingGroups = [
	{
		id: 101,
		name: "Size",
		required: true,
		min: 1,
		max: 1,
		options: [
			{ id: 1, name: "Size S", price: 0 },
			{ id: 2, name: "Size L", price: 30000 },
		],
	},
	{
		id: 102,
		name: "Topping Phô Mai",
		required: false,
		min: 0,
		max: 3,
		options: [
			{ id: 3, name: "Phô Mai Bột", price: 15000 },
			{ id: 4, name: "Phô Mai Kéo Sợi", price: 20000 },
		],
	},
];

const initialCategories = [
	{ id: "cat1", name: "Gà Chiên", dishCount: 3 },
	{ id: "cat2", name: "Món Chính", dishCount: 1 },
];

const EditDishModal = ({ dish, onClose }) => {
	// State cho form (mock)
	const [dishData, setDishData] = useState({
		name: dish.name,
		price: dish.price,
		description:
			"Món gà rán giòn rụm tẩm sốt BBQ đặc biệt, hương vị mùa lửa hồng độc quyền.",
		category: dish.category,
		isAvailable: dish.isAvailable,
		// ... thêm các trường khác
	});

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setDishData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSave = () => {
		console.log("Lưu món ăn:", dishData);
		alert(`Đã lưu món: ${dishData.name}. (Mock API call)`);
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
				{/* Header Modal */}
				<div className="flex justify-between items-center p-4 border-b">
					<h2 className="text-xl font-semibold text-gray-800">Chi tiết món</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
						<XCircle className="w-6 h-6" />
					</button>
				</div>

				{/* Nội dung Modal */}
				<div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Cột 1: Hình ảnh */}
					<div className="lg:col-span-1 border-r pr-6">
						<div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
							<Image className="w-12 h-12 text-gray-400" />
						</div>
						<p className="text-sm text-center text-gray-500 mt-2">
							Ảnh đại diện món ăn
						</p>
						<button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
							Tải ảnh lên
						</button>
						<p className="text-xs text-red-500 mt-2">
							Biểu quyết độ nét ảnh: 1/11
						</p>
					</div>

					{/* Cột 2 & 3: Chi tiết Form */}
					<div className="lg:col-span-2 space-y-4">
						<InputField label="Mã Món" value={`Mã: 160373087`} readOnly />
						<InputField
							label="Tên Món"
							name="name"
							value={dishData.name}
							onChange={handleChange}
						/>
						<InputField
							label="Giá"
							name="price"
							type="number"
							value={dishData.price}
							onChange={handleChange}
							suffix="₫"
						/>

						<div className="grid grid-cols-2 gap-4">
							<SelectField
								label="Danh mục"
								name="category"
								value={dishData.category}
								onChange={handleChange}>
								{initialCategories.map((cat) => (
									<option key={cat.id} value={cat.name}>
										{cat.name}
									</option>
								))}
							</SelectField>
							<InputField label="Thời gian bán" value="Cả ngày" readOnly />
						</div>

						<TextAreaField
							label="Mô tả"
							name="description"
							value={dishData.description}
							onChange={handleChange}
						/>

						{/* Topping và Bán hàng */}
						<div className="space-y-3 pt-4 border-t">
							<h3 className="font-semibold text-gray-700">Cấu hình</h3>
							<div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
								<label className="text-sm font-medium text-gray-700">
									Món còn bán
								</label>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										name="isAvailable"
										checked={dishData.isAvailable}
										onChange={handleChange}
										className="sr-only peer"
									/>
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
								</label>
							</div>

							<SelectField
								label="Chọn Topping đính kèm"
								name="topping"
								value="default"
								onChange={handleChange}>
								<option value="default" disabled>
									Chọn Topping
								</option>
								{initialToppingGroups.map((group) => (
									<option key={group.id} value={group.name}>
										{group.name}
									</option>
								))}
								<option value="add_new">Thêm nhóm topping mới...</option>
							</SelectField>
						</div>
					</div>
				</div>

				{/* Footer Modal */}
				<div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-xl">
					<button
						onClick={onClose}
						className="mr-3 text-gray-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">
						Hủy
					</button>
					<button
						onClick={handleSave}
						className="bg-orange-500 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors">
						Lưu
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditDishModal;
