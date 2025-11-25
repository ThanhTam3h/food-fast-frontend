import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { api } from "../../config/api";

// Component Card hiển thị chỉ số (tách ra để dễ style)
const StatCard = ({ title, value, icon, color, bgColor }) => (
  <Card
    sx={{
      backgroundColor: "white",
      color: "#1f2937", // Gray-800
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", // Shadow nhẹ
      height: "100%",
    }}
  >
    <CardContent className="flex justify-between items-center p-6">
      <div>
        <Typography
          variant="subtitle2"
          className="text-gray-500 font-medium mb-1"
        >
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" className="text-gray-800">
          {value}
        </Typography>
      </div>
      {/* Box bao quanh icon với nền nhạt */}
      <Box
        sx={{
          p: 2,
          borderRadius: "12px",
          backgroundColor: bgColor,
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
    </CardContent>
  </Card>
);

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // API lấy tất cả order
        const { data } = await api.get("/api/admin/orders");
        const totalRevenue = data.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
        setStats({
          revenue: totalRevenue.toLocaleString() + " ₫", // Đổi VND thành ký hiệu ₫ cho gọn
          orders: data.length,
        });
      } catch (error) {
        console.error("Failed fetch stats", error);
        setStats({ revenue: "0 ₫", orders: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress sx={{ color: "#f97316" }} /> {/* Loading màu cam */}
      </div>
    );

  return (
    <div className="p-5">
      <Typography variant="h4" className="pb-5 text-gray-800 font-bold">
        Tổng Quan
      </Typography>
      <Grid container spacing={3}>
        {/* Card Doanh Thu - Màu Cam */}
        <Grid item xs={12} md={6}>
          <StatCard
            title="Tổng Doanh Thu"
            value={stats.revenue}
            icon={<MonetizationOnIcon sx={{ fontSize: 32 }} />}
            color="#f97316" // Orange-500
            bgColor="#fff7ed" // Orange-50
          />
        </Grid>

        {/* Card Đơn Hàng - Màu Xanh */}
        <Grid item xs={12} md={6}>
          <StatCard
            title="Tổng Đơn Hàng"
            value={stats.orders}
            icon={<ShoppingBagIcon sx={{ fontSize: 32 }} />}
            color="#3b82f6" // Blue-500
            bgColor="#eff6ff" // Blue-50
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default SuperAdminDashboard;
