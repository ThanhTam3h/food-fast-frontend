// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect } from "react";

// const CheckmarkIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#00b14f"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="w-20 h-20"
//   >
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const navigateToHome = () => navigate("/");

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
//       <div
//         className="
//           w-full max-w-sm
//           bg-white
//           rounded-xl
//           shadow-2xl
//           p-6 sm:p-8
//           flex flex-col items-center
//           transition-all duration-300
//         "
//       >
//         {/* Success Icon Area - Light green border/background for contrast */}
//         <div
//           className="
//             p-4 mb-4
//             rounded-full
//             border-4
//             flex items-center justify-center
//           "
//           style={{
//             borderColor: "#e0f7e0",
//             backgroundColor: "#e0f7e0",
//           }}
//         >
//           <CheckmarkIcon />
//         </div>

//         {/* Title */}
//         <h1
//           className="
//             text-3xl font-extrabold
//             text-gray-900
//             mb-2
//             text-center
//           "
//         >
//           Thanh toán thành công!
//         </h1>

//         {/* Status Message */}
//         <p className="text-gray-600 text-lg text-center mb-6">
//           Đơn hàng của bạn đã được xác nhận và đang được xử lý.
//         </p>

//         {/* Detailed Messages - Subtle background for key info */}
//         <div className="w-full bg-gray-50 rounded-lg p-4 mb-8">
//           <p className="text-gray-700 text-md text-center font-medium">
//             Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
//           </p>
//           <p className="text-gray-500 text-sm text-center mt-1">
//             Chúc bạn có một bữa ăn ngon miệng!
//           </p>
//         </div>

//         {/* Call to Action Button - Grab Green Primary Button */}
//         <button
//           onClick={navigateToHome}
//           className="
//             w-full py-3 px-4
//             text-white
//             font-bold
//             rounded-lg
//             shadow-md
//             transition-colors
//             duration-200
//             hover:shadow-lg
//             focus:outline-none focus:ring-4 focus:ring-opacity-50
//           "
//           style={{
//             backgroundColor: "#00b14f",
//             transition: "all 0.3s",
//             boxShadow: `0 4px 6px -1px rgba(0, 177, 79, 0.1), 0 2px 4px -2px rgba(0, 177, 79, 0.1)`,
//           }}
//         >
//           Trở về trang chủ
//         </button>

//         {/* Optional Secondary Action */}
//         <button
//           onClick={() => console.log("Viewing order history...")}
//           className="mt-4 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
//         >
//           Theo dõi đơn hàng
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const CheckmarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#00b14f"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-20 h-20"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // LẤY orderNumber từ URL: ?orderNumber=ORD123...
  const getOrderNumber = () => {
    const params = new URLSearchParams(location.search);
    return params.get("orderNumber");
  };

  const orderNumber = getOrderNumber();

  // TỰ ĐỘNG CHUYỂN SAU 3 GIÂY
  useEffect(() => {
    if (orderNumber) {
      const timer = setTimeout(() => {
        navigate(`/tracking/${orderNumber}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderNumber, navigate]);

  const navigateToHome = () => navigate("/");
  const navigateToTracking = () => {
    if (orderNumber) {
      navigate(`/tracking/${orderNumber}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col items-center transition-all duration-300">
        {/* Success Icon - Viền xanh lá nhạt */}
        <div
          className="p-4 mb-4 rounded-full border-4 flex items-center justify-center"
          style={{
            borderColor: "#d4edda",
            backgroundColor: "#d4edda",
          }}
        >
          <CheckmarkIcon />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
          Thanh toán thành công!
        </h1>

        {/* Status Message */}
        <p className="text-gray-600 text-lg text-center mb-6">
          Đơn hàng của bạn đã được xác nhận và đang được xử lý.
        </p>

        {/* Order Number - Nổi bật với nền xanh lá nhạt */}
        {orderNumber && (
          <div className="w-full bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-center">
            <p className="text-sm text-green-700 font-medium">
              Mã đơn hàng: <span className="font-bold">{orderNumber}</span>
            </p>
          </div>
        )}

        {/* Auto Redirect Info */}
        {orderNumber && (
          <p className="text-sm text-gray-500 text-center mb-6">
            Đang chuyển đến trang theo dõi trong{" "}
            <strong className="text-[#00b14f]">3 giây</strong>...
          </p>
        )}

        {/* Detailed Messages */}
        <div className="w-full bg-gray-50 rounded-lg p-4 mb-8">
          <p className="text-gray-700 text-md text-center font-medium">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
          </p>
          <p className="text-gray-500 text-sm text-center mt-1">
            Chúc bạn có một bữa ăn ngon miệng!
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-3">
          {/* Nút Theo dõi đơn hàng - XANH LÁ #00b14f */}
          <button
            onClick={navigateToTracking}
            disabled={!orderNumber}
            className={`
              w-full py-3 px-4 text-white font-bold rounded-lg shadow-md transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-green-300
              ${
                orderNumber
                  ? "bg-[#00b14f] hover:bg-[#00943d] hover:shadow-lg"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
            style={{
              backgroundColor: orderNumber ? "#00b14f" : undefined,
            }}
          >
            {orderNumber ? "Theo dõi đơn hàng ngay" : "Đang tải mã đơn..."}
          </button>

          {/* Nút Trở về trang chủ */}
          <button
            onClick={navigateToHome}
            className="w-full py-3 px-4 text-gray-700 font-bold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200"
          >
            Trở về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
