// import React, { useEffect, useRef, useState } from "react";
// import goongjs from "@goongmaps/goong-js";
// import "@goongmaps/goong-js/dist/goong-js.css";
// import { io } from "socket.io-client";
// import DroneImage from "../../assets/drone.png"; // sửa đường dẫn nếu cần

// const GOONG_MAP_KEY = process.env.REACT_APP_GOONG_MAP_KEY;
// const HUB_DEFAULT = [106.6972, 10.7758];

// const statusMap = {
//   FLYING_TO_PICKUP: "Drone đang bay đến nhà hàng lấy món",
//   AT_PICKUP_POINT: "Đã đến nhà hàng – Đang nhận đồ ăn",
//   OUT_FOR_DELIVERY: "Đã lấy hàng – Đang giao",
//   DROPPING_OFF: "Đang thả đồ ăn xuống!",
//   RETURNING_TO_HUB: "Đã giao xong – Drone đang quay về trạm",
//   LANDING_AT_HUB: "Drone đã về trạm – Sẵn sàng nhiệm vụ tiếp theo",
// };

// const socket = io("http://localhost:3000", {
//   transports: ["websocket"],
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// export default function MapSimulation({ order }) {
//   const mapContainer = useRef(null);
//   const mapRef = useRef(null);
//   const droneMarkerRef = useRef(null);
//   const [droneStatus, setDroneStatus] = useState(null);

//   const restaurantCoords = order?.merchant?.address?.location?.coordinates;
//   const customerCoords = order?.address?.location?.coordinates;
//   const hubCoords = order?.droneId
//     ? order?.drone?.droneHub?.location?.coordinates || HUB_DEFAULT
//     : HUB_DEFAULT;

//   const isValid = restaurantCoords && customerCoords && hubCoords;

//   useEffect(() => {
//     if (!isValid || !mapContainer.current || !order?.orderNumber) return;

//     goongjs.accessToken = GOONG_MAP_KEY;

//     // QUAN TRỌNG: Join room ngay khi có orderNumber
//     socket.emit("joinOrder", { orderNumber: order.orderNumber });

//     const map = new goongjs.Map({
//       container: mapContainer.current,
//       style: "https://tiles.goong.io/assets/goong_map_web.json",
//       center: [
//         (hubCoords[0] + restaurantCoords[0] + customerCoords[0]) / 3,
//         (hubCoords[1] + restaurantCoords[1] + customerCoords[1]) / 3,
//       ],
//       zoom: 14,
//     });
//     mapRef.current = map;

//     map.on("load", () => {
//       const bounds = new goongjs.LngLatBounds();
//       [hubCoords, restaurantCoords, customerCoords].forEach((c) => bounds.extend(c));
//       map.fitBounds(bounds, { padding: 100, duration: 1000, maxZoom: 17 });

//       // Markers
//       new goongjs.Marker({ color: "#8b5cf6" }).setLngLat(hubCoords).setPopup(new goongjs.Popup().setText("Hub")).addTo(map);
//       new goongjs.Marker({ color: "#ef4444" }).setLngLat(restaurantCoords).setPopup(new goongjs.Popup().setText(order.merchant.name)).addTo(map);
//       new goongjs.Marker({ color: "#10b981" }).setLngLat(customerCoords).setPopup(new goongjs.Popup().setText("Khách hàng")).addTo(map);

//       // Route
//       map.addSource("route", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: {
//             type: "LineString",
//             coordinates: [hubCoords, restaurantCoords, customerCoords, hubCoords],
//           },
//         },
//       });
//       map.addLayer({
//         id: "route",
//         type: "line",
//         source: "route",
//         paint: { "line-color": "#00ff88", "line-width": 6, "line-opacity": 0.8 },
//       });

//       // Drone Marker
//       if (order?.droneId) {
//         const el = document.createElement("div");
//         el.style.width = "80px";
//         el.style.height = "80px";
//         el.style.backgroundImage = `url(${DroneImage})`;
//         el.style.backgroundSize = "contain";
//         el.style.backgroundRepeat = "no-repeat";
//         el.style.backgroundPosition = "center";
//         el.style.filter = "drop-shadow(0 0 15px #00ff88)";

//         droneMarkerRef.current = new goongjs.Marker({
//           element: el,
//           anchor: "bottom",
//         })
//           .setLngLat(hubCoords)
//           .addTo(map);
//       }
//     });

//     // Nhận vị trí drone realtime
//     const handlePositionUpdate = (data) => {
//       if (data.orderNumber !== order.orderNumber) return;
//       if (droneMarkerRef.current) {
//         droneMarkerRef.current.setLngLat(data.position);
//       }
//       setDroneStatus(data.phase);
//     };

//     socket.on("drone-position-update", handlePositionUpdate);

//     return () => {
//       socket.off("drone-position-update", handlePositionUpdate);
//       mapRef.current?.remove();
//     };
//   }, [order?.orderNumber, isValid]); // ← QUAN TRỌNG: join lại khi orderNumber có

//   return (
//     <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#00b14f] relative">
//       {droneStatus && (
//         <div className="absolute top-0 left-0 right-0 bg-[#00b14f] text-white py-2 px-4 text-center font-bold text-lg z-10">
//           {statusMap[droneStatus] || droneStatus}
//         </div>
//       )}
//       <div ref={mapContainer} className="w-full h-full" />
//     </div>
//   );
// }

// src/components/TrackingOrder/MapSimulation.jsx
import React, { useEffect, useRef, useState } from "react";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { io } from "socket.io-client";
import DroneImage from "../../assets/drone.png"; // sửa đường dẫn nếu cần

const GOONG_MAP_KEY = process.env.REACT_APP_GOONG_MAP_KEY;
const HUB_DEFAULT = [106.6972, 10.7758];

const statusMap = {
  FLYING_TO_PICKUP: "Drone đang bay đến nhà hàng lấy món",
  AT_PICKUP_POINT: "Đã đến nhà hàng – Đang nhận đồ ăn",
  OUT_FOR_DELIVERY: "Đã lấy hàng – Đang bay đến bạn",
  DROPPING_OFF: "Đang thả đồ ăn xuống cho bạn!",
  RETURNING_TO_HUB: "Giao thành công – Cảm ơn bạn đã đặt hàng!",
  LANDING_AT_HUB: "Nhiệm vụ hoàn tất – Hẹn gặp lại!",
};

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default function MapSimulation({ order }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const droneMarkerRef = useRef(null);
  const [droneStatus, setDroneStatus] = useState(null);

  const restaurantCoords = order?.merchant?.address?.location?.coordinates;
  const customerCoords = order?.address?.location?.coordinates;
  const hubCoords = order?.droneId
    ? order?.drone?.droneHub?.location?.coordinates || HUB_DEFAULT
    : HUB_DEFAULT;

  const isValid = restaurantCoords && customerCoords && hubCoords;

  useEffect(() => {
    if (!isValid || !mapContainer.current || !order?.orderNumber) return;

    goongjs.accessToken = GOONG_MAP_KEY;

    // Join room để nhận realtime
    socket.emit("joinOrder", { orderNumber: order.orderNumber });

    const map = new goongjs.Map({
      container: mapContainer.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [
        (hubCoords[0] + restaurantCoords[0] + customerCoords[0]) / 3,
        (hubCoords[1] + restaurantCoords[1] + customerCoords[1]) / 3,
      ],
      zoom: 14,
    });
    mapRef.current = map;

    map.on("load", () => {
      // Fit toàn bộ hành trình (vẫn cần hub để zoom đẹp)
      const bounds = new goongjs.LngLatBounds();
      [hubCoords, restaurantCoords, customerCoords].forEach((c) => bounds.extend(c));
      map.fitBounds(bounds, { padding: 100, duration: 1000, maxZoom: 17 });

      // Markers
      new goongjs.Marker({ color: "#8b5cf6" })
        .setLngLat(hubCoords)
        .setPopup(new goongjs.Popup().setText("Trạm Drone"))
        .addTo(map);

      new goongjs.Marker({ color: "#ef4444" })
        .setLngLat(restaurantCoords)
        .setPopup(new goongjs.Popup().setText(order.merchant.name))
        .addTo(map);

      new goongjs.Marker({ color: "#10b981" })
        .setLngLat(customerCoords)
        .setPopup(new goongjs.Popup().setText("Bạn đang ở đây"))
        .addTo(map);

      // ĐÃ SỬA: Chỉ vẽ đường Hub → Nhà hàng → Khách (không về hub)
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              hubCoords,
              restaurantCoords,
              customerCoords,
              // Không có dòng về hub nữa
            ],
          },
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#00ff88",
          "line-width": 7,
          "line-opacity": 0.9,
        },
      });

      // Tạo drone marker (bắt đầu từ hub)
      if (order?.droneId) {
        const el = document.createElement("div");
        el.style.width = "80px";
        el.style.height = "80px";
        el.style.backgroundImage = `url(${DroneImage})`;
        el.style.backgroundSize = "contain";
        el.style.backgroundRepeat = "no-repeat";
        el.style.backgroundPosition = "center";
        el.style.filter = "drop-shadow(0 0 20px #00ff88)";

        droneMarkerRef.current = new goongjs.Marker({
          element: el,
          anchor: "bottom",
        })
          .setLngLat(hubCoords)
          .addTo(map);
      }
    });

    // Xử lý cập nhật vị trí drone từ backend
    const handlePositionUpdate = (data) => {
      if (data.orderNumber !== order.orderNumber) return;

      // Nếu drone đang về hub → KHÔNG di chuyển marker nữa
      // Drone sẽ dừng lại ở nhà khách → đẹp & hợp lý
      if (data.phase === "RETURNING_TO_HUB" || data.phase === "LANDING_AT_HUB") {
        setDroneStatus(data.phase);
        return; // Không cập nhật vị trí → drone dừng lại
      }

      // Các giai đoạn khác: bay bình thường
      if (droneMarkerRef.current) {
        droneMarkerRef.current.setLngLat(data.position);
      }
      setDroneStatus(data.phase);
    };

    socket.on("drone-position-update", handlePositionUpdate);

    return () => {
      socket.off("drone-position-update", handlePositionUpdate);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [order?.orderNumber, isValid]);

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#00b14f] relative mt-8">
      {/* Hiển thị trạng thái realtime */}
      {droneStatus && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#00b14f] to-[#00d95f] text-white py-3 px-6 text-center font-bold text-lg z-10 shadow-lg">
          {statusMap[droneStatus] || "Drone đang hoạt động..."}
        </div>
      )}

      {/* Bản đồ */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}