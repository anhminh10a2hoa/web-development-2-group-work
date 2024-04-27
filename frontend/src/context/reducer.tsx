import { deleteOrder } from "../services/orders";
import { updateCart } from "../utils/cart";
import { Cookies } from "typescript-cookie";

type OrderStatus = "Ordered" | "Received" | "InQueue" | "Ready" | "Failed";

interface Topping {
  id: number;
  name: string;
}

interface ToppingUser {
  id: number;
  name: string;
  number: number;
}

interface Time {
  orderTime: string;
  receiveOrderTime: string;
  inQueueTime: string;
  doneTime: string;
}

export interface Sandwich {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  toppings: Array<Topping>;
  breadType: string;
}

export interface SandwichUser {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  toppings: Array<ToppingUser>;
  breadType: string;
}

export interface Order {
  _id: string;
  customerId: string;
  items: SandwichUser[];
  status: OrderStatus;
  activeStep: number;
  customerName: string;
  time: Time;
  orderPrice: number;
}

export interface User {
  name: string;
  email: string;
  role: "customer" | "admin";
}

const mapToppingsToToppingsUser = (toppings: Topping[]): ToppingUser[] => {
  return toppings.map(
    (topping: Topping): ToppingUser => ({
      id: topping.id,
      name: topping.name,
      number: 0,
    })
  );
};

const convertSandwichToSandwichUser = (sandwich: Sandwich): SandwichUser => {
  const { _id, name, price, image, description, toppings, breadType } =
    sandwich;
  return {
    _id,
    name,
    price,
    image,
    description,
    toppings: mapToppingsToToppingsUser(toppings),
    breadType,
  };
};

const modifyToppingUser = (
  sandwich: SandwichUser,
  id: number,
  number: number
): SandwichUser => {
  const newTopping = [...sandwich.toppings];
  newTopping[id].number += number;
  newTopping[id].number = newTopping[id].number < 0 ? 0 : newTopping[id].number;
  return { ...sandwich, toppings: newTopping };
};

export type Action =
  | { type: "SET_SANDWICHES"; payload: Sandwich[] }
  | { type: "SET_CURRENT_SANDWICH"; payload: Sandwich | undefined }
  | { type: "LOGIN_FAILED"; payload: string }
  | { type: "SET_SNACKBAR_MESSAGE"; payload: string }
  | { type: "CLEAR_LOGIN_MESSAGE" }
  | { type: "CLOSE_SNACKBAR" }
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_CURRENT_TOPPING"; id: number; number: number }
  | { type: "SET_CART"; payload: SandwichUser[] }
  | { type: "ADD_TO_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "REMOVE_ITEM_FROM_CART"; id: number }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "SET_SIGNUP_MESSAGE"; payload: string }
  | { type: "DELETE_ORDER"; orderId: string }
  | { type: "ADD_ORDER"; payload: Order };

export const reducer = (
  state: StoreStateType,
  action: Action
): StoreStateType => {
  switch (action.type) {
    case "SET_SANDWICHES": {
      return {
        ...state,
        sandwiches: [...action.payload],
      };
    }

    case "CLEAR_LOGIN_MESSAGE": {
      return {
        ...state,
        loginMessage: null,
      };
    }

    case "LOGIN_FAILED": {
      return {
        ...state,
        loginMessage: action.payload,
      };
    }

    case "SET_SNACKBAR_MESSAGE": {
      return {
        ...state,
        snackOpen: true,
        snackMessage: action.payload,
      };
    }

    case "CLOSE_SNACKBAR": {
      return {
        ...state,
        snackOpen: false,
      };
    }

    case "SET_USER": {
      return {
        ...state,
        user: action.payload,
      };
    }

    case "SET_CURRENT_SANDWICH": {
      return {
        ...state,
        currentSandwich: action.payload
          ? convertSandwichToSandwichUser(action.payload)
          : undefined,
      };
    }

    case "SET_CURRENT_TOPPING": {
      return {
        ...state,
        currentSandwich: state.currentSandwich
          ? modifyToppingUser(state.currentSandwich, action.id, action.number)
          : undefined,
      };
    }

    case "SET_CART": {
      updateCart(action.payload);
      return {
        ...state,
        cart: action.payload,
      };
    }

    case "ADD_TO_CART": {
      const newCart = [...state.cart];
      newCart.push(state.currentSandwich!);
      updateCart(newCart);

      return {
        ...state,
        cart: newCart,
      };
    }

    case "TOGGLE_CART": {
      return {
        ...state,
        openCart: !state.openCart,
      };
    }

    case "REMOVE_ITEM_FROM_CART": {
      const newCart = [...state.cart];
      newCart.splice(action.id, 1);
      updateCart(newCart);

      return {
        ...state,
        cart: newCart,
      };
    }

    case "SET_ORDERS": {
      return {
        ...state,
        orders: action.payload.map((order) => {
          let step = 0;
          switch (order.status) {
            case "Ordered":
              step = 1;
              break;

            case "Received":
              step = 2;
              break;

            case "InQueue":
              step = 3;
              break;

            case "Ready":
              step = 4;
              break;

            case "Failed":
              step = 4;
              break;

            default:
              break;
          }

          return {
            ...order,
            activeStep: step,
          };
        }),
      };
    }

    case "SET_SIGNUP_MESSAGE": {
      return {
        ...state,
        signupMessage: action.payload,
      };
    }

    case "DELETE_ORDER": {
      deleteOrder(action.orderId, Cookies.get("accessToken")?.toString()!);
      const newOrder = state.orders.filter(
        (order) => order._id !== action.orderId
      );
      return {
        ...state,
        orders: newOrder,
      };
    }

    case "ADD_ORDER": {
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export interface StoreStateType {
  openCart: boolean;
  snackOpen: boolean;

  loginMessage: string | null;
  signupMessage: string | null;

  sandwiches: Array<Sandwich>;
  username: string | null;
  snackMessage: string;
  user: User | null;
  currentSandwich: SandwichUser | undefined;
  cart: SandwichUser[];
  orders: Order[];
}

export const initialState: StoreStateType = {
  sandwiches: [],
  loginMessage: null,
  username: null,
  snackOpen: false,
  snackMessage: "",
  user: null,
  currentSandwich: undefined,
  cart: [],
  openCart: false,
  orders: [],
  signupMessage: null,
};
