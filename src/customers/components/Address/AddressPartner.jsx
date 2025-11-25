import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { useEffect, useRef, useState } from "react";

export default function AddressPartner({
	onAddressChange,
	restaurant,
	onLocationSelected,
}) {
	const GOONG_MAP_KEY = process.env.REACT_APP_GOONG_MAP_KEY;
	const GOONG_RS_KEY = process.env.REACT_APP_GOONG_RS_KEY;

	const latRestaurant =
		restaurant?.address?.latitude ??
		restaurant?.address?.location?.coordinates?.[1] ??
		null;

	const lngRestaurant =
		restaurant?.address?.longitude ??
		restaurant?.address?.location?.coordinates?.[0] ??
		null;

	const mapContainer = useRef(null);
	const mapRef = useRef(null);
	const isSelectionRef = useRef(false); // Ref để chặn gọi API khi click chọn

	const [restaurantMarker, setRestaurantMarker] = useState(null);
	const [customerMarker, setCustomerMarker] = useState(null);

	const [search, setSearch] = useState("");
	const [suggestions, setSuggestions] = useState([]);

	const [addressFull, setAddressFull] = useState("");
	const [lat, setLat] = useState("");
	const [lng, setLng] = useState("");

	const [useCurrentLocation, setUseCurrentLocation] = useState(false);
	const [droneDistance, setDroneDistance] = useState(null);

	// === 1. Init Map ===
	useEffect(() => {
		if (!GOONG_MAP_KEY) {
			console.error("⚠️ Missing REACT_APP_GOONG_MAP_KEY");
			return;
		}

		if (lngRestaurant == null || latRestaurant == null) {
			console.log("Chưa có toạ độ nhà hàng", restaurant);
			return;
		}
		if (!mapContainer.current) return;

		goongjs.accessToken = GOONG_MAP_KEY;

		const map = new goongjs.Map({
			container: mapContainer.current,
			style: "https://tiles.goong.io/assets/goong_map_web.json",
			center: [lngRestaurant, latRestaurant],
			zoom: 13,
		});

		mapRef.current = map;
		map.addControl(new goongjs.NavigationControl(), "bottom-right");

		const rMarker = new goongjs.Marker({ color: "red" })
			.setLngLat([lngRestaurant, latRestaurant])
			.addTo(map);
		setRestaurantMarker(rMarker);

		return () => {
			try {
				map.remove();
			} catch {}
		};
	}, [GOONG_MAP_KEY, lngRestaurant, latRestaurant]);

	// === Helper Functions ===
	const calculateDroneDistance = (lat1, lon1, lat2, lon2) => {
		const R = 6371; // km
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // km
	};

	const drawDroneLine = (customerLat, customerLng) => {
		const map = mapRef.current;
		if (!map) return;
		if (lngRestaurant == null || latRestaurant == null) return;

		if (map.getLayer("drone-line")) map.removeLayer("drone-line");
		if (map.getSource("drone-line")) map.removeSource("drone-line");

		const lineCoords = [
			[lngRestaurant, latRestaurant],
			[customerLng, customerLat],
		];

		map.addSource("drone-line", {
			type: "geojson",
			data: {
				type: "Feature",
				geometry: { type: "LineString", coordinates: lineCoords },
			},
		});
		map.addLayer({
			id: "drone-line",
			type: "line",
			source: "drone-line",
			paint: {
				"line-color": "#00bcd4",
				"line-width": 4,
				"line-dasharray": [2, 2],
			},
		});

		const distance = calculateDroneDistance(
			latRestaurant,
			lngRestaurant,
			customerLat,
			customerLng
		).toFixed(2);

		setDroneDistance(distance);
	};

	const reverseGeocode = async (latVal, lngVal) => {
		try {
			const res = await fetch(
				`https://rsapi.goong.io/Geocode?latlng=${latVal},${lngVal}&api_key=${GOONG_RS_KEY}`
			);
			const data = await res.json();
			if (data.status === "OK") {
				const r = data.results[0];
				setAddressFull(r.formatted_address);
				setLat(latVal);
				setLng(lngVal);

				onAddressChange?.({
					full: r.formatted_address,
					lat: latVal,
					lng: lngVal,
				});

				if (
					onLocationSelected &&
					lngRestaurant != null &&
					latRestaurant != null
				) {
					const distance = calculateDroneDistance(
						latRestaurant,
						lngRestaurant,
						latVal,
						lngVal
					).toFixed(2);

					onLocationSelected({
						street: r.formatted_address,
						location: { type: "Point", coordinates: [lngVal, latVal] },
						distance: Number(distance),
					});
				}
			}
		} catch (error) {
			console.error("Error reverse geocoding:", error);
		}
	};

	const placeCustomerMarker = async (lngVal, latVal) => {
		const map = mapRef.current;
		if (!map) return;

		if (customerMarker) customerMarker.remove();

		const newMarker = new goongjs.Marker({ color: "blue", draggable: true })
			.setLngLat([lngVal, latVal])
			.addTo(map);

		const distance = calculateDroneDistance(
			latRestaurant,
			lngRestaurant,
			latVal,
			lngVal
		).toFixed(2);

		newMarker.on("dragend", async () => {
			const { lng, lat } = newMarker.getLngLat();
			await reverseGeocode(lat, lng);
			drawDroneLine(lat, lng);
			if (onLocationSelected) {
				onLocationSelected({
					street: addressFull || "Địa chỉ tạm",
					location: { type: "Point", coordinates: [lng, lat] },
					distance: Number(distance),
				});
			}
		});

		setCustomerMarker(newMarker);
		map.flyTo({ center: [lngVal, latVal], zoom: 15 });
		drawDroneLine(latVal, lngVal);

		if (onLocationSelected) {
			onLocationSelected({
				street: addressFull || "Địa chỉ tạm",
				location: { type: "Point", coordinates: [lngVal, latVal] },
				distance: Number(distance),
			});
		}
	};

	const handleUseCurrentLocation = () => {
		setUseCurrentLocation(true);
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const { latitude, longitude } = pos.coords;
				await placeCustomerMarker(longitude, latitude);
				await reverseGeocode(latitude, longitude);
			},
			(err) => {
				alert("Không lấy được vị trí");
				console.error(err);
			}
		);
	};

	// === FIX: DEBOUNCE LOGIC FOR SEARCH ===
	useEffect(() => {
		// Nếu đây là do user click chọn (isSelectionRef = true), không gọi API
		if (isSelectionRef.current) {
			isSelectionRef.current = false;
			return;
		}

		// Nếu chuỗi search quá ngắn, xoá gợi ý
		if (!search || search.length < 2) {
			setSuggestions([]);
			return;
		}

		// Tạo bộ đếm ngược (debounce)
		const timeoutId = setTimeout(async () => {
			try {
				const res = await fetch(
					`https://rsapi.goong.io/Place/AutoComplete?api_key=${GOONG_RS_KEY}&input=${encodeURIComponent(
						search
					)}`
				);
				const data = await res.json();
				if (data.status === "OK") {
					setSuggestions(data.predictions || []);
				} else {
					// Handle error (e.g., limit exceeded) gently
					setSuggestions([]);
				}
			} catch (error) {
				console.error("Error fetching suggestions:", error);
			}
		}, 500); // <-- CHỜ 500ms MỚI GỌI API

		// Cleanup: Nếu user gõ tiếp trước khi hết 500ms, huỷ lệnh gọi cũ
		return () => clearTimeout(timeoutId);
	}, [search, GOONG_RS_KEY]);

	const handleInputChange = (val) => {
		setSearch(val); // Chỉ cập nhật state, useEffect sẽ lo phần gọi API
	};

	const handleSelectSuggestion = async (place_id, description) => {
		isSelectionRef.current = true; // Đánh dấu là đang chọn, không cần search lại
		setSearch(description);
		setSuggestions([]); // Ẩn bảng gợi ý ngay lập tức

		try {
			const res = await fetch(
				`https://rsapi.goong.io/Place/Detail?place_id=${place_id}&api_key=${GOONG_RS_KEY}`
			);
			const data = await res.json();
			if (data.result) {
				const result = data.result;
				const { lat: rlat, lng: rlng } = result.geometry.location;
				setAddressFull(result.formatted_address);
				await placeCustomerMarker(rlng, rlat);
				// Không cần reverseGeocode ở đây nữa vì đã có address từ Place Detail,
				// nhưng nếu muốn lấy format chuẩn của Goong thì cứ giữ.
			}
		} catch (error) {
			console.error("Error fetching place detail:", error);
		}
	};

	return (
		<div className="space-y-3 text-black">
			<div className="flex gap-3">
				<button
					type="button"
					onClick={handleUseCurrentLocation}
					className={`px-3 py-2 rounded-lg border ${
						useCurrentLocation
							? "bg-green-600 text-white"
							: "bg-white text-gray-700"
					}`}>
					Dùng vị trí hiện tại
				</button>
				<button
					type="button"
					onClick={() => setUseCurrentLocation(false)}
					className={`px-3 py-2 rounded-lg border ${
						!useCurrentLocation
							? "bg-green-600 text-white"
							: "bg-white text-gray-700"
					}`}>
					Nhập địa chỉ
				</button>
			</div>

			<div className="relative">
				<input
					type="text"
					value={search}
					onChange={(e) => handleInputChange(e.target.value)}
					placeholder="Nhập địa chỉ..."
					className="w-full p-2 border rounded-lg"
				/>
				{suggestions.length > 0 && (
					<div className="absolute z-10 w-full mt-1 border rounded bg-white shadow-lg max-h-40 overflow-auto">
						{suggestions.map((s) => (
							<div
								key={s.place_id}
								onClick={() =>
									handleSelectSuggestion(s.place_id, s.description)
								}
								className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
								{s.description}
							</div>
						))}
					</div>
				)}
			</div>

			<div
				ref={mapContainer}
				className="goong-map-container h-64 rounded-xl shadow-inner"
			/>

			<input
				value={addressFull}
				readOnly
				className="w-full p-2 border rounded-lg bg-gray-50"
				placeholder="Địa chỉ đầy đủ"
			/>
		</div>
	);
}
