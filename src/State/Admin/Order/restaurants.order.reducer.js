// reducers.js
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

const initialState = {
  loading: false,
  error: null,
  orders: [],
  orderItems: [],
};

const restaurantsOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESTAURANTS_ORDER_REQUEST:
    case UPDATE_ORDER_STATUS_REQUEST:
    case GET_RESTAURANTS_ORDER_ITEM_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_RESTAURANTS_ORDER_SUCCESS:
      return { ...state, loading: false, orders: action.payload.data };

    case GET_RESTAURANTS_ORDER_ITEM_SUCCESS:
      return { ...state, loading: false, orderItems: action.payload };

    case UPDATE_ORDER_STATUS_SUCCESS:
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
      return { ...state, loading: false, orders: updatedOrders };

    case GET_RESTAURANTS_ORDER_FAILURE:
    case UPDATE_ORDER_STATUS_FAILURE:
    case GET_RESTAURANTS_ORDER_ITEM_FAILURE:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};

export default restaurantsOrderReducer;
