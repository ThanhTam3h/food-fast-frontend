// src/components/Order/OrderCard.jsx
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { MapPin, ShoppingBag, Star, Store } from "lucide-react";

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) => {
  if (isNaN(value)) return "0₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const OrderCard = ({ order, onViewDetails }) => {
  const statusClasses = {
    PENDING: {
      color: "text-yellow-600",
      icon: PendingIcon,
      bg: "bg-yellow-100",
      label: "Chờ xác nhận",
    },
    CONFIRMED: {
      color: "text-blue-600",
      icon: AccessTimeIcon,
      bg: "bg-blue-100",
      label: "Đã xác nhận",
    },
    DELIVERING: {
      color: "text-purple-600",
      icon: AccessTimeIcon,
      bg: "bg-purple-100",
      label: "Đang giao",
    },
    DELIVERED: {
      color: "text-green-600",
      icon: CheckCircleIcon,
      bg: "bg-green-100",
      label: "Đã giao",
    },
    CANCELLED: {
      color: "text-red-600",
      icon: CancelIcon,
      bg: "bg-red-100",
      label: "Đã hủy",
    },
  };

  const statusInfo = statusClasses[order.status] || statusClasses.PENDING;
  const StatusIcon = statusInfo.icon;

  const totalItems = order?.orderItems
    ? order?.orderItems?.reduce((sum, item) => sum + item.quantity, 0)
    : order?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-2xl hover:border-green-300">
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-lg text-gray-800">
              Đơn hàng:{" "}
              <span className="text-green-600">
                {order?.orderNumber?.slice(-10)}
              </span>
            </h3>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg} ${statusInfo.color} font-bold text-sm`}
          >
            <StatusIcon className="w-5 h-5" />
            <span>{statusInfo.label}</span>
          </div>
        </div>

        {/* Nhà hàng */}
        <div className="flex items-center gap-3 mb-4">
          <Store className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-bold text-gray-900">
              {order?.merchant?.name || order?.restaurantName}
            </p>
          </div>
        </div>

        {/* Địa chỉ giao */}
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-6 h-6 text-pink-600 mt-0.5" />
          <p className="text-sm text-gray-600 line-clamp-2">
            {order.address?.street || order.deliveryAddress}
          </p>
        </div>

        {/* Danh sách món */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          {order.orderItems?.slice(0, 2).map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-sm text-gray-700 mb-2 last:mb-0"
            >
              <span>
                {item.quantity}x {item.product?.name || item.name}
              </span>
              <span className="font-medium">
                {formatCurrency(item.product?.basePrice || item.price)}
              </span>
            </div>
          ))}
          {order.orderItems?.length > 2 && (
            <p className="text-sm text-gray-500 text-center">
              ... và {order.orderItems.length - 2} món khác
            </p>
          )}
        </div>

        {/* Tổng tiền + Nút xem chi tiết */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-gray-700">
            Tổng cộng ({totalItems} món)
          </span>
          <span className="text-2xl font-bold text-green-600">
            {formatCurrency(order.total || order.totalAmount)}
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Đặt lúc: {formatDate(order.createdAt || order.orderDate)}
        </div>

        {/* Nút xem chi tiết */}
        <button
          onClick={() => onViewDetails(order)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition transform hover:scale-105 active:scale-95"
        >
          Xem Chi Tiết & Theo Dõi Drone
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
