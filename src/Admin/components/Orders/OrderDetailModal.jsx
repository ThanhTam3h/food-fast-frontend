import { CheckCircle, Package, Trash2, XCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../Common/Button";

export const OrderDetailModal = ({ order, onAction, onClose, isLoading }) => {
  const statusStyle = {
    NEW: "bg-orange-100 text-orange-600",
    PENDING: "bg-orange-100 text-orange-600",
    PREPARING: "bg-yellow-100 text-yellow-600",
    READY: "bg-blue-100 text-blue-600",
    COMPLETED: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-600",
  };

  // Nếu không có order, không render
  if (!order && !isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-gray-700 font-bold">
              Chi Tiết Đơn Hàng
            </h2>
            <button onClick={onClose} className="p-2" disabled={isLoading}>
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          {order && (
            <p className="text-sm text-gray-600 mt-1">
              {order.orderNumber} ·{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  statusStyle[order.status]
                }`}
              >
                {order.status === "NEW"
                  ? "ĐƠN MỚI"
                  : order.status === "PENDING"
                  ? "ĐƠN MỚI"
                  : order.status === "PREPARING"
                  ? "ĐANG LÀM"
                  : order.status === "READY"
                  ? "SẴN SÀNG"
                  : order.status === "COMPLETED"
                  ? "HOÀN TẤT"
                  : order.status === "CANCELLED"
                  ? "ĐÃ HỦY"
                  : order.status}
              </span>
            </p>
          )}
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải chi tiết đơn hàng...</p>
          </div>
        ) : order ? (
          <div className="p-6 space-y-6 text-gray-700">
            {/* Customer Info */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Khách hàng:</span>
                <span className="font-semibold">
                  {order.user?.email?.split("@")[0] || "Khách lẻ"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian:</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Thanh toán:</span>
                <span
                  className={
                    order.paymentMethod?.toLowerCase().includes("cod")
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {order.paymentMethod}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-2">
                Món ăn ({order.orderItems?.length || 0})
              </h3>
              {order.orderItems && order.orderItems.length > 0 ? (
                order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {item.product?.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">
                            {item.quantity}x {item.product?.name}
                          </p>
                          {item.orderItemToppings &&
                            item.orderItemToppings.length > 0 && (
                              <p className="text-xs text-gray-500">
                                Topping:{" "}
                                {item.orderItemToppings
                                  .map(
                                    (t) =>
                                      `${t.topping.name} (${formatCurrency(
                                        t.topping.price
                                      )}) x${t.quantity}`
                                  )
                                  .join(", ")}
                              </p>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold">
                      {formatCurrency(
                        item.quantity * item.product.basePrice +
                          (item.orderItemToppings?.reduce(
                            (sum, t) => sum + t.quantity * t.topping.price,
                            0
                          ) || 0)
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Không có sản phẩm</p>
              )}
            </div>

            {/* SubTotal */}
            <div className="pt-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Tiền món ăn:</span>
                <span className="text-orange-600">
                  {formatCurrency(order.subTotal)}
                </span>
              </div>
            </div>

            {/* shipping */}
            <div className="pt-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Tiền giao hàng:</span>
                <span className="text-orange-600">
                  {formatCurrency(order.deliveryFee)}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex justify-between text-xl font-bold">
                <span>Tổng cộng</span>
                <span className="text-orange-600">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        {order && !isLoading && (
          <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
            {(order.status === "NEW" || order.status === "PENDING") && (
              <>
                <Button
                  onClick={() => onAction(order.orderNumber, "PREPARING")}
                  variant="primary"
                  className="flex"
                >
                  <CheckCircle className="w-5 h-5 mr-2" /> Chấp Nhận
                </Button>
                <Button
                  onClick={() => onAction(order.orderNumber, "CANCELLED")}
                  variant="outline"
                  className="flex"
                >
                  <Trash2 className="w-5 h-5 mr-2" /> Hủy Đơn
                </Button>
              </>
            )}
            {order.status === "PREPARING" && (
              <Button
                onClick={() => onAction(order.orderNumber, "READY")}
                variant="secondary"
                className="flex"
              >
                <Package className="w-5 h-5 mr-2" /> Sẵn Sàng Giao
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
