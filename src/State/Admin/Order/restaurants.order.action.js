// actions.js
import { api } from "../../../config/api.js";
import {
  GET_RESTAURANTS_ORDER_FAILURE,
  GET_RESTAURANTS_ORDER_ITEM_FAILURE,
  GET_RESTAURANTS_ORDER_ITEM_REQUEST,
  GET_RESTAURANTS_ORDER_ITEM_SUCCESS,
  GET_RESTAURANTS_ORDER_REQUEST,
  GET_RESTAURANTS_ORDER_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
} from "./ActionType.js";

export const updateOrderStatus = ({ orderNumber, orderStatus, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

      const response = await api.patch(
        `/order/update/${orderNumber}`,
        { status: orderStatus },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const updatedOrder = response.data;

      console.log("udpdated order ", updatedOrder);

      dispatch({
        type: UPDATE_ORDER_STATUS_SUCCESS,
        payload: updatedOrder,
      });
    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: UPDATE_ORDER_STATUS_FAILURE, error });
    }
  };
};

export const fetchRestaurantsOrder = ({ merchantId, status, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_RESTAURANTS_ORDER_REQUEST });

      const { data } = await api.get(`/order/merchant/${merchantId}`, {
        params: { status },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const orders = data;
      console.log("restaurants order ------ ", orders);
      dispatch({
        type: GET_RESTAURANTS_ORDER_SUCCESS,
        payload: orders,
      });
    } catch (error) {
      dispatch({ type: GET_RESTAURANTS_ORDER_FAILURE, error });
    }
  };
};

export const fetchRestaurantOrderItems = ({ orderNumber, jwt }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: GET_RESTAURANTS_ORDER_ITEM_REQUEST });

      const { data } = await api.get(`/order/${orderNumber}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const orderItems = data;
      console.log("restaurants order ------ ", orderItems);
      dispatch({
        type: GET_RESTAURANTS_ORDER_ITEM_SUCCESS,
        payload: orderItems,
      });
    } catch (error) {
      dispatch({ type: GET_RESTAURANTS_ORDER_ITEM_FAILURE, error });
    }
  };
};
