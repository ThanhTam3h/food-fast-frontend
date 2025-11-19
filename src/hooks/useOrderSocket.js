// hooks/useOrderSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// BACKEND CHẠY Ở PORT 3000 → PHẢI KẾT NỐI TỚI 3000
const SOCKET_URL = "http://localhost:3000"; 

let socket = null;

export default function useOrderSocket(orderNumber, onStatusUpdate) {
  const handlerRef = useRef();

  useEffect(() => {
    if (!orderNumber || !onStatusUpdate) return;

    // Tạo socket chỉ 1 lần
    if (!socket || !socket.connected) {
      socket = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 20000,
      });

      socket.on("connect", () => {
        console.log("Socket connected thành công:", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.warn("Socket lỗi kết nối:", err.message);
      });
    }

    handlerRef.current = (payload) => {
      if (payload.orderNumber === orderNumber) {
        onStatusUpdate(payload);
      }
    };

    socket.emit("joinOrder", { orderNumber });
    socket.on("orderStatusUpdated", handlerRef.current);

    return () => {
      if (socket && handlerRef.current) {
        socket.off("orderStatusUpdated", handlerRef.current);
      }
      // Không disconnect() ở đây → tránh lỗi StrictMode
    };
  }, [orderNumber, onStatusUpdate]);

  // Chỉ disconnect khi người dùng thật sự rời app
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
        console.log("Socket đã disconnect khi rời app");
      }
    };
  }, []);
}
