import {
  CheckCircle,
  Clock,
  MapPin,
  Menu,
  Store,
  X,
  XCircle,
} from "lucide-react";

export const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const statusClasses = {
    PENDING: {
      color: "text-yellow-600",
      icon: Clock,
      bg: "bg-yellow-100",
      label: "Đang chờ xác nhận",
    },
    DELIVERED: {
      color: "text-green-600",
      icon: CheckCircle,
      bg: "bg-green-100",
      label: "Đã giao thành công",
    },
    CANCELLED: {
      color: "text-red-600",
      icon: XCircle,
      bg: "bg-red-100",
      label: "Đã hủy",
    },
  };

  const statusInfo = statusClasses[order.status] || statusClasses.PENDING;
  const StatusIcon = statusInfo.icon;

  const formatCurrency = (value) => {
    if (isNaN(value)) return "0₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    const d =
      typeof ts === "string"
        ? new Date(ts)
        : ts.toDate
        ? ts.toDate()
        : new Date(ts);
    return d.toLocaleString("vi-VN");
  };

  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const deliveryFee = 20000;
  const discount = order.status === "CANCELLED" ? 0 : 15000;
  const finalTotal = subtotal + deliveryFee - discount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Chi Tiết Đơn Hàng
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Mã đơn:</span>
              <span className="text-sm font-bold text-gray-900">
                {String(order.id).substring(0, 12).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Thời gian đặt:
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatDate(order.orderDate)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-green-200">
              <div className="flex items-center text-sm font-medium text-gray-600 space-x-2">
                <StatusIcon className="w-4 h-4" />
                <span>Trạng thái:</span>
              </div>
              <span className={`text-sm font-extrabold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Store className="text-green-600 flex-shrink-0 w-6 h-6" />
              <h3 className="text-lg font-bold text-gray-900">
                {order.restaurantName}
              </h3>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <MapPin className="text-pink-600 w-4 h-4" />
              <p>{order.deliveryAddress}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Menu className="text-orange-500 w-5 h-5" />
              <span>Các Món Đã Đặt</span>
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl p-4">
              {(order.items || []).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex space-x-2 text-gray-700">
                    <span className="font-semibold">{item.quantity}x</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatCurrency((item.price || 0) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-lg font-bold text-gray-900">Thanh Toán</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Tiền món ăn (Subtotal):</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Phí giao hàng:</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-bold">
                <span>Giảm giá (Voucher):</span>
                <span>- {formatCurrency(discount)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-dashed border-gray-300 text-xl font-extrabold text-gray-900">
                <span>Tổng Thanh Toán:</span>
                <span className="text-green-600">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-md"
          >
            OK, Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
