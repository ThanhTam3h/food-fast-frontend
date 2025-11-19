export const steps = [
  { label: "Đang chờ xác nhận", status: "PENDING" },
  { label: "Đã xác nhận", status: "CONFIRMED" },
  { label: "Đang chuẩn bị", status: "PREPARING" },
  { label: "Sẵn sàng", status: "READY" },
  { label: "Đang giao hàng", status: "DELIVERING" },
  { label: "Đã giao hàng", status: "DELIVERED" },
];

export const STATUS_MAP = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERING: "DELIVERING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export const getActiveStep = (status) =>
  steps.findIndex((s) => s.status === status);

export const timelineDescriptions = [
  "Đơn hàng đã được tạo thành công. Đang chờ nhà hàng xác nhận",
  "Nhà hàng đã xác nhận đơn. Món ăn đang được chuẩn bị",
  "Đầu bếp đang nấu những món ngon nhất cho bạn",
  "Món ăn đã xong! Hệ thống đang chọn drone phù hợp",
  "Drone đang bay đến địa chỉ của bạn",
  "Giao hàng thành công! Chúc bạn ngon miệng",
];
