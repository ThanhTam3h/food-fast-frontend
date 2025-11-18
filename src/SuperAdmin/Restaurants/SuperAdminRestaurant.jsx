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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { api } from "../../config/api";
import SuperAdminRestaurantDetails from "./SuperAdminRestaurantDetails";

const SuperAdminRestaurant = () => {
	const [merchants, setMerchants] = useState([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [selectedMerchant, setSelectedMerchant] = useState(null);

	useEffect(() => {
		const fetchMerchants = async () => {
			try {
				const response = await api.get("/merchants");
				const data = response.data.data || response.data;
				if (Array.isArray(data)) {
					setMerchants(data);
				} else {
					setMerchants([]);
				}
			} catch (error) {
				console.error("Failed to fetch merchants", error);
			} finally {
				setLoading(false);
			}
		};
		fetchMerchants();
	}, []);

	const handleOpen = (merchant) => {
		setSelectedMerchant(merchant);
		setOpen(true);
	};
	const handleClose = () => setOpen(false);

	if (loading)
		return (
			<div className="flex justify-center items-center h-[60vh]">
				<CircularProgress sx={{ color: "#f97316" }} />
			</div>
		);

	return (
		<div className="p-6">
			<Typography variant="h4" className="text-gray-800 font-bold mb-6">
				Quản Lý Nhà Hàng
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
							{/* Cột 1: STT */}
							<TableCell
								sx={{ color: "#6b7280", fontWeight: "600", width: "60px" }}>
								STT
							</TableCell>

							{/* Cột 2: Tên Nhà Hàng */}
							<TableCell sx={{ color: "#6b7280", fontWeight: "600" }}>
								Tên Nhà Hàng
							</TableCell>

							{/* Cột 3: Người Đại Diện */}
							<TableCell sx={{ color: "#6b7280", fontWeight: "600" }}>
								Người Đại Diện
							</TableCell>

							{/* Cột 5: Hành Động */}
							<TableCell
								sx={{
									color: "#6b7280",
									fontWeight: "600",
									textAlign: "center",
								}}>
								Hành Động
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{merchants.map((row, index) => {
							return (
								<TableRow
									key={row.id}
									hover
									sx={{
										"&:hover": { bgcolor: "#fff7ed" },
										transition: "background-color 0.2s",
									}}>
									{/* Cột STT */}
									<TableCell sx={{ color: "#374151", fontWeight: "500" }}>
										{index + 1}
									</TableCell>

									{/* Cột Tên Nhà Hàng */}
									<TableCell>
										<Typography sx={{ fontWeight: "bold", color: "#1f2937" }}>
											{row.name}
										</Typography>
									</TableCell>

									{/* Cột Người Đại Diện (Logic fallback tên) */}
									<TableCell>
										<Typography
											variant="body2"
											sx={{ color: "#374151", fontWeight: 500 }}>
											{row.representativeName || "Chưa cập nhật"}
										</Typography>
									</TableCell>

									{/* Cột Hành Động - Chỉ còn nút Chi tiết */}
									<TableCell align="center">
										<Button
											variant="contained"
											size="small"
											onClick={() => handleOpen(row)}
											startIcon={<RemoveRedEyeIcon />}
											sx={{
												bgcolor: "#f97316",
												textTransform: "none",
												boxShadow: "none",
												"&:hover": {
													bgcolor: "#ea580c",
													boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
												},
											}}>
											Chi tiết
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
						{!loading && merchants.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={5}
									align="center"
									sx={{ py: 5, color: "#9ca3af" }}>
									Chưa có nhà hàng nào trong hệ thống.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Modal Chi Tiết */}
			<SuperAdminRestaurantDetails
				open={open}
				handleClose={handleClose}
				merchant={selectedMerchant}
			/>
		</div>
	);
};

export default SuperAdminRestaurant;
