import { useEffect } from "react";
import { websocketService } from "../config/websocket";

/**
 * Custom hook để listen order status updates qua WebSocket
 * @param {string} orderNumber - Số đơn hàng
 * @param {function} onOrderUpdate - Callback khi có status update
 */
export const useOrderWebSocket = (orderNumber, onOrderUpdate) => {
  useEffect(() => {
    if (!orderNumber) return;

    // Connect websocket nếu chưa connect
    if (!websocketService.isConnected()) {
      websocketService.connect();
    }

    // Join room cho order này
    websocketService.joinOrder(orderNumber);

    // Subscribe đến updates cho order này
    websocketService.onOrderStatusUpdated(orderNumber, (payload) => {
      console.log("Order update received:", payload);
      if (onOrderUpdate) {
        onOrderUpdate(payload);
      }
    });

    // Cleanup
    return () => {
      websocketService.offOrderStatusUpdated(orderNumber);
    };
  }, [orderNumber, onOrderUpdate]);
};

/**
 * Custom hook để listen new orders (cho merchant)
 * @param {function} onNewOrder - Callback khi có order mới
 */
export const useNewOrderWebSocket = (onNewOrder) => {
  useEffect(() => {
    // Connect websocket
    if (!websocketService.isConnected()) {
      websocketService.connect();
    }

    // Subscribe đến new orders
    if (onNewOrder) {
      websocketService.onNewOrder(onNewOrder);
    }

    // Cleanup
    return () => {
      websocketService.offNewOrder();
    };
  }, [onNewOrder]);
};

/**
 * Custom hook để subscribe generic websocket events
 * @param {string} event - Event name
 * @param {function} callback - Callback
 */
export const useWebSocketEvent = (event, callback) => {
  useEffect(() => {
    if (!event || !callback) return;

    if (!websocketService.isConnected()) {
      websocketService.connect();
    }

    websocketService.on(event, callback);

    return () => {
      websocketService.off(event);
    };
  }, [event, callback]);
};

/**
 * Get websocket connection status
 */
export const getWebSocketStatus = () => {
  return websocketService.isConnected();
};

/**
 * Connect to websocket
 */
export const connectWebSocket = () => {
  if (!websocketService.isConnected()) {
    websocketService.connect();
  }
};

/**
 * Disconnect from websocket
 */
export const disconnectWebSocket = () => {
  websocketService.disconnect();
};
