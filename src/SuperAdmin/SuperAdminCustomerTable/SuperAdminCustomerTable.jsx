import React, { useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	CircularProgress,
	Backdrop,
	Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getCustomers } from "../../State/SuperAdmin/superAdmin.action";

const SuperAdminCustomerTable = () => {
	const dispatch = useDispatch();
	const { superAdmin } = useSelector((store) => store);

	useEffect(() => {
		dispatch(getCustomers());
	}, [dispatch]);

	// Hàm helper lấy màu role
	const getRoleLabel = (roleName) => {
		const normalizedRole = roleName ? roleName.toUpperCase() : "UNKNOWN";
		switch (normalizedRole) {
			case "CUSTOMER":
				return { label: "CUSTOMER", color: "#166534", bgcolor: "#dcfce7" };
			case "MERCHANT":
				return { label: "MERCHANT", color: "#1e40af", bgcolor: "#dbeafe" };
			case "ADMIN":
				return { label: "ADMIN", color: "#7c3aed", bgcolor: "#ede9fe" };
			default:
				return { label: normalizedRole, color: "#374151", bgcolor: "#f3f4f6" };
		}
	};

	// Loading State
	if (superAdmin.loading) {
		return (
			<Backdrop
				open={true}
				sx={{ color: "#f97316", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<CircularProgress color="inherit" />
			</Backdrop>
		);
	}

	return (
		<div className="p-6">
			<Typography variant="h4" className="text-gray-800 font-bold mb-6">
				Danh Sách Khách Hàng
			</Typography>

			<TableContainer
				component={Paper}
				sx={{
					bgcolor: "white",
					boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
					borderRadius: "12px",
					overflow: "hidden",
				}}>
				<Table>
					<TableHead sx={{ bgcolor: "#f9fafb" }}>
						<TableRow>
							{/* Cột 1: Số thứ tự */}
							<TableCell
								sx={{
									color: "#6b7280",
									fontWeight: "600",
									width: "60px",
								}}></TableCell>

							{/* Cột 2: Tên (Sửa từ Thông tin khách hàng) */}
							<TableCell sx={{ color: "#6b7280", fontWeight: "600" }}>
								Tên
							</TableCell>

							{/* Cột 3: Email (Giữ nguyên) */}
							<TableCell sx={{ color: "#6b7280", fontWeight: "600" }}>
								Email
							</TableCell>
							<TableCell sx={{ color: "#6b7280", fontWeight: "600" }}>
								SĐT
							</TableCell>

							{/* Cột 4: Vai trò (Giữ lại để đủ thông tin) */}
							<TableCell sx={{ color: "#6b7280", fontWeight: "600" }}>
								Trạng Thái
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{superAdmin.customers.map((row, index) => {
							// Lấy role name từ mảng roles (xử lý trường hợp mảng rỗng)
							const roleName =
								row.roles && row.roles.length > 0
									? row.roles[0].name
									: "Unknown";

							return (
								<TableRow
									key={row.id}
									hover
									sx={{
										"&:last-child td, &:last-child th": { border: 0 },
										"&:hover": { bgcolor: "#fff7ed" },
										transition: "background-color 0.2s",
									}}>
									{/* Cột 1: STT (Index + 1) */}
									<TableCell sx={{ color: "#374151", fontWeight: "500" }}>
										{index + 1}
									</TableCell>

									{/* Cột 2: Tên (Sử dụng username từ Model, fallback nếu null) */}
									<TableCell>
										<Typography
											variant="body2"
											sx={{ fontWeight: 600, color: "#111827" }}>
											{row.username || "Chưa cập nhật tên"}
										</Typography>
									</TableCell>

									{/* Cột 3: Email */}
									<TableCell sx={{ color: "#4b5563" }}>{row.email}</TableCell>

									<TableCell sx={{ color: "#4b5563" }}>
										{row.phone || "N/A"}
									</TableCell>

									{/* Cột 4: Role Chip */}
									<TableCell>
										<Chip
											label={row.isActive ? "Hoạt động" : "Bị khóa"}
											size="small"
											sx={{
												fontWeight: "bold",
												fontSize: "0.7rem",
												bgcolor: row.isActive ? "#dcfce7" : "#fee2e2", // Xanh nếu active, Đỏ nếu khóa
												color: row.isActive ? "#166534" : "#991b1b",
											}}
										/>
									</TableCell>
								</TableRow>
							);
						})}

						{(!superAdmin.customers || superAdmin.customers.length === 0) && (
							<TableRow>
								<TableCell
									colSpan={4}
									align="center"
									sx={{ py: 5, color: "#9ca3af" }}>
									Không tìm thấy khách hàng nào.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default SuperAdminCustomerTable;
