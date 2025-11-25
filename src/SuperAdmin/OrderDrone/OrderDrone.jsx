import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import OrderTrackingMap from "./OrderTrackingMap";

// Thay toàn bộ dòng tạo socket thành:
const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const OrderDrone = () => {
  const [orders, setOrders] = useState([]);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal gán drone
  const [isAssignDroneOpen, setIsAssignDroneOpen] = useState(false);
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [selectedDroneId, setSelectedDroneId] = useState("");
  const [assigningInProgress, setAssigningInProgress] = useState(false);

  // Modal tracking
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, droneRes] = await Promise.all([
          fetch("http://localhost:3000/api/v1/order"),
          fetch("http://localhost:3000/api/v1/order/available-drones"),
        ]);
        const orderJson = await orderRes.json();
        const droneJson = await droneRes.json();
        setOrders(Array.isArray(orderJson) ? orderJson : orderJson?.data || []);
        setDrones(droneJson?.data || []);
      } catch (err) {
        console.error("Lỗi kết nối server:", err);
        alert("Không kết nối được server!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // REALTIME: Cập nhật đơn hàng + TỰ ĐỘNG MỞ MAP KHI GÁN DRONE
    socket.on("order-status-update", (payload) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === payload.orderNumber
            ? {
                ...o,
                status: payload.status || o.status,
                droneId: payload.droneId,
              }
            : o
        )
      );

      // TỰ ĐỘNG MỞ MAP NGAY KHI GÁN DRONE XONG
      if (
        payload.droneId &&
        assigningOrder?.orderNumber === payload.orderNumber
      ) {
        setTimeout(() => {
          const updatedOrder = {
            ...assigningOrder,
            droneId: payload.droneId,
            status: payload.status,
          };
          setTrackingOrder(updatedOrder);
          setIsTrackingOpen(true);
        }, 500);
      }
    });

    socket.on("drone-status", ({ droneId, status }) => {
      setDrones((prev) =>
        prev.map((d) => (d.id === droneId ? { ...d, status } : d))
      );
    });

    return () => {
      socket.off("order-status-update");
      socket.off("drone-status");
    };
  }, [assigningOrder]);

  const handleAssignDrone = async () => {
    if (!assigningOrder || !selectedDroneId) return;
    setAssigningInProgress(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/order/${assigningOrder.orderNumber}/assign-drone`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ droneId: Number(selectedDroneId) }),
        }
      );

      if (res.ok) {
        alert("GÁN DRONE THÀNH CÔNG! Drone đang khởi động...");
        setIsAssignDroneOpen(false);
        setAssigningOrder(null);
        setSelectedDroneId("");
        // Không cần mở map ở đây → socket sẽ tự mở
      } else {
        const err = await res.json();
        alert("Lỗi: " + (err.message || "Không thể gán drone"));
      }
    } catch (err) {
      alert("Lỗi mạng!");
    } finally {
      setAssigningInProgress(false);
    }
  };

  const availableDrones = drones;

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(search) ||
      order.user?.email?.toLowerCase().includes(search);
    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-3xl text-green-600 animate-pulse">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-gray-700">
        Quản Lý Giao Hàng Drone
      </h1>

      <div className="mb-8 flex flex-col md:flex-row gap-6 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
          <input
            type="text"
            placeholder="Tìm mã đơn hoặc email khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-green-200 focus:border-green-500 focus:outline-none text-lg"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-8 py-4 rounded-2xl border-2 border-green-200 focus:border-green-500 focus:outline-none text-lg font-medium"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="DELIVERING">Đang giao</option>
          <option value="DELIVERED">Đã giao</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-600 to-green-600 text-white">
            <tr>
              <th className="px-8 py-6 text-left text-lg">Mã đơn</th>
              <th className="px-8 py-6 text-left text-lg">Khách hàng</th>
              <th className="px-8 py-6 text-left text-lg">Tổng tiền</th>
              <th className="px-8 py-6 text-left text-lg">Trạng thái</th>
              <th className="px-8 py-6 text-left text-lg">Drone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-20 text-gray-500 text-2xl"
                >
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-green-50 transition">
                  <td className="px-8 py-6 font-bold text-xl text-green-700">
                    {order.orderNumber}
                  </td>
                  <td className="px-8 py-6 text-lg">
                    {order.user?.email || "Khách lẻ"}
                  </td>
                  <td className="px-8 py-6 font-bold text-lg">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-5 py-2 rounded-full text-sm font-bold
                      ${
                        order.status === "PENDING" &&
                        "bg-yellow-100 text-yellow-800"
                      }
                      ${
                        order.status === "CONFIRMED" &&
                        "bg-blue-100 text-blue-800"
                      }
                      ${
                        order.status === "DELIVERING" &&
                        "bg-green-100 text-green-800"
                      }
                      ${
                        order.status === "DELIVERED" &&
                        "bg-green-100 text-green-800"
                      }
                    `}
                    >
                      {order.status === "PENDING" && "Chờ xác nhận"}
                      {order.status === "CONFIRMED" && "Đã xác nhận"}
                      {order.status === "DELIVERING" && "Đang giao"}
                      {order.status === "DELIVERED" && "Đã giao"}
                    </span>
                  </td>
                  {/* <td className="px-10 py-6 text-center">
                    {order.droneId ? (
                      <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-3 text-green-600 font-bold text-lg">
                          Drone #{order.droneId}
                        </div>
                        <button
                          onClick={() => {
                            setTrackingOrder(order);
                            setIsTrackingOpen(true);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition"
                        >
                          XEM LIVE
                        </button>
                      </div>
                    ) : order.status === "CONFIRMED" ? (
                      <button
                        onClick={() => {
                          setAssigningOrder(order);
                          setIsAssignDroneOpen(true);
                          setSelectedDroneId("");
                        }}
                        className="px-12 py-5 bg-gradient-to-r from-green-600 to-green-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:scale-105 transition"
                      >
                        GÁN DRONE
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">
                        {order.status === "PENDING"
                          ? "Chờ xác nhận đơn"
                          : "Không thể gán"}
                      </span>
                    )}
                  </td> */}
                  <td className="px-10 py-6 text-center">
                    {order.droneId || order.status === "DELIVERED" ? (
                      <div className="flex items-center justify-center gap-6">
                        {order.droneId && (
                          <div className="flex items-center gap-3 text-green-600 font-bold text-lg">
                            Drone #{order.droneId}
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setTrackingOrder(order);
                            setIsTrackingOpen(true);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition"
                        >
                          XEM LIVE
                        </button>
                      </div>
                    ) : order.status === "CONFIRMED" ? (
                      <button
                        onClick={() => {
                          setAssigningOrder(order);
                          setIsAssignDroneOpen(true);
                          setSelectedDroneId("");
                        }}
                        className="px-12 py-5 bg-gradient-to-r from-green-600 to-green-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:scale-105 transition"
                      >
                        GÁN DRONE
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">
                        {order.status === "PENDING"
                          ? "Chờ xác nhận đơn"
                          : "Không thể gán"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Gán Drone */}
      {isAssignDroneOpen && assigningOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-green-700">
                GÁN DRONE CHO ĐƠN HÀNG
              </h2>
              <button onClick={() => setIsAssignDroneOpen(false)}>
                <X className="w-10 h-10 text-gray-600 hover:text-gray-800" />
              </button>
            </div>
            <div className="text-center mb-10">
              <p className="text-2xl text-gray-700">Mã đơn hàng:</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {assigningOrder.orderNumber}
              </p>
            </div>
            <div className="mb-8">
              <label className="block text-xl font-semibold text-gray-700 mb-4">
                Chọn Drone sẵn sàng:
              </label>
              <select
                value={selectedDroneId}
                onChange={(e) => setSelectedDroneId(e.target.value)}
                className="w-full px-6 py-5 border-2 border-green-300 rounded-2xl text-xl focus:ring-4 focus:ring-green-300 focus:outline-none"
              >
                <option value="">-- Chọn một drone --</option>
                {availableDrones.map((drone) => (
                  <option key={drone.id} value={drone.id}>
                    Drone #{drone.id} - Pin: {drone.battery}% -{" "}
                    {drone.serialNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center gap-8 mt-10">
              <button
                onClick={() => setIsAssignDroneOpen(false)}
                className="px-12 py-5 border-2 border-gray-400 rounded-2xl text-xl font-bold hover:bg-gray-100"
              >
                HỦY
              </button>
              <button
                onClick={handleAssignDrone}
                disabled={!selectedDroneId || assigningInProgress}
                className="px-14 py-5 bg-gradient-to-r from-green-600 to-green-600 text-white rounded-2xl text-xl font-bold hover:from-green-700 hover:to-green-700 disabled:opacity-50 shadow-lg transition transform hover:scale-105 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {assigningInProgress ? "Đang gán..." : "GÁN NGAY"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tracking */}
      {isTrackingOpen && trackingOrder && (
        <OrderTrackingMap
          order={trackingOrder}
          drone={drones.find((d) => d.id === trackingOrder.droneId)}
          onClose={() => {
            setIsTrackingOpen(false);
            setTrackingOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderDrone;
