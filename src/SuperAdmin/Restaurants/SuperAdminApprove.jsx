import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Typography,
	CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { api } from "../../config/api";

const MOCK_PENDING_REQUESTS = [
	{
		id: 101,
		name: "Quán Ăn Nhanh TPHCM",
		description: "Chuyên đồ ăn nhanh kiểu Mỹ",
		representativeName: "Trần Văn A",
		representativeEmail: "van.a@example.com",
		representativeMobile: "0901234567",
		status: "PENDING", // Bắt buộc phải là PENDING để hiển thị
		createdAt: "2023-11-15T10:00:00.000Z", // Ngày đăng ký
		registrationDate: "2023-11-15",
		owner: {
			fullName: "Trần Văn A", // Dữ liệu owner (dùng cho fallback)
		},
		// Thêm trường address và merchantImages đã được sửa ở các bước trước để mô phỏng đầy đủ dữ liệu
		address: {
			street: "123 Đường Sáng, Phường 1",
			city: "Quận 1, TP.HCM",
			location: {},
		},
		merchantImages: [
			{ url: "https://mock.img/identity1.jpg", type: "IDENTITY" },
			{ url: "https://mock.img/business1.jpg", type: "BUSINESS" },
		],
	},
	{
		id: 102,
		name: "Cơm Gà Hảo Hạng",
		description: "Món Việt truyền thống, giá bình dân",
		representativeName: "Nguyễn Thị B",
		representativeEmail: "thi.b@example.com",
		representativeMobile: "0918765432",
		status: "PENDING", // Bắt buộc phải là PENDING
		createdAt: "2023-11-18T14:30:00.000Z",
		registrationDate: "2023-11-18",
		owner: {
			fullName: "Nguyễn Thị B",
		},
		address: {
			street: "456 Đường Tối, Phường 2",
			city: "Quận 3, TP.HCM",
			location: {},
		},
		merchantImages: [],
	},
	{
		id: 103,
		name: "Tiệm Trà Sữa Mới",
		description: null,
		representativeName: "Lê Văn C",
		representativeEmail: "van.c@example.com",
		representativeMobile: "0987654321",
		status: "PENDING", // Bắt buộc phải là PENDING
		createdAt: "2023-11-19T09:15:00.000Z",
		registrationDate: "2023-11-19",
		owner: null, // Trường hợp không có owner
		address: null, // Trường hợp không có địa chỉ
		merchantImages: [],
	},
];

const SuperAdminApprove = () => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchRequests = async () => {
		try {
			// Lấy danh sách Merchants (BE: GET /merchants)
			const response = await api.get("/merchants");
			const data = response.data.data || response.data;

			// Lọc các yêu cầu đang chờ duyệt (status: PENDING)
			const pendingData = data.filter((item) => item.status === "PENDING"); //

			setRequests(pendingData);
		} catch (error) {
			console.error("Error fetching pending merchants:", error);
			setRequests([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRequests();
	}, []);

	const handleUpdateStatus = async (id, action) => {
		try {
			// action sẽ là 'APPROVE' hoặc 'REJECT'
			const statusMap = {
				APPROVE: "APPROVE", //
				REJECT: "REJECT", //
			};

			// Gọi API PATCH /merchants/approve/:id
			await api.patch(`/merchants/approve/${id}`, {
				status: statusMap[action],
			}); //

			fetchRequests(); // Reload lại danh sách
		} catch (error) {
			console.error("Update failed", error);
		}
	};

	if (loading)
		return (
			<div className="flex justify-center items-center h-[60vh]">
				<CircularProgress sx={{ color: "#f97316" }} />
			</div>
		);

	return (
		<div className="p-6">
			<Typography variant="h4" className="text-gray-800 font-bold mb-6">
				Duyệt Yêu Cầu Đăng Ký Nhà Hàng
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
							<TableCell
								sx={{ color: "#6b7280", fontWeight: "600", width: "180px" }}>
								Nhà Hàng
							</TableCell>
							<TableCell sx={{ color: "#6b7280", fontWeight: "600" }}>
								Người đại diện
							</TableCell>
							<TableCell
								sx={{ color: "#6b7280", fontWeight: "600", width: "150px" }}>
								Ngày đăng ký
							</TableCell>
							<TableCell
								sx={{
									color: "#6b7280",
									fontWeight: "600",
									textAlign: "center",
									width: "220px",
								}}>
								Thao Tác
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{requests.map((req) => (
							<TableRow
								key={req.id}
								hover
								sx={{
									"&:hover": { bgcolor: "#fff7ed" },
									transition: "background-color 0.2s",
								}}>
								<TableCell sx={{ color: "#374151", fontWeight: "bold" }}>
									{req.name}
								</TableCell>
								<TableCell sx={{ color: "#374151" }}>
									{req.representativeName ||
										req.owner?.fullName ||
										"Chưa cập nhật"}
								</TableCell>
								<TableCell sx={{ color: "#6b7280" }}>
									{req.createdAt
										? new Date(req.createdAt).toLocaleDateString()
										: "N/A"}
									{/* Sử dụng createdAt vì registrationDate có thể không tồn tại */}
								</TableCell>
								<TableCell sx={{ textAlign: "center" }}>
									<div className="flex gap-2 justify-center">
										<Button
											variant="contained"
											color="success"
											size="small"
											startIcon={<CheckCircleIcon />}
											onClick={() => handleUpdateStatus(req.id, "APPROVE")}
											sx={{ textTransform: "none" }}>
											Duyệt
										</Button>
										<Button
											variant="contained"
											color="error"
											size="small"
											startIcon={<CancelIcon />}
											onClick={() => handleUpdateStatus(req.id, "REJECT")}
											sx={{ textTransform: "none" }}>
											Từ Chối
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
						{requests.length === 0 && !loading && (
							<TableRow>
								<TableCell
									colSpan={4}
									align="center"
									sx={{ color: "#9ca3af", py: 5 }}>
									Không có yêu cầu đăng ký nào đang chờ duyệt.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default SuperAdminApprove;
