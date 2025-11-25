import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateOrderStatus } from "../../../State/Admin/Order/restaurants.order.action";
import { getOrderByNumber } from "../../../State/Customers/Orders/Action";

import useOrderSocket from "../../../hooks/useOrderSocket";
import ConfirmationAlert from "../../components/TrackingOrder/ConfirmationAlert";
import MapSimulation from "../../components/TrackingOrder/MapSimulation";
import StatusStepper from "../../components/TrackingOrder/StatusStepper";
import Timeline from "../../components/TrackingOrder/Timeline";
import { getActiveStep, STATUS_MAP } from "../../util/statusConfig";

export default function TrackingOrder() {
  const { orderNumber } = useParams();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const {
    currentOrder: order,
    loading,
    error,
  } = useSelector((state) => state.order);

  // ===============================
  // Hooks phải luôn ở đầu component
  // ===============================
  const [currentStatus, setCurrentStatus] = useState(null);
  const [sim, setSim] = useState({
    timeRemaining: 20,
    distance: 10,
    dronePosition: { top: 20, left: 20 },
  });
  const [ui, setUi] = useState({
    hasArrived: false,
    isArrivingSoon: false,
    confirming: false,
    confirmError: "",
    canConfirm: false,
  });

  const style = useMemo(
    () => `
    @keyframes pulse-red { 0%,100%{box-shadow:0 0 0 0 rgba(244,67,54,.7)} 70%{box-shadow:0 0 0 10px rgba(244,67,54,0)} }
    .animate-pulse-red{animation:pulse-red 1.5s infinite}
    @keyframes pulse-green{0%,100%{box-shadow:0 0 0 0 rgba(0,177,79,.6)}70%{box-shadow:0 0 0 12px rgba(0,177,79,0)}}
    .animate-pulse-green{animation:pulse-green 1.8s infinite}
  `,
    []
  );

  const confirm = useCallback(
    async (auto = false) => {
      if (
        !auto &&
        (!ui.canConfirm || getActiveStep(currentStatus ?? order?.status) !== 4)
      )
        return;
      setUi((prev) => ({ ...prev, confirming: true, confirmError: "" }));
      try {
        await new Promise((r) => setTimeout(r, 1000));
        setUi((prev) => ({
          ...prev,
          confirming: false,
          hasArrived: true,
          isArrivingSoon: false,
        }));
      } catch {
        setUi((prev) => ({
          ...prev,
          confirming: false,
          confirmError: "Lỗi xác nhận",
        }));
      }
    },
    [ui.canConfirm, currentStatus, order?.status]
  );

  // Lắng nghe socket
  useOrderSocket(orderNumber, (payload) => {
    if (payload.orderNumber === orderNumber) {
      setCurrentStatus(payload.status);
    }
  });

  // Fetch order
  useEffect(() => {
    if (orderNumber) dispatch(getOrderByNumber(orderNumber, auth?.jwt));
  }, [dispatch, orderNumber, auth?.jwt]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-[#00b14f] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center text-red-600 font-bold bg-white min-h-screen">
        {error || "Không tìm thấy đơn hàng"}
      </div>
    );
  }

  const processedOrder = {
    ...order,
    status: STATUS_MAP[order.status] || "PENDING",
    address: order.address,
    droneId: order.droneId || `DRONE-${Math.floor(Math.random() * 999)}`,
    estimatedDelivery: "20-30 phút",
  };

  const active = getActiveStep(currentStatus ?? processedOrder.status);
  const flash = ui.isArrivingSoon && active === 4;
  const card = flash
    ? "border-red-500 shadow-2xl shadow-red-200"
    : "border-gray-100 shadow-lg";

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto min-h-screen bg-white font-sans mt-8">
      <style>{style}</style>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00b14f] mt-8 mb-2">
        Theo dõi đơn hàng #{processedOrder.orderNumber}
      </h1>
      <div className={`bg-white p-6 rounded-xl border transition-all ${card}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-700">Trạng Thái</h2>
          {flash && (
            <div className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full shadow-lg animate-pulse-red flex items-center space-x-1">
              <span>Sắp tới!</span>
            </div>
          )}
        </div>

        <StatusStepper orderStatus={currentStatus ?? processedOrder.status} />
        <Timeline order={processedOrder} />

        <div className="mt-4 p-4 bg-green-50 border-l-4 border-[#00b14f] rounded-r-md">
          <p className="flex items-center text-sm text-gray-700">
            Địa chỉ:{" "}
            <span className="font-bold ml-1">
              {processedOrder.address.street}
            </span>
          </p>
          <p className="flex items-center text-sm text-gray-700 mt-1">
            Drone:{" "}
            <span className="font-bold ml-1">{processedOrder.droneId}</span>
          </p>
        </div>

        {order.orderItems?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-gray-700 text-lg mb-3">
              Chi tiết đơn hàng
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  {item.product.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {item.product.name} x{item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.product.basePrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.product.basePrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-medium text-gray-800">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.subTotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí giao hàng</span>
                <span className="font-medium text-gray-800">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-green-300">
                <span className="text-[#00b14f]">Tổng cộng</span>
                <span className="text-[#00b14f]">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.total)}
                </span>
              </div>
            </div>
          </div>
        )}

        {active >= 2 && (
          <>
            <MapSimulation
              order={processedOrder}
              arrived={ui.hasArrived}
              soon={ui.isArrivingSoon}
              onDelivered={async () => {
                await dispatch(
                  updateOrderStatus({
                    orderNumber: processedOrder.orderNumber,
                    orderStatus: "DELIVERED",
                    jwt: auth.jwt,
                  })
                );
                setUi((prev) => ({
                  ...prev,
                  hasArrived: true,
                  confirming: false,
                  isArrivingSoon: false,
                  confirmError: "",
                }));
              }}
            />

            <ConfirmationAlert
              ui={{
                ...ui,
                orderStatus: currentStatus ?? processedOrder.status,
              }}
              confirm={confirm}
            />
          </>
        )}
      </div>
    </div>
  );
}
