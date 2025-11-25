import {
  CREATE_CATEGORIES_FAILURE,
  CREATE_CATEGORIES_REQUEST,
  CREATE_CATEGORIES_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_TOPPING_GROUPS_REQUEST,
  CREATE_TOPPINGS_GROUPS_FAILURE,
  CREATE_TOPPINGS_GROUPS_SUCCESS,
  GET_CATEGORIES_FAILURE,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_ONE_PRODUCT_FAILURE,
  GET_ONE_PRODUCT_REQUEST,
  GET_ONE_PRODUCT_SUCCESS,
  GET_PRODUCTS_FAILURE,
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_TOPPING_GROUPS_REQUEST,
  GET_TOPPINGS_GROUPS_FAILURE,
  GET_TOPPINGS_GROUPS_SUCCESS,
  UPDATE_CATEGORIES_FAILURE,
  UPDATE_CATEGORIES_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_TOPPING_GROUPS_REQUEST,
  UPDATE_TOPPINGS_GROUPS_FAILURE,
  UPDATE_TOPPINGS_GROUPS_SUCCESS,
} from "./ActionType";

const initialState = {
  products: [],
  categories: [],
  toppingGroups: [],
  oneProduct: null,
  loading: false,
  error: null,
  createSuccess: null,
  updateSuccess: null,
};

export const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS_REQUEST:
    case GET_TOPPING_GROUPS_REQUEST:
    case GET_CATEGORIES_REQUEST:
    case GET_ONE_PRODUCT_REQUEST:
    case CREATE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
    case CREATE_TOPPING_GROUPS_REQUEST:
    case UPDATE_TOPPING_GROUPS_REQUEST:
    case CREATE_CATEGORIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        createSuccess: null,
        updateSuccess: null,
      };

    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload || [],
      };

    case GET_TOPPINGS_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        toppingGroups: action.payload || [],
      };

    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload || [],
      };

    case GET_ONE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        oneProduct: action.payload || null,
      };

    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: [action.payload, ...state.products], // add new product to list
      };

    case CREATE_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [action.payload, ...state.categories],
      };

    case UPDATE_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.map((c) =>
          c.id === action.payload?.id ? action.payload : c
        ),
      };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((p) =>
          p.id === action.payload.data?.id ? action.payload.data : p
        ),
      };

    case CREATE_TOPPINGS_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        toppingGroups: [action.payload, ...state.toppingGroups],
      };

    case UPDATE_TOPPINGS_GROUPS_SUCCESS:
      return {
        ...state,
        loading: false,
        toppingGroups: state.toppingGroups.map((tg) =>
          tg.id === action.payload?.id ? action.payload : tg
        ),
      };

    case GET_PRODUCTS_FAILURE:
    case GET_CATEGORIES_FAILURE:
    case GET_TOPPINGS_GROUPS_FAILURE:
    case GET_ONE_PRODUCT_FAILURE:
    case CREATE_PRODUCT_FAILURE:
    case UPDATE_PRODUCT_FAILURE:
    case CREATE_TOPPINGS_GROUPS_FAILURE:
    case UPDATE_TOPPINGS_GROUPS_FAILURE:
    case CREATE_CATEGORIES_FAILURE:
    case UPDATE_CATEGORIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
