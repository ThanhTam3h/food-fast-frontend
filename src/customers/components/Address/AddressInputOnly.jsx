// src/components/AddressInputOnly.jsx
import { useState, useEffect } from "react";

const GOONG_RS_KEY = process.env.REACT_APP_GOONG_RS_KEY;

export default function AddressInputOnly({ onAddressSelected }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [addressFull, setAddressFull] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

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
      return "Không xác định được địa chỉ";
    } catch (err) {
      console.error("Reverse geocode error:", err);
      return "Lỗi lấy địa chỉ";
    }
  };

  // Dùng vị trí hiện tại
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị");
      return;
    }

    setIsLoadingLocation(true);
    setUseCurrentLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const fullAddress = await reverseGeocode(latitude, longitude);
        setAddressFull(fullAddress);
        setSearch(fullAddress);
        setSuggestions([]);
        setIsLoadingLocation(false);

        onAddressSelected?.({
          full: fullAddress,
          lat: latitude,
          lng: longitude,
        });
      },
      (err) => {
        console.error(err);
        alert("Không thể lấy vị trí hiện tại");
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Autocomplete
  const handleInputChange = async (val) => {
    setSearch(val);
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_RS_KEY}&input=${encodeURIComponent(
          val
        )}`
      );
      const data = await res.json();
      setSuggestions(data.predictions || []);
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  };

  // Chọn gợi ý
  const handleSelectSuggestion = async (place_id, description) => {
    setSearch(description);
    setSuggestions([]);
    try {
      const res = await fetch(
        `https://rsapi.goong.io/Place/Detail?place_id=${place_id}&api_key=${GOONG_RS_KEY}`
      );
      const data = await res.json();
      const result = data.result;
      const { lat, lng } = result.geometry.location;
      const fullAddress = result.formatted_address;

      setAddressFull(fullAddress);
      onAddressSelected?.({
        full: fullAddress,
        lat,
        lng,
      });
    } catch (err) {
      console.error("Place detail error:", err);
    }
  };

  return (
    <div className="space-y-3">
      {/* Nút chọn vị trí */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            useCurrentLocation
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {isLoadingLocation ? "Đang lấy..." : "Vị trí hiện tại"}
        </button>
        <button
          type="button"
          onClick={() => setUseCurrentLocation(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            !useCurrentLocation
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Nhập địa chỉ
        </button>
      </div>

      {/* Input + Autocomplete */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Nhập địa chỉ giao hàng..."
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {isLoadingLocation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-green-500"
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
          </div>
        )}
      </div>

      {/* Gợi ý */}
      {suggestions.length > 0 && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-lg max-h-48 overflow-auto">
          {suggestions.map((s) => (
            <div
              key={s.place_id}
              onClick={() => handleSelectSuggestion(s.place_id, s.description)}
              className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
            >
              {s.description}
            </div>
          ))}
        </div>
      )}

      {/* Hiển thị địa chỉ đầy đủ */}
      {addressFull && (
        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200">
          <strong>Địa chỉ giao:</strong> {addressFull}
        </div>
      )}
    </div>
  );
}
