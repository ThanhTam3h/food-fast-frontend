import { api } from "../../../config/api";
import {
  CREATE_CATEGORY_FAILURE,
  CREATE_CATEGORY_SUCCESS,
} from "../../Customers/Restaurant/ActionTypes";
import {
  CREATE_CATEGORIES_REQUEST,
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_TOPPING_GROUPS_REQUEST,
  CREATE_TOPPINGS_GROUPS_FAILURE,
  CREATE_TOPPINGS_GROUPS_SUCCESS,
  GET_CATEGORIES_FAILURE,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_TOPPING_GROUPS_REQUEST,
  GET_TOPPINGS_GROUPS_FAILURE,
  GET_TOPPINGS_GROUPS_SUCCESS,
  UPDATE_CATEGORIES_FAILURE,
  UPDATE_CATEGORIES_REQUEST,
  UPDATE_CATEGORIES_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_TOPPING_GROUPS_REQUEST,
  UPDATE_TOPPINGS_GROUPS_FAILURE,
  UPDATE_TOPPINGS_GROUPS_SUCCESS,
} from "./ActionType";

export const getProducts =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: GET_PRODUCTS_REQUEST });
    try {
      const response = await api.get(`/product/getall`, { params });
      dispatch({ type: GET_PRODUCTS_SUCCESS, payload: response.data.data });
    } catch (err) {
      dispatch({
        type: GET_PRODUCTS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };

export const getCategories = (merchantId) => async (dispatch) => {
  dispatch({ type: GET_CATEGORIES_REQUEST });
  try {
    const response = await api.get(`/category`, { params: { merchantId } });
    console.log(response.data.data);
    dispatch({ type: GET_CATEGORIES_SUCCESS, payload: response.data.data });
  } catch (err) {
    dispatch({
      type: GET_CATEGORIES_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const createCategory = (payload) => async (dispatch) => {
  dispatch({ type: CREATE_CATEGORIES_REQUEST });
  try {
    const response = await api.post("/category", payload);
    dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: response.data.data });
  } catch (err) {
    dispatch({
      type: CREATE_CATEGORY_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    throw err;
  }
};

export const updateCategory = (id, payload) => async (dispatch) => {
  dispatch({ type: UPDATE_CATEGORIES_REQUEST });
  try {
    const response = await api.patch(`/category/${id}`, payload);
    dispatch({ type: UPDATE_CATEGORIES_SUCCESS, payload: response.data.data });
  } catch (err) {
    dispatch({
      type: UPDATE_CATEGORIES_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    throw err;
  }
};

export const getToppingGroups = (merchantId) => async (dispatch) => {
  dispatch({ type: GET_TOPPING_GROUPS_REQUEST });
  try {
    const response = await api.get(`/topping-group/merchant/${merchantId}`);
    console.log(response.data.data);
    dispatch({
      type: GET_TOPPINGS_GROUPS_SUCCESS,
      payload: response.data.data,
    });
  } catch (err) {
    dispatch({
      type: GET_TOPPINGS_GROUPS_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

export const createToppingGroup = (payload) => async (dispatch) => {
  dispatch({ type: CREATE_TOPPING_GROUPS_REQUEST });
  try {
    const response = await api.post("/topping-group", payload);
    dispatch({
      type: CREATE_TOPPINGS_GROUPS_SUCCESS,
      payload: response.data.data,
    });
  } catch (err) {
    dispatch({
      type: CREATE_TOPPINGS_GROUPS_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    console.log("CREATE TOPPING GROUP ERR:", err);
  }
};

export const updateToppingGroup = (id, payload) => async (dispatch) => {
  dispatch({ type: UPDATE_TOPPING_GROUPS_REQUEST });
  try {
    const response = await api.patch(`/topping-group/${id}`, payload);
    dispatch({
      type: UPDATE_TOPPINGS_GROUPS_SUCCESS,
      payload: response.data.data,
    });
  } catch (err) {
    dispatch({
      type: UPDATE_TOPPINGS_GROUPS_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    console.log("UPDATE TOPPING GROUP ERR:", err);
  }
};

// --- CREATE PRODUCT ---
export const createProduct = (productData, file) => async (dispatch) => {
  dispatch({ type: CREATE_PRODUCT_REQUEST });

  try {
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description || "");
    formData.append("basePrice", productData.basePrice.toString());
    formData.append("categoryId", productData.categoryId.toString());
    formData.append("merchantId", productData.merchantId.toString());
    formData.append("isActive", productData.isActive ? "true" : "false");

    if (file) {
      console.log("File being sent:", file);
      formData.append("file", file);
    }

    if (productData.productToppingGroups?.length > 0) {
      productData.productToppingGroups.forEach((ptg, i) => {
        formData.append(
          `productToppingGroups[${i}][toppingGroupId]`,
          ptg.toppingGroupId
        );
      });
    }
    // POST với FormData - axios sẽ tự set Content-Type: multipart/form-data
    const response = await api.post("/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({ type: CREATE_PRODUCT_SUCCESS, payload: response.data.data });
  } catch (err) {
    dispatch({
      type: CREATE_PRODUCT_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// --- UPDATE PRODUCT ---
export const updateProduct = (productId, formData) => async (dispatch) => {
  dispatch({ type: UPDATE_PRODUCT_REQUEST });
  try {
    // Ensure axios sends multipart/form-data so multer FileInterceptor can parse the file
    const res = await api.patch(`/product/update/${productId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch({ type: "UPDATE_PRODUCT_SUCCESS", payload: res.data.data });
    return res.data;
  } catch (err) {
    dispatch({
      type: UPDATE_PRODUCT_FAILURE,
      payload: err.response?.data?.message || err.message,
    });

    throw err;
  }
};
