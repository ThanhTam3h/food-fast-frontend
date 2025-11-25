 const FilterStatus = ({ orders = [], filterStatus, handleFilterChange }) => {
  const statuses = [
    { label: "Tất cả", value: "ALL", count: orders.length },
    {
      label: "Đang chờ",
      value: "PENDING",
      count: orders.filter((o) => o.status === "PENDING").length,
    },
    {
      label: "Đã xác nhận",
      value: "CONFIRMED",
      count: orders.filter((o) => o.status === "CONFIRMED").length,
    },
    {
      label: "Đang giao hàng",
      value: "DELIVERING",
      count: orders.filter((o) => o.status === "DELIVERING").length,
    },
    {
      label: "Đã giao hàng",
      value: "DELIVERED",
      count: orders.filter((o) => o.status === "DELIVERED").length,
    },
    {
      label: "Đã hủy",
      value: "CANCELLED",
      count: orders.filter((o) => o.status === "CANCELLED").length,
    },
  ];

  return (
  // Container cho thanh tab. Dùng border-b để tạo đường line ngăn cách dưới cùng.
    <div className="flex space-x-0 overflow-x-auto border-b border-gray-200">
      {statuses.map((status) => (
        <button
          key={status.value}
          onClick={() => handleFilterChange && handleFilterChange(status.value)}
          // Styling tab: py-3, border-b-2 cho tab, text-sm font-bold
          className={`flex-shrink-0 py-3 px-4 text-sm font-bold transition-all duration-200 whitespace-nowrap 
                        border-b-2 mx-1
                        ${
                          filterStatus === status.value
                            ? "border-green-600 text-green-600" // Active tab: Green border and text
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" // Inactive tab: Transparent border, hover effect
                        }`}
        >
          {status.label}
          {/* Badge: giữ lại để hiển thị số lượng */}
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-xs font-extrabold transition-colors
                        ${
                          filterStatus === status.value
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
          >
            {status.count}
          </span>
        </button>
      ))}
    </div>
  );
 };

export default FilterStatus;

