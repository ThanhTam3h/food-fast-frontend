import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../util/formartCurrency";

const MenuItemCard = ({ data }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (data.category.merchantId) {
      navigate(`/restaurant/${data.category.merchantId}`);
    } else {
      console.warn("Không có merchantId trong item:", data);
    }
  };
  return (
    <div
      onClick={handleClick}
      // Áp dụng theme: bo góc lớn (xl), bóng đổ lớn (shadow-xl), hiệu ứng hover mượt mà
      className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
    >
      {/* 1. Hình ảnh */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            data.image ||
            "https://placehold.co/600x400/d3d3d3/6b7280?text=Mon+An"
          }
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          // Xử lý lỗi tải ảnh
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/d3d3d3/6b7280?text=Khong+Co+Anh";
          }}
        />
        {/* Có thể thêm badge Ưu đãi/Mới ở đây nếu cần */}
      </div>

      {/* 2. Nội dung */}
      <div className="p-2">
        {/* Tên món ăn (Thay thế Typography subtitle1) */}
        <h4
          className="font-bold text-gray-900 text-lg mb-1 truncate"
          title={data.name}
        >
          {data.name}
        </h4>

        {/* Mô tả ngắn */}
        <p className="text-gray-500 text-sm mb-3 line-clamp-2 min-h-[40px]">
          {data.description || "Món ăn đặc biệt, hương vị tuyệt hảo."}
        </p>

        {/* Giá (Thay thế Typography body2, dùng màu xanh lá cây đậm cho giá) */}
        <p className="text-gray-500 text-sm font-extrabold mb-2 truncate">
          {formatCurrency(data?.basePrice)}
        </p>
      </div>
    </div>
  );
};

export default MenuItemCard;
