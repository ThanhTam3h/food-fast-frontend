import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { formatDistance } from "../../util/formatDistance";

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (restaurant.id) {
      navigate(`/restaurant/${restaurant.id}`);
    }
  };
  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            restaurant?.merchantImages[0] ||
            "https://placehold.co/400x250/000000/FFFFFF?text=Logo+Nha+Hang"
          }
          alt={restaurant?.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x250/d3d3d3/6b7280?text=Khong+Co+Anh";
          }}
        />
      </div>

      <div className="p-4 flex flex-col justify-between h-[110px]">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 truncate mb-1">
            {restaurant?.name}
          </h3>

          {/* Địa chỉ */}
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            {restaurant?.address?.street}
          </p>
        </div>

        {/* 3. Thông tin phụ: đánh giá và thời gian */}
        <div className="flex items-center justify-between text-sm text-gray-700 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <AccessTimeIcon sx={{ fontSize: "1rem", color: "#6b7280" }} />{" "}
            {/* Màu xám cho đồng hồ */}
            <span className="font-medium text-gray-800">
              {formatDistance(restaurant.distance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
