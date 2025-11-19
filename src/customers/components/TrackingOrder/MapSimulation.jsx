import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useEffect, useRef } from "react";
import DroneImage from "../../assets/drone.png";

const GOONG_MAP_KEY = process.env.REACT_APP_GOONG_MAP_KEY;

export default function MapSimulation({ order, arrived, onDelivered }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const droneMarkerRef = useRef(null);

  const fromLng = order?.merchant?.address?.location?.coordinates[0];
  const fromLat = order?.merchant?.address?.location?.coordinates[1];
  const toLng = order?.address?.location?.coordinates[0];
  const toLat = order?.address?.location?.coordinates[1];

  useEffect(() => {
    if (!GOONG_MAP_KEY || !mapContainer.current) return;

    goongjs.accessToken = GOONG_MAP_KEY;

    // Khởi tạo map 1 lần duy nhất
    const map = new goongjs.Map({
      container: mapContainer.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [(fromLng + toLng) / 2, (fromLat + toLat) / 2],
      zoom: 14,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Fit bounds 2 điểm
      map.fitBounds(
        [
          [fromLng, fromLat],
          [toLng, toLat],
        ],
        { padding: 100, duration: 1200, maxZoom: 17 }
      );

      // Marker nhà hàng
      new goongjs.Marker({ color: "#dc2626" })
        .setLngLat([fromLng, fromLat])
        .setPopup(new goongjs.Popup({ offset: 15 }).setText("Nhà hàng"))
        .addTo(map);

      // Marker khách
      new goongjs.Marker({ color: "#2563eb" })
        .setLngLat([toLng, toLat])
        .setPopup(new goongjs.Popup({ offset: 15 }).setText("Giao đến đây"))
        .addTo(map);

      // Đường bay
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [fromLng, fromLat],
              [toLng, toLat],
            ],
          },
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: { "line-color": "#00b14f", "line-width": 6 },
      });

      // =====================
      // Drone marker (always)
      // =====================
      const droneImg = new Image(70, 70);
      droneImg.src = DroneImage;

      droneImg.onload = () => {
        const el = document.createElement("div");
        el.appendChild(droneImg);

        droneMarkerRef.current = new goongjs.Marker({
          element: el,
          anchor: "center",
        })
          .setLngLat(arrived ? [toLng, toLat] : [fromLng, fromLat])
          .addTo(map);

        // ===========================
        // 🚁 Animation CHỈ khi chưa giao
        // ===========================
        if (!arrived) {
          let start = Date.now();
          const duration = 5000;

          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);

            const currentLng = fromLng + (toLng - fromLng) * progress;
            const currentLat = fromLat + (toLat - fromLat) * progress;

            droneMarkerRef.current.setLngLat([currentLng, currentLat]);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              if (typeof onDelivered === "function") onDelivered();
            }
          };

          requestAnimationFrame(animate);
        }
      };
    });

    return () => mapRef.current?.remove();
  }, [fromLng, fromLat, toLng, toLat]);

  return (
    <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#00b14f]">
      <div ref={mapContainer} className="w-full h-96" />

      <div className="bg-[#00b14f] text-white py-4 px-6 text-center font-bold text-lg">
        Drone {order?.droneId || "DRONE-001"} đang giao hàng
        <div className="text-sm font-normal mt-1">
          {order?.address?.street || "Đang xác định địa chỉ..."}
        </div>
      </div>
    </div>
  );
}
