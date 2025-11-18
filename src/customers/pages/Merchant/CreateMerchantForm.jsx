// import React, { useState } from "react";
// import axios from "axios";

// const CreateMerchantForm = () => {
//   const [form, setForm] = useState({
//     name: "",
//     representativeName: "",
//     merchantEmail: "",
//     merchantPhoneNumber: "",
//     restaurantAddress: "",
//     businessModel: "",
//     dailyOrderVolume: 100,
//     registrationType: "",
//     legalBusinessName: "",
//     businessRegistrationCode: "",
//     registrationDate: "",
//     businessIndustry: "",
//     bankName: "",
//     bankAccountNumber: "",
//     bankAccountHolderName: "",
//     ownerName: "",
//     ownerDateOfBirth: "",
//     ownerIdNumber: "",
//     ownerIdIssueDate: "",
//     ownerIdIssuePlace: "",
//     ownerIdExpiryDate: "",
//     ownerPermanentAddress: "",
//     ownerCountry: "",
//     ownerCity: "",
//     ownerCurrentAddress: "",
//   });

//   const [images, setImages] = useState({
//     IDENTITY: [],
//     BUSINESS: [],
//     KITCHEN: [],
//     OTHERS: [],
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleFileChange = (e, type) => {
//     setImages({ ...images, [type]: Array.from(e.target.files) });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();

//     // Thêm tất cả field
//     Object.keys(form).forEach((key) => {
//       if (form[key]) formData.append(key, form[key]);
//     });

//     // Thêm các file theo type
//     Object.keys(images).forEach((type) => {
//       images[type].forEach((file) => {
//         formData.append(type, file);
//       });
//     });

//     try {
//       const res = await axios.post(
//         "http://localhost:3000/api/v1/merchants",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log("Created merchant:", res.data);
//       alert("Merchant created successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create merchant");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ maxWidth: "800px", margin: "auto", color: "black" }}>
//       <h2>Thông tin cửa hàng</h2>
//       <input
//         name="name"
//         placeholder="Tên cửa hàng"
//         value={form.name}
//         onChange={handleChange}
//         required
//       />
//       <input
//         name="representativeName"
//         placeholder="Tên người đại diện"
//         value={form.representativeName}
//         onChange={handleChange}
//       />
//       <input
//         name="merchantEmail"
//         placeholder="Email"
//         value={form.merchantEmail}
//         onChange={handleChange}
//       />
//       <input
//         name="merchantPhoneNumber"
//         placeholder="Số điện thoại"
//         value={form.merchantPhoneNumber}
//         onChange={handleChange}
//       />
//       <input
//         name="restaurantAddress"
//         placeholder="Địa chỉ cửa hàng"
//         value={form.restaurantAddress}
//         onChange={handleChange}
//         required
//       />
//       <input
//         name="businessModel"
//         placeholder="Mô hình kinh doanh"
//         value={form.businessModel}
//         onChange={handleChange}
//       />
//       <input
//         type="number"
//         name="dailyOrderVolume"
//         placeholder="Số lượng đơn hàng trung bình 1 ngày"
//         value={form.dailyOrderVolume}
//         onChange={handleChange}
//       />

//       <h2>Thông tin đăng ký & mô hình</h2>
//       <input
//         name="registrationType"
//         placeholder="Hình thức đăng ký"
//         value={form.registrationType}
//         onChange={handleChange}
//       />
//       <input
//         name="legalBusinessName"
//         placeholder="Tên đăng ký kinh doanh đầy đủ"
//         value={form.legalBusinessName}
//         onChange={handleChange}
//       />
//       <input
//         name="businessRegistrationCode"
//         placeholder="Mã số doanh nghiệp"
//         value={form.businessRegistrationCode}
//         onChange={handleChange}
//       />
//       <input
//         type="date"
//         name="registrationDate"
//         placeholder="Ngày đăng ký kinh doanh"
//         value={form.registrationDate}
//         onChange={handleChange}
//       />
//       <input
//         name="businessIndustry"
//         placeholder="Ngành nghề kinh doanh"
//         value={form.businessIndustry}
//         onChange={handleChange}
//       />

//       <h3>Hình ảnh</h3>
//       <label>Hình ảnh căn cước công dân (IDENTITY)</label>
//       <input
//         type="file"
//         multiple
//         onChange={(e) => handleFileChange(e, "IDENTITY")}
//       />

//       <label>Hình ảnh giấy phép kinh doanh (BUSINESS)</label>
//       <input
//         type="file"
//         multiple
//         onChange={(e) => handleFileChange(e, "BUSINESS")}
//       />

//       <label>Hình ảnh bếp (KITCHEN)</label>
//       <input
//         type="file"
//         multiple
//         onChange={(e) => handleFileChange(e, "KITCHEN")}
//       />

//       <label>Hình ảnh xung quanh nhà hàng (OTHERS)</label>
//       <input
//         type="file"
//         multiple
//         onChange={(e) => handleFileChange(e, "OTHERS")}
//       />

//       <h2>Thông tin ngân hàng</h2>
//       <input
//         name="bankName"
//         placeholder="Tên ngân hàng"
//         value={form.bankName}
//         onChange={handleChange}
//       />
//       <input
//         name="bankAccountNumber"
//         placeholder="Số tài khoản"
//         value={form.bankAccountNumber}
//         onChange={handleChange}
//       />
//       <input
//         name="bankAccountHolderName"
//         placeholder="Tên chủ tài khoản"
//         value={form.bankAccountHolderName}
//         onChange={handleChange}
//       />

//       <h2>Thông tin chủ sở hữu</h2>
//       <input
//         name="ownerName"
//         placeholder="Tên chủ sở hữu"
//         value={form.ownerName}
//         onChange={handleChange}
//       />
//       <input
//         type="date"
//         name="ownerDateOfBirth"
//         placeholder="Ngày sinh"
//         value={form.ownerDateOfBirth}
//         onChange={handleChange}
//       />
//       <input
//         name="ownerIdNumber"
//         placeholder="Số CMND/CCCD"
//         value={form.ownerIdNumber}
//         onChange={handleChange}
//       />
//       <input
//         type="date"
//         name="ownerIdIssueDate"
//         placeholder="Ngày cấp"
//         value={form.ownerIdIssueDate}
//         onChange={handleChange}
//       />
//       <input
//         name="ownerIdIssuePlace"
//         placeholder="Nơi cấp"
//         value={form.ownerIdIssuePlace}
//         onChange={handleChange}
//       />
//       <input
//         type="date"
//         name="ownerIdExpiryDate"
//         placeholder="Ngày hết hạn"
//         value={form.ownerIdExpiryDate}
//         onChange={handleChange}
//       />
//       <input
//         name="ownerPermanentAddress"
//         placeholder="Địa chỉ thường trú"
//         value={form.ownerPermanentAddress}
//         onChange={handleChange}
//       />
//       <input
//         name="ownerCountry"
//         placeholder="Quốc gia"
//         value={form.ownerCountry}
//         onChange={handleChange}
//       />
//       <input
//         name="ownerCity"
//         placeholder="Thành phố"
//         value={form.ownerCity}
//         onChange={handleChange}
//       />
//       <input
//         name="ownerCurrentAddress"
//         placeholder="Địa chỉ hiện tại"
//         value={form.ownerCurrentAddress}
//         onChange={handleChange}
//       />

//       <button type="submit">Tạo merchant</button>
//     </form>
//   );
// };

// export default CreateMerchantForm;

import React, { useState, useCallback } from "react";
import axios from "axios"; // npm install axios

const GOONG_API_KEY = process.env.REACT_APP_GOONG_API_KEY;

const getCoordinatesFromAddress = async (address) => {
	if (!GOONG_API_KEY) {
		console.error("Lỗi: Không tìm thấy Goong API Key.");
		// Ném lỗi này để handleSubmit dừng lại và báo cho người dùng
		throw new Error("Lỗi cấu hình: Vui lòng liên hệ quản trị viên.");
	}

	if (!address) {
		return null; // Không gọi API nếu địa chỉ trống
	}

	const url = "https://rsapi.goong.io/geocode";

	try {
		const response = await axios.get(url, {
			params: {
				address: address,
				api_key: GOONG_API_KEY,
			},
		});

		// 1. Kiểm tra API trả về có kết quả không
		if (
			response.data &&
			response.data.results &&
			response.data.results.length > 0
		) {
			// 2. Lấy kết quả đầu tiên (chính xác nhất)
			const location = response.data.results[0].geometry.location;

			const lat = location.lat;
			const lng = location.lng;

			// 3. Trả về theo đúng định dạng [Longitude, Latitude]
			return [lng, lat];
		} else {
			// API chạy thành công, nhưng không tìm thấy địa chỉ
			console.warn(
				"Goong Geocoding: Không tìm thấy kết quả cho địa chỉ:",
				address
			);
			return null; // Trả về null để handleSubmit báo lỗi
		}
	} catch (error) {
		console.error(
			"Lỗi khi gọi Goong Geocoding API:",
			error.response ? error.response.data : error.message
		);

		// Nếu lỗi 401 (Unauthorized) thường là sai API key
		if (error.response && error.response.status === 401) {
			throw new Error("Lỗi API Key: API Key của Goong không hợp lệ.");
		}
		// Lỗi mạng chung
		throw new Error(
			"Lỗi mạng khi đang cố gắng xác thực địa chỉ. Vui lòng thử lại."
		);
	}
};

const CreateMerchantForm = () => {
	const [form, setForm] = useState({
		name: "",
		representativeName: "",
		merchantEmail: "",
		merchantPhoneNumber: "",
		restaurantAddress: "",
		businessModel: "",
		dailyOrderVolume: 100,
		registrationType: "",
		legalBusinessName: "",
		businessRegistrationCode: "",
		registrationDate: "",
		businessIndustry: "",
		bankName: "",
		bankAccountNumber: "",
		bankAccountHolderName: "",
		ownerName: "",
		ownerDateOfBirth: "",
		ownerIdNumber: "",
		ownerIdIssueDate: "",
		ownerIdIssuePlace: "",
		ownerIdExpiryDate: "",
		ownerPermanentAddress: "",
		ownerCountry: "",
		ownerCity: "",
		ownerCurrentAddress: "",
	});

	const [images, setImages] = useState({
		IDENTITY: [],
		BUSINESS: [],
		KITCHEN: [],
		OTHERS: [],
	});

	const [status, setStatus] = useState({ message: "", type: "" });
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = useCallback((e) => {
		const { name, value } = e.target;
		setForm((prevForm) => ({ ...prevForm, [name]: value }));
	}, []);

	const handleFileChange = useCallback((e, type) => {
		setImages((prevImages) => ({
			...prevImages,
			[type]: Array.from(e.target.files),
		}));
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setStatus({ message: "", type: "" });

		const ownerId = 2; // <<< THAY BẰNG ID USER THẬT
		// ------------------------------------

		if (!ownerId) {
			setStatus({
				message: "Lỗi: Không tìm thấy ID người dùng. Bạn có thể đã đăng xuất.",
				type: "error",
			});
			setIsLoading(false);
			return;
		}

		let coordinates;
		try {
			setStatus({ message: "Đang xác thực địa chỉ...", type: "success" });
			coordinates = await getCoordinatesFromAddress(form.restaurantAddress);

			// Nếu API không tìm thấy địa chỉ (trả về null)
			if (!coordinates) {
				throw new Error(
					"Không thể tìm thấy tọa độ cho địa chỉ bạn cung cấp. Vui lòng kiểm tra lại (thêm phường, quận, v.v...)."
				);
			}
		} catch (geoError) {
			// Bắt lỗi (API sập, không tìm thấy, ...)
			console.error(geoError);
			setStatus({ message: geoError.message, type: "error" });
			setIsLoading(false);
			return; // Dừng submit
		}

		setStatus({
			message: "Địa chỉ hợp lệ. Đang tải lên hồ sơ...",
			type: "success",
		});

		const formData = new FormData();
		formData.append("ownerId", ownerId);
		Object.keys(form).forEach((key) => {
			if (key !== "restaurantAddress" && form[key]) {
				formData.append(key, form[key]);
			}
		});
		formData.append("temporaryAddress[street]", form.restaurantAddress);
		formData.append("temporaryAddress[location][type]", "Point");
		formData.append(
			"temporaryAddress[location][coordinates][0]",
			coordinates[0]
		); // Longitude
		formData.append(
			"temporaryAddress[location][coordinates][1]",
			coordinates[1]
		); // Latitude

		Object.keys(images).forEach((type) => {
			images[type].forEach((file) => {
				formData.append(type, file);
			});
		});

		try {
			const res = await axios.post(
				"http://localhost:3000/api/v1/merchants", // đổi URL theo backend
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } }
			);

			setStatus({
				message:
					"Đăng ký Merchant thành công! Chúng tôi sẽ xét duyệt hồ sơ của bạn.",
				type: "success",
			});

			// reset form
			setForm({
				name: "",
				representativeName: "",
				merchantEmail: "",
				merchantPhoneNumber: "",
				restaurantAddress: "",
				businessModel: "",
				dailyOrderVolume: 100,
				registrationType: "",
				legalBusinessName: "",
				businessRegistrationCode: "",
				registrationDate: "",
				businessIndustry: "",
				bankName: "",
				bankAccountNumber: "",
				bankAccountHolderName: "",
				ownerName: "",
				ownerDateOfBirth: "",
				ownerIdNumber: "",
				ownerIdIssueDate: "",
				ownerIdIssuePlace: "",
				ownerIdExpiryDate: "",
				ownerPermanentAddress: "",
				ownerCountry: "",
				ownerCity: "",
				ownerCurrentAddress: "",
			});
			setImages({ IDENTITY: [], BUSINESS: [], KITCHEN: [], OTHERS: [] });
		} catch (err) {
			console.error(err);
			setStatus({
				message: "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.",
				type: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const renderStatusMessage = () => {
		if (!status.message) return null;
		const baseClasses = "p-4 mt-4 rounded-lg text-sm font-semibold shadow-md";
		const successClasses =
			"bg-green-100 text-green-800 border border-green-300";
		const errorClasses = "bg-red-100 text-red-800 border border-red-300";

		return (
			<div
				className={`${baseClasses} ${
					status.type === "success" ? successClasses : errorClasses
				}`}
				role="alert">
				{status.message}
			</div>
		);
	};

	const SectionTitle = ({ children }) => (
		<h2 className="text-2xl font-bold text-gray-800 mb-4 mt-6">{children}</h2>
	);
	const SubTitle = ({ children }) => (
		<h3 className="text-xl font-semibold text-gray-700 mb-3 mt-5">
			{children}
		</h3>
	);

	const inputClass =
		"px-4 text-black py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-sm w-full";
	const labelClass = "text-sm font-medium text-gray-700";

	return (
		<div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
			<div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
				<header className="mb-6">
					<h1 className="text-3xl font-extrabold text-green-600">
						Đăng Ký Đối Tác GrabFood
					</h1>
					<p className="text-gray-500 mt-1">
						Vui lòng điền đầy đủ và chính xác thông tin để quá trình xét duyệt
						diễn ra nhanh chóng.
					</p>
				</header>

				{renderStatusMessage()}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* 1. Thông tin cửa hàng */}
					<section>
						<SectionTitle>1. Thông tin Cửa hàng</SectionTitle>
						<div className="grid sm:grid-cols-2 gap-4">
							{[
								{
									label: "Tên cửa hàng",
									name: "name",
									placeholder: "Ví dụ: Cơm Tấm A.Tèo",
									required: true,
								},
								{
									label: "Tên người đại diện",
									name: "representativeName",
									placeholder: "Tên người liên hệ chính",
								},
								{
									label: "Email Merchant",
									name: "merchantEmail",
									placeholder: "email@cuahang.com",
									type: "email",
								},
								{
									label: "Số điện thoại",
									name: "merchantPhoneNumber",
									placeholder: "09xxxxxxx",
									type: "tel",
								},
								{
									label: "Địa chỉ cửa hàng",
									name: "restaurantAddress",
									placeholder: "Địa chỉ kinh doanh thực tế",
									required: true,
								},
								{
									label: "Mô hình kinh doanh",
									name: "businessModel",
									placeholder: "Ví dụ: Nhà hàng truyền thống, Bếp Cloud",
								},
								{
									label: "Số lượng đơn hàng trung bình / ngày",
									name: "dailyOrderVolume",
									placeholder: "Số lượng đơn hàng",
									type: "number",
								},
							].map((field) => (
								<div key={field.name} className="flex flex-col space-y-1">
									<label htmlFor={field.name} className={labelClass}>
										{field.label}{" "}
										{field.required && <span className="text-red-500">*</span>}
									</label>
									<input
										id={field.name}
										name={field.name}
										type={field.type || "text"}
										placeholder={field.placeholder}
										value={form[field.name]}
										onChange={handleChange}
										required={field.required || false}
										className={inputClass}
									/>
								</div>
							))}
						</div>
					</section>

					{/* 2. Thông tin đăng ký pháp lý */}
					<section>
						<SectionTitle>2. Thông tin Đăng ký Pháp lý</SectionTitle>
						<div className="grid sm:grid-cols-2 gap-4">
							{[
								{
									label: "Hình thức đăng ký",
									name: "registrationType",
									placeholder: "Ví dụ: Hộ kinh doanh cá thể, Công ty TNHH",
								},
								{
									label: "Tên đăng ký kinh doanh đầy đủ",
									name: "legalBusinessName",
									placeholder: "Tên chính thức trên giấy phép",
								},
								{
									label: "Mã số doanh nghiệp/Mã số thuế",
									name: "businessRegistrationCode",
									placeholder: "Mã số thuế / Mã số doanh nghiệp",
								},
								{
									label: "Ngày đăng ký kinh doanh",
									name: "registrationDate",
									type: "date",
								},
								{
									label: "Ngành nghề kinh doanh",
									name: "businessIndustry",
									placeholder: "Ví dụ: Ăn uống, Giải khát",
								},
							].map((field) => (
								<div key={field.name} className="flex flex-col space-y-1">
									<label htmlFor={field.name} className={labelClass}>
										{field.label}
									</label>
									<input
										id={field.name}
										name={field.name}
										type={field.type || "text"}
										placeholder={field.placeholder}
										value={form[field.name]}
										onChange={handleChange}
										className={inputClass}
									/>
								</div>
							))}
						</div>

						<SubTitle>Tải lên Hình ảnh minh chứng</SubTitle>
						<div className="grid md:grid-cols-2 gap-3">
							{[
								{
									label: "Ảnh căn cước công dân/CMND (IDENTITY)",
									type: "IDENTITY",
								},
								{
									label: "Ảnh giấy phép kinh doanh (BUSINESS)",
									type: "BUSINESS",
								},
								{
									label: "Ảnh khu vực bếp / chế biến (KITCHEN)",
									type: "KITCHEN",
								},
								{
									label: "Ảnh mặt bằng / xung quanh nhà hàng (OTHERS)",
									type: "OTHERS",
								},
							].map((file) => (
								<div
									key={file.type}
									className="flex flex-col space-y-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
									<label className="text-sm font-medium text-gray-700 mb-1 block">
										{file.label}
									</label>
									<input
										type="file"
										multiple
										onChange={(e) => handleFileChange(e, file.type)}
										className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
									/>
									{images[file.type].length > 0 && (
										<p className="mt-1 text-xs text-green-600">
											Đã chọn: {images[file.type].length} file.
										</p>
									)}
								</div>
							))}
						</div>
					</section>

					{/* 3. Thông tin Ngân hàng */}
					<section>
						<SectionTitle>3. Thông tin Thanh toán (Ngân hàng)</SectionTitle>
						<div className="grid sm:grid-cols-3 gap-4">
							{[
								{
									label: "Tên ngân hàng",
									name: "bankName",
									placeholder: "Ví dụ: Vietcombank, ACB",
								},
								{
									label: "Số tài khoản",
									name: "bankAccountNumber",
									placeholder: "Số tài khoản nhận tiền",
								},
								{
									label: "Tên chủ tài khoản",
									name: "bankAccountHolderName",
									placeholder: "Tên chủ tài khoản (Không dấu)",
								},
							].map((field) => (
								<div key={field.name} className="flex flex-col space-y-1">
									<label htmlFor={field.name} className={labelClass}>
										{field.label}
									</label>
									<input
										id={field.name}
										name={field.name}
										placeholder={field.placeholder}
										value={form[field.name]}
										onChange={handleChange}
										className={inputClass}
									/>
								</div>
							))}
						</div>
					</section>

					{/* 4. Thông tin Chủ sở hữu */}
					<section>
						<SectionTitle>4. Thông tin Chủ sở hữu/Đại diện</SectionTitle>
						<div className="grid sm:grid-cols-3 gap-4">
							{[
								{
									label: "Tên Chủ sở hữu",
									name: "ownerName",
									placeholder: "Tên đầy đủ",
								},
								{ label: "Ngày sinh", name: "ownerDateOfBirth", type: "date" },
								{
									label: "Số CMND/CCCD",
									name: "ownerIdNumber",
									placeholder: "Số CCCD/CMND",
								},
								{ label: "Ngày cấp", name: "ownerIdIssueDate", type: "date" },
								{
									label: "Nơi cấp",
									name: "ownerIdIssuePlace",
									placeholder: "Tỉnh/Thành phố cấp",
								},
								{
									label: "Ngày hết hạn",
									name: "ownerIdExpiryDate",
									type: "date",
								},
							].map((field) => (
								<div key={field.name} className="flex flex-col space-y-1">
									<label htmlFor={field.name} className={labelClass}>
										{field.label}
									</label>
									<input
										id={field.name}
										name={field.name}
										type={field.type || "text"}
										placeholder={field.placeholder}
										value={form[field.name]}
										onChange={handleChange}
										className={inputClass}
									/>
								</div>
							))}
						</div>

						<SubTitle>Địa chỉ</SubTitle>
						<div className="grid sm:grid-cols-2 gap-4">
							{[
								{
									label: "Địa chỉ thường trú (theo CCCD)",
									name: "ownerPermanentAddress",
									placeholder: "Địa chỉ thường trú",
								},
								{
									label: "Địa chỉ hiện tại",
									name: "ownerCurrentAddress",
									placeholder: "Địa chỉ liên hệ hiện tại",
								},
								{
									label: "Quốc gia",
									name: "ownerCountry",
									placeholder: "Ví dụ: Việt Nam",
								},
								{
									label: "Thành phố",
									name: "ownerCity",
									placeholder: "Ví dụ: TP. Hồ Chí Minh",
								},
							].map((field) => (
								<div key={field.name} className="flex flex-col space-y-1">
									<label htmlFor={field.name} className={labelClass}>
										{field.label}
									</label>
									<input
										id={field.name}
										name={field.name}
										placeholder={field.placeholder}
										value={form[field.name]}
										onChange={handleChange}
										className={inputClass}
									/>
								</div>
							))}
						</div>
					</section>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isLoading}
						className={`w-full py-3 mt-6 text-white font-bold text-lg rounded-xl shadow-lg transition duration-300 ease-in-out
              ${
								isLoading
									? "bg-green-400 cursor-not-allowed"
									: "bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-green-500/50 hover:shadow-green-500/70"
							}`}>
						{isLoading ? (
							<span className="flex items-center justify-center">
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Đang gửi hồ sơ...
							</span>
						) : (
							"Hoàn tất và Tạo Merchant"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateMerchantForm;
