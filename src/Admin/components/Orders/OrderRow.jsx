import { Bell, CheckCircle, Loader, Truck, XCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const statusConfig = {
  PENDING: {
    text: "ĐƠN MỚI",
    color: "bg-orange-100 text-orange-600",
    icon: Bell,
  },
  CONFIRMED: {
    text: "ĐÃ XÁC NHẬN",
    color: "bg-yellow-100 text-yellow-600",
    icon: Loader,
  },
  PREPARING: {
    text: "ĐANG CHUẨN BỊ",
    color: "bg-yellow-100 text-yellow-600",
    icon: Loader,
  },
  READY: { text: "SẴN SÀNG", color: "bg-blue-100 text-blue-600", icon: Truck },
  DELIVERING: {
    text: "ĐANG GIAO HÀNG",
    color: "bg-green-100 text-green-600",
    icon: CheckCircle,
  },
  DELIVERED: {
    text: "ĐÃ GIAO HÀNG",
    color: "bg-green-100 text-green-600",
    icon: CheckCircle,
  },
  CANCELLED: {
    text: "ĐÃ HỦY",
    color: "bg-red-100 text-red-600",
    icon: XCircle,
  },
};

export const OrderRow = ({ order, onViewDetail }) => {
  const config = statusConfig[order.status] || statusConfig.CANCELLED;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center p-4 border-b transition-colors cursor-pointer ${
        order.status === "NEW"
          ? "bg-orange-50 hover:bg-orange-100/70 shadow-lg"
          : "hover:bg-gray-50"
      }`}
      onClick={() => onViewDetail(order)}
    >
      <div className="w-40 min-w-[100px] text-sm">
        <p className="font-semibold text-gray-800">{order.id}</p>
        <p className="text-xs text-gray-500">{order.time}</p>
      </div>
      <div className="w-32 text-center text-sm">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center ${config.color}`}
        >
          <Icon className="w-3 h-3 mr-1 hidden sm:inline" />
          {config.text}
        </span>
      </div>
      <div className="flex-1 min-w-0 px-4 hidden md:block">
        <p className="text-sm font-medium text-gray-800 truncate">
          {order.customer}
        </p>
        <p
          className={`text-xs font-semibold ${
            order.type === "COD" ? "text-red-500" : "text-green-500"
          }`}
        >
          {order.type}
        </p>
      </div>
      <div className="w-32 text-right">
        <p className="font-bold text-orange-600 text-lg">
          {formatCurrency(order.total)}
        </p>
      </div>
    </div>
  );
};
