import React, { useEffect, useRef, useState } from "react";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { io } from "socket.io-client";
import DroneImage from "../../customers/assets/drone.png"; // sửa nếu cần

const HUB = [106.6972, 10.7758];
const GOONG_MAP_KEY = process.env.REACT_APP_GOONG_MAP_KEY;

const statusMap = {
  FLYING_TO_PICKUP: { text: "Drone đang bay đến nhà hàng lấy món", color: "from-orange-500 to-red-600" },
  AT_PICKUP_POINT: { text: "Đã đến nhà hàng – Đang nhận đồ ăn", color: "from-yellow-500 to-amber-600" },
  OUT_FOR_DELIVERY: { text: "Đã lấy hàng – Đang giao", color: "from-blue-500 to-cyan-600" },
  DROPPING_OFF: { text: "Đang thả đồ ăn xuống!", color: "from-red-600 to-rose-700" },
  RETURNING_TO_HUB: { text: "Đã giao xong – Drone đang quay về trạm", color: "from-teal-500 to-emerald-600" },
  LANDING_AT_HUB: { text: "Drone đã về trạm – Sẵn sàng nhiệm vụ tiếp theo", color: "from-indigo-600 to-purple-700" },
};

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default function OrderTrackingMap({ order, drone, onClose }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const droneMarkerRef = useRef(null);
  const [droneStatus, setDroneStatus] = useState(null);

  const restaurantCoords = order?.merchant?.address?.location?.coordinates;
  const customerCoords = order?.address?.location?.coordinates;

  const restaurant = restaurantCoords ? [restaurantCoords[0], restaurantCoords[1]] : null;
  const customer = customerCoords ? [customerCoords[0], customerCoords[1]] : null;
  const isValid = !!restaurant && !!customer && !!order?.orderNumber;

  useEffect(() => {
    if (!isValid || !mapContainer.current) return;

    // QUAN TRỌNG: Join room ngay lập tức
    socket.emit("joinOrder", { orderNumber: order.orderNumber });

    goongjs.accessToken = GOONG_MAP_KEY;
    const map = new goongjs.Map({
      container: mapContainer.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [(HUB[0] + restaurant[0] + customer[0]) / 3, (HUB[1] + restaurant[1] + customer[1]) / 3],
      zoom: 14,
    });
    mapRef.current = map;

    map.on("load", () => {
      const bounds = new goongjs.LngLatBounds();
      [HUB, restaurant, customer].forEach((c) => bounds.extend(c));
      map.fitBounds(bounds, { padding: 100, duration: 1000 });

      // Markers
      new goongjs.Marker({ color: "#8b5cf6" }).setLngLat(HUB).setPopup(new goongjs.Popup().setHTML(`<span class="font-semibold">HUB</span>`)).addTo(map);
      new goongjs.Marker({ color: "#ef4444" }).setLngLat(restaurant).setPopup(new goongjs.Popup().setHTML(`<span class="font-semibold">${order.merchant.name}</span>`)).addTo(map);
      new goongjs.Marker({ color: "#10b981" }).setLngLat(customer).setPopup(new goongjs.Popup().setHTML(`<span class="font-semibold">Khách hàng</span>`)).addTo(map);

      // Route
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: { type: "LineString", coordinates: [HUB, restaurant, customer, HUB] },
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: { "line-color": "#00ff88", "line-width": 6, "line-opacity": 0.8 },
      });

      // Drone
      const el = document.createElement("div");
      el.style.width = "80px";
      el.style.height = "80px";
      el.style.backgroundImage = `url(${DroneImage})`;
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundPosition = "center";
      el.style.filter = "drop-shadow(0 0 15px #00ff88)";

      droneMarkerRef.current = new goongjs.Marker({ element: el, anchor: "bottom" })
        .setLngLat(HUB)
        .addTo(map);
    });

    const handlePosition = (data) => {
      if (data.orderNumber !== order.orderNumber) return;
      droneMarkerRef.current?.setLngLat(data.position);
      setDroneStatus(data.phase);
    };

    socket.on("drone-position-update", handlePosition);

    return () => {
      socket.off("drone-position-update", handlePosition);
      mapRef.current?.remove();
    };
  }, [order?.orderNumber, isValid]); // ← Join lại khi orderNumber có

  const statusInfo = droneStatus ? statusMap[droneStatus] : { text: "", color: "from-gray-500 to-gray-700" };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col text-gray-700">
      <div className="bg-white p-6 flex justify-between items-center shadow-2xl">
        <div>
          <h2 className="text-5xl font-bold">THEO DÕI DRONE LIVE</h2>
          <p className="text-2xl mt-2">Mã đơn: <span className="font-bold">{order.orderNumber}</span></p>
        </div>
        <button onClick={onClose} className="bg-white text-purple-800 w-16 h-16 rounded-full text-5xl font-bold hover:scale-110 transition">
          ×
        </button>
      </div>

      <div className={`bg-gradient-to-r ${statusInfo.color} py-6 text-center shadow-xl`}>
        <p className="text-4xl font-bold animate-pulse drop-shadow-2xl">{statusInfo.text}</p>
      </div>

      <div ref={mapContainer} className="flex-1" />
    </div>
  );
}

