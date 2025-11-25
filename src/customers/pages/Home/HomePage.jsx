import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMenuItems } from "../../../State/Customers/Menu/menu.action";
import { getNearbyRestaurants } from "../../../State/Customers/Restaurant/restaurant.action";
import MenuItemCard from "../../components/MenuItem/MenuItemCard";
import RestaurantCard from "../../components/RestarentCard/RestaurantCard";

import { Typography } from "@mui/material";
import { Footer } from "../../components/Footer/Footer";

// Goong Reverse Geocode Key
const GOONG_RS_KEY = process.env.REACT_APP_GOONG_RS_KEY;

const HomePage = () => {
  const dispatch = useDispatch();
  const { menuItems } = useSelector((state) => state.menu);
  const restaurant = useSelector((state) => state.restaurant);

  // State cho vị trí
  const [currentAddress, setCurrentAddress] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(true);
  const [hasLocation, setHasLocation] = useState(false);

  // Reverse Geocode
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${GOONG_RS_KEY}`
      );
      const data = await res.json();
      if (data.status === "OK" && data.results[0]) {
        return data.results[0].formatted_address;
      }
      console.log(data);
      return "Địa chỉ không xác định";
    } catch (err) {
      console.error("Lỗi reverse geocode:", err);
      return "Lỗi lấy địa chỉ";
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setCurrentAddress("Trình duyệt không hỗ trợ định vị");
      setIsGettingLocation(false);
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("SUCCESS POSITION:", position);
        const { latitude, longitude } = position.coords;

        const fullAddress = await reverseGeocode(latitude, longitude);

        setCurrentAddress(fullAddress);
        setHasLocation(true);
        setIsGettingLocation(false);

        localStorage.setItem(
          "userLocation",
          JSON.stringify({
            lat: latitude,
            lng: longitude,
            address: fullAddress,
          })
        );
      },
      (error) => {
        console.error("ERROR POSITION:", error);
        let message = "Không thể lấy vị trí";

        switch (error.code) {
          case 1:
            message = "Bạn đã từ chối chia sẻ vị trí";
            break;
          case 2:
            message = "Không thể xác định vị trí";
            break;
          case 3:
            message = "Hết thời gian chờ";
            break;
        }

        setCurrentAddress(message);
        setHasLocation(false);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

  // TỰ ĐỘNG chạy khi vào trang
  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (hasLocation) {
      const { lat, lng } = JSON.parse(localStorage.getItem("userLocation"));
      dispatch(getNearbyRestaurants({ lat, lng }));
    }
  }, [hasLocation]);

  // Load menu, restaurant
  useEffect(() => {
    dispatch(getAllMenuItems({ page: 1, limit: 100 }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <header className="relative h-[600px] lg:h-[700px] w-full">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://karlobag.eu/images/upload/j1d0u.jpg")',
            filter: "brightness(80%)",
          }}
        ></div>

        {/* Hero Card */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] lg:w-[700px]">
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Chào bạn!
            </h1>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              Giao hàng đến
            </h2>

            {/* 1. Đang lấy vị trí */}
            {isGettingLocation && (
              <div className="flex items-center space-x-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg animate-pulse">
                <svg
                  className="animate-spin h-6 w-6 text-blue-600"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="font-medium text-blue-700">
                  Đang xác định vị trí của bạn...
                </p>
              </div>
            )}

            {/* 2. Đã có địa chỉ */}
            {!isGettingLocation && hasLocation && (
              <div className="flex items-center space-x-3 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800 truncate">
                    {currentAddress}
                  </p>
                </div>
              </div>
            )}

            {/* 3. Lỗi hoặc từ chối */}
            {!isGettingLocation && !hasLocation && (
              <div className="flex items-center space-x-3 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <MapPin className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-700">{currentAddress}</p>
                  <button
                    onClick={getUserLocation}
                    className="text-xs underline text-red-600 mt-1"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Restaurant List */}
      <section className="container mx-auto px-2 py-12 pt-0 mt-10">
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontSize: "1.875rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "1.5rem",
          }}
        >
          Khám phá các nhà hàng nổi bật{" "}
          <span
            style={{
              color: "#16a34a",
            }}
          >
            {currentAddress || ""}
          </span>
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {restaurant?.restaurants.map((r, i) => (
            <RestaurantCard key={i} restaurant={r} />
          ))}
        </div>
      </section>

      {/* Menu Items */}
      <section className="container mx-auto px-2 py-12 pt-0">
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontSize: "1.875rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "1.5rem",
          }}
        >
          Khám phá các món ăn nổi bật
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {menuItems?.map((item, i) => (
            <MenuItemCard key={i} data={item} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
