import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PendingIcon from "@mui/icons-material/Pending";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StarIcon from "@mui/icons-material/Star";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { formatCurrency } from "../../util/formartCurrency";

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const OrderCard = ({ order, onViewDetails }) => {
  const statusClasses = {
    PENDING: {
      color: "text-yellow-600",
      icon: PendingIcon,
      bg: "bg-yellow-100",
    },
    CONFIRMED: {
      color: "text-yellow-600",
      icon: PendingIcon,
      bg: "bg-yellow-100",
    },
    PREPARING: {
      color: "text-blue-600",
      icon: AccessTimeIcon,
      bg: "bg-blue-100",
    },
    DELIVERING: {
      color: "text-blue-600",
      icon: AccessTimeIcon,
      bg: "bg-blue-100",
    },
    DELIVERED: {
      color: "text-green-600",
      icon: CheckCircleIcon,
      bg: "bg-green-100",
    },
    CANCELLED: { color: "text-red-600", icon: CancelIcon, bg: "bg-red-100" },
  };

  const statusInfo = statusClasses[order.status] || statusClasses.PENDING;
  const StatusIcon = statusInfo.icon;

  // Tính tổng số lượng item
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6 transition-all duration-300 hover:shadow-xl hover:border-green-200">
      {/* Header: Mã đơn & Trạng thái */}
      <div className="flex justify-between items-center border-b pb-3 mb-3 border-dashed border-gray-200">
        <div className="flex items-center space-x-2">
          <ShoppingBagIcon
            className="text-gray-500"
            sx={{ fontSize: "1.5rem" }}
          />
          <h3 className="text-base font-semibold text-gray-700">
            Đơn hàng:{" "}
            <span className="text-gray-900 font-bold">
              {order.id.substring(0, 8).toUpperCase()}
            </span>
          </h3>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color} ${statusInfo.bg}`}
        >
          <StatusIcon sx={{ fontSize: "1rem" }} />
          <span>
            {order.status === "PENDING"
              ? "Đang chờ"
              : order.status === "PROCESSING"
              ? "Đang xử lý"
              : order.status === "DELIVERED"
              ? "Đã giao"
              : "Đã hủy"}
          </span>
        </div>
      </div>

      {/* Thông tin Nhà hàng và Thời gian */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start space-x-3">
          <StorefrontIcon
            className="text-green-600 flex-shrink-0"
            sx={{ fontSize: "1.5rem" }}
          />
          <div>
            <p className="text-base font-bold text-gray-900">
              {order.restaurantName}
            </p>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <StarIcon
                sx={{ fontSize: "0.9rem", color: "#fbc531", mr: 0.5 }}
              />
              <span>{order.rating}</span>
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <LocationOnIcon
            className="text-pink-600 flex-shrink-0"
            sx={{ fontSize: "1.5rem" }}
          />
          <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
        </div>
      </div>

      {/* Danh sách món ăn */}
      <div className="space-y-2 py-3 border-t border-b border-gray-100">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-sm text-gray-700"
          >
            <span className="truncate pr-2">
              {item.quantity} x {item.name}
            </span>
            <span className="font-medium">{formatCurrency(item.price)}</span>
          </div>
        ))}
      </div>

      {/* Footer: Tổng tiền và Chi tiết */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-base font-extrabold text-gray-900">
          <span>Tổng cộng ({totalItems} món):</span>
          <span className="text-green-600 text-xl">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Đặt lúc: {formatDate(order.orderDate)}
        </div>
        <button
          onClick={() => onViewDetails(order)}
          className="mt-3 w-full border border-green-500 text-green-500 font-semibold py-2 rounded-xl hover:bg-green-50 transition-colors"
        >
          Xem Chi Tiết Đơn Hàng
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
