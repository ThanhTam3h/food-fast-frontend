const tabs = [
  { key: "PENDING", label: "Đơn Mới", color: "text-orange-600" },
  { key: "CONFIRMED", label: "Đã xác nhận", color: "text-blue-600" },
  // { key: "PREPARING", label: "Đang chuẩn bị", color: "text-yellow-600" },
  // { key: "READY", label: "Sẵn Sàng", color: "text-blue-600" },
  { key: "DELIVERING", label: "Đang giao hàng", color: "text-green-600" },
  { key: "DELIVERED", label: "Đã giao hàng", color: "text-green-600" },
  { key: "CANCELLED", label: "Đã Hủy", color: "text-red-600" },
];

export const OrderTabs = ({ activeTab, setActiveTab, orders }) => {
  const countByStatus = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      acc.ALL += 1;
      return acc;
    },
    { ALL: 0 }
  );

  return (
    <div className="flex flex-wrap border-b border-gray-200 mb-6 bg-white p-2 rounded-xl shadow-lg">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center ${
            activeTab === tab.key
              ? "border-b-2 border-green-500 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
          {countByStatus[tab.key] > 0 && (
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                tab.key === "NEW"
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {countByStatus[tab.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
