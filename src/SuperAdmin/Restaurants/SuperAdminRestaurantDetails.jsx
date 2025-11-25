import React from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StoreIcon from "@mui/icons-material/Store";

// Style cho Modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "900px",
  maxHeight: "90vh",
  bgcolor: "white",
  color: "#1f2937",
  boxShadow: 24,
  p: 0,
  overflowY: "auto",
  borderRadius: "12px",
  outline: "none",
};

const SuperAdminRestaurantDetails = ({ open, handleClose, merchant }) => {
  if (!merchant) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <StoreIcon sx={{ color: "#f97316", fontSize: 28 }} />
            <div>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#111827" }}
              >
                {merchant.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Mã ĐKKD: {merchant.businessRegistrationCode || "---"}
              </Typography>
            </div>
          </div>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <Grid container spacing={3}>
            {/* Thông tin cơ bản */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#f97316", mb: 1 }}
              >
                🏢 Thông Tin Kinh Doanh
              </Typography>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tên pháp lý:</span>{" "}
                  <span className="font-medium">
                    {merchant.legalBusinessName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mô hình:</span>{" "}
                  <span className="font-medium">{merchant.businessModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngành nghề:</span>{" "}
                  <span className="font-medium">
                    {merchant.businessIndustry}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày đăng ký:</span>{" "}
                  <span className="font-medium">
                    {merchant.registrationDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Đơn/ngày (dự kiến):</span>{" "}
                  <span className="font-medium">
                    {merchant.dailyOrderVolume}
                  </span>
                </div>
              </div>
            </Grid>

            {/* Thông tin liên hệ & Địa chỉ */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#f97316", mb: 1 }}
              >
                📍 Liên Hệ & Địa Chỉ
              </Typography>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">
                    Địa chỉ nhà hàng:
                  </span>
                  <span className="font-medium block">
                    {merchant.restaurantAddress ||
                      (merchant.address ? `${merchant.address.street}` : "N/A")}
                  </span>
                </div>
                <Divider sx={{ my: 1 }} />
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>{" "}
                  <span className="font-medium">{merchant.merchantEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hotline:</span>{" "}
                  <span className="font-medium">
                    {merchant.merchantPhoneNumber}
                  </span>
                </div>
              </div>
            </Grid>

            {/* Thông tin Ngân hàng */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#f97316", mb: 1 }}
              >
                💳 Tài Khoản Ngân Hàng
              </Typography>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngân hàng:</span>{" "}
                  <span className="font-bold text-blue-800">
                    {merchant.bankName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tài khoản:</span>{" "}
                  <span className="font-bold text-blue-800">
                    {merchant.bankAccountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chủ tài khoản:</span>{" "}
                  <span className="font-medium text-blue-800">
                    {merchant.bankAccountHolderName}
                  </span>
                </div>
              </div>
            </Grid>

            {/* Thông tin Chủ sở hữu */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#f97316", mb: 1 }}
              >
                👤 Chủ Sở Hữu
              </Typography>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Họ tên:</span>{" "}
                  <span className="font-medium">{merchant.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CMND/CCCD:</span>{" "}
                  <span className="font-medium">{merchant.ownerIdNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nơi cấp:</span>{" "}
                  <span className="font-medium">
                    {merchant.ownerIdIssuePlace}
                  </span>
                </div>
              </div>
            </Grid>

            {/* Hình ảnh minh chứng */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#f97316", mb: 2 }}
              >
                📷 Hồ Sơ Hình Ảnh
              </Typography>
              {merchant.merchantImages?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {merchant.merchantImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <img
                          src={img.url || img}
                          alt={`Evidence ${idx}`}
                          className="object-cover w-full h-32 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-500 font-medium">
                        {img.type || "Minh chứng"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-400 text-sm">
                  Không có hình ảnh minh chứng nào.
                </div>
              )}
            </Grid>
          </Grid>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end sticky bottom-0 rounded-b-xl">
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderColor: "#d1d5db",
              color: "#374151",
              "&:hover": { borderColor: "#9ca3af", bgcolor: "#e5e7eb" },
            }}
          >
            Đóng
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default SuperAdminRestaurantDetails;
