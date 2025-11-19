export const DashboardHome = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-800">Chào mừng quay lại!</h1>
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        Doanh thu hôm nay: 12.450.000₫
      </div>
      <div className="bg-white p-6 rounded-xl shadow">Đơn hàng mới: 38</div>
      <div className="bg-white p-6 rounded-xl shadow">Đánh giá: 4.9 ★</div>
    </div>
  </div>
);
