export const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const statusClasses = {
    PENDING: {
      color: "text-yellow-600",
      icon: PendingIcon,
      bg: "bg-yellow-100",
      label: "Đang chờ xác nhận",
    },
    PROCESSING: {
      color: "text-blue-600",
      icon: AccessTimeIcon,
      bg: "bg-blue-100",
      label: "Đang xử lý/chuẩn bị",
    },
    DELIVERED: {
      color: "text-green-600",
      icon: CheckCircleIcon,
      bg: "bg-green-100",
      label: "Đã giao thành công",
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

  // Tính tổng tiền món ăn (Subtotal)
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // Giả lập phí giao hàng và giảm giá
  const deliveryFee = 20000;
  const discount = order.status === "CANCELLED" ? 0 : 15000;
  const finalTotal = subtotal + deliveryFee - discount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        {/* Header Modal */}
        <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Chi Tiết Đơn Hàng
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <CloseIcon sx={{ color: "#4b5563" }} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Thông tin Tổng quan */}
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Mã đơn:</span>
              <span className="text-sm font-bold text-gray-900">
                {order.id.substring(0, 12).toUpperCase()}
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
                <StatusIcon sx={{ fontSize: "1rem" }} />
                <span>Trạng thái:</span>
              </div>
              <span className={`text-sm font-extrabold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Nhà hàng */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <StorefrontIcon
                className="text-green-600 flex-shrink-0"
                sx={{ fontSize: "1.5rem" }}
              />
              <h3 className="text-lg font-bold text-gray-900">
                {order.restaurantName}
              </h3>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <LocationOnIcon
                className="text-pink-600"
                sx={{ fontSize: "1rem" }}
              />
              <p>{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Danh sách món ăn */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <RestaurantMenuIcon className="text-orange-500" />
              <span>Các Món Đã Đặt</span>
            </h3>
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl p-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <div className="flex space-x-2 text-gray-700">
                    <span className="font-semibold">{item.quantity}x</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chi tiết Thanh toán */}
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

        {/* Footer Modal - Nút Đóng */}
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
