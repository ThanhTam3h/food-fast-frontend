import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import {
  fetchRestaurantOrderItems,
  fetchRestaurantsOrder,
  updateOrderStatus,
} from "../../State/Admin/Order/restaurants.order.action";

import { OrderDetailModal } from "../components/Orders/OrderDetailModal";
import { OrderRow } from "../components/Orders/OrderRow";
import { OrderTabs } from "../components/Orders/OrderTabs";
import { ToastNotification } from "../components/Orders/ToastNotification";

// Mapping trạng thái backend -> FE
const STATUS_LABEL = {
  PENDING: "Đơn mới",
  CONFIRMED: "Đã xác nhận",
  PREPARING: "Đang chuẩn bị",
  READY: "Sẵn sàng",
  DELIVERING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
};

export const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.restaurantsOrder);
  const jwt = localStorage.getItem("jwt");
  const merchantId = 1; // TODO: lấy từ auth context

  useEffect(() => {
    const socket = io("http://localhost:3000", { transports: ["websocket"] });

    // Join tất cả room merchant muốn theo dõi
    orders.forEach((order) => {
      socket.emit("joinOrder", { orderNumber: order.orderNumber });
    });

    socket.on("orderStatusUpdated", (payload) => {
      // cập nhật Redux state
      dispatch(
        fetchRestaurantsOrder({ merchantId, status: payload.status, jwt })
      );
    });

    return () => socket.disconnect();
  }, [orders]);


  const [activeTab, setActiveTab] = useState("PENDING");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Load orders lần đầu
  useEffect(() => {
    if (jwt && merchantId) {
      dispatch(fetchRestaurantsOrder({ merchantId, status: activeTab, jwt }));
    }
  }, [dispatch, jwt, merchantId, activeTab]);

  // Reload tự động mỗi 15s
  useEffect(() => {
    const interval = setInterval(() => {
      if (jwt && merchantId) {
        dispatch(fetchRestaurantsOrder({ merchantId, status: activeTab, jwt }));
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [dispatch, jwt, merchantId, activeTab]);

  // Toast đơn mới
  useEffect(() => {
    const pendingCount = orders.filter((o) => o.status === "PENDING").length;
    if (pendingCount > 0) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 6000);
    }
  }, [orders]);

  // Fetch chi tiết đơn hàng khi click xem
  const handleViewOrderDetail = async (order) => {
    try {
      setLoadingOrderDetail(true);

      // Fetch chi tiết đầy đủ từ API
      const response = await dispatch(
        fetchRestaurantOrderItems({ orderNumber: order.orderNumber, jwt })
      );

      // Lấy đơn hàng từ response (API trả về array, lấy phần tử đầu)
      const detailedOrder =
        response.payload?.data?.[0] || response.payload?.data;

      if (detailedOrder) {
        setSelectedOrder(detailedOrder);
      } else {
        // Fallback: nếu API không return chi tiết, dùng order từ list (có thể bị thiếu orderItems)
        setSelectedOrder(order);
      }
    } catch (error) {
      console.error("Lỗi khi fetch chi tiết đơn hàng:", error);
      setSelectedOrder(order); // Fallback
    } finally {
      setLoadingOrderDetail(false);
    }
  };

  // Xử lý action thay đổi trạng thái đơn
  const handleOrderAction = async (orderNumber, newStatus) => {
    if (!jwt) return;
    try {
      await dispatch(
        updateOrderStatus({ orderNumber, orderStatus: newStatus, jwt })
      );
      // Reload lại danh sách sau update
      dispatch(fetchRestaurantsOrder({ merchantId, status: activeTab, jwt }));
      setSelectedOrder(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  // Format data cho table
  const formattedOrders = orders.map((order) => ({
    id: order.orderNumber,
    orderNumber: order.orderNumber,
    status: order.status,
    statusLabel: STATUS_LABEL[order.status] || order.status,
    time: new Date(order.createdAt).toLocaleString(),
    customer: order.user?.email?.split("@")[0] || "Khách lẻ",
    paymentMethod: order.paymentMethod.includes("online") ? "Online" : "COD",
    paymentStatus: order.paymentStatus,
    total: order.total,
    rawOrder: order,
  }));

  const filteredOrders = formattedOrders.filter(
    (order) => activeTab === "ALL" || order.status === activeTab
  );

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý Đơn Hàng</h1>
          <p className="text-gray-600 mt-1">
            Tổng {orders.length} đơn{" "}
            <span className="text-orange-600 font-bold">
              {orders.filter((o) => o.status === "PENDING").length} đơn mới
            </span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <OrderTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orders={formattedOrders}
      />

      {/* Danh sách đơn */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="hidden md:flex p-4 border-b bg-gray-50 text-xs font-semibold uppercase text-gray-500">
          <div className="w-40">Mã ĐH & Thời Gian</div>
          <div className="w-32 text-center">Trạng Thái</div>
          <div className="flex-1 px-4">Khách Hàng & TT</div>
          <div className="w-32 text-right">Tổng Tiền</div>
        </div>
        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-6 text-gray-500 text-lg">Đang tải đơn hàng...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-24 text-center">
            <div className="text-8xl mb-6">🎉</div>
            <p className="text-2xl text-gray-500">
              Không có đơn hàng nào ở trạng thái này
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onViewDetail={() => handleViewOrderDetail(order.rawOrder)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal chi tiết - hiển thị khi loadingOrderDetail hoặc selectedOrder */}
      {(loadingOrderDetail || selectedOrder) && (
        <OrderDetailModal
          order={selectedOrder}
          onAction={handleOrderAction}
          onClose={() => setSelectedOrder(null)}
          isLoading={loadingOrderDetail}
        />
      )}

      {/* Toast đơn mới */}
      {showToast && (
        <ToastNotification
          message={`Có đơn hàng mới! (${
            orders.filter((o) => o.status === "PENDING").length
          } đơn đang chờ xử lý)`}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};
