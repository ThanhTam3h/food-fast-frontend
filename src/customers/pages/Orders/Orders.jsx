// src/pages/customer/Orders.jsx hoặc đường dẫn của bạn
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Thêm cái này
import { getUsersOrders } from "../../../State/Customers/Orders/Action";
import OrderCard from "../../components/Order/OrderCard";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Để chuyển trang
  const { jwt } = useSelector((state) => state?.auth);
  const order = useSelector((state) => state?.order);

  useEffect(() => {
    if (jwt) {
      dispatch(getUsersOrders(jwt));
    }
  }, [dispatch]);

  const currentOrders = Array.isArray(order?.currentOrder)
    ? order.currentOrder
    : order?.currentOrder
    ? [order.currentOrder] // convert object thành mảng
    : []; // fallback mảng rỗng

  const handleViewDetails = (order) => {
    const orderNumber = order?.orderNumber || order?.id;
    navigate(`/tracking/${orderNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Đơn hàng của tôi
        </h1>

        <div className="space-y-6">
          {currentOrders?.map((o) => (
            <OrderCard
              key={o?.id || o?.orderNumber}
              order={o}
              onViewDetails={handleViewDetails} // Truyền hàm xuống
            />
          ))}
        </div>

        {currentOrders?.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
