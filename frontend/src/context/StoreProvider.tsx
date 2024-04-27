import { createContext, useEffect, useReducer } from "react";
import { reducer, initialState, StoreStateType, Action } from "./reducer";
import { Cookies } from "typescript-cookie";
import service from "../services/login";
import { decodeToken } from "../utils/login";
import { fetchSandwich } from "../services/sandwich";
import { getAllCart } from "../utils/cart";
import { subscribeToOrders } from "../services/socket";
import { fetchAllOrders, fetchOrders } from "../services/orders";

interface StoreContextValue {
  state: StoreStateType;
  dispatch: React.Dispatch<Action>;
}

export const StoreContext = createContext<StoreContextValue>({
  state: initialState,
  dispatch: () => {},
});

interface Props {
  children: React.ReactNode;
}

export const StoreProvider: React.FC<Props> = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const validateCurrentToken = async () => {
    const token = Cookies.get("accessToken")?.toString();
    if (!token || token == undefined) {
      return;
    }
    if (await service.validateToken(token)) {
      return dispatch({ type: "SET_USER", payload: decodeToken(token) });
    }
    return Cookies.remove("accessToken");
  };

  const fetchSandwiches = async () => {
    const sandwiches = await fetchSandwich();
    dispatch({ type: "SET_SANDWICHES", payload: sandwiches });
  };

  const fetchingOrders = async () => {
    const orders = await fetchOrders(Cookies.get("accessToken")?.toString()!);
    dispatch({ type: "SET_ORDERS", payload: orders });
  };

  const fetchingAllOrders = async () => {
    const orders = await fetchAllOrders(
      Cookies.get("accessToken")?.toString()!
    );
    dispatch({ type: "SET_ORDERS", payload: orders });
  };

  useEffect(() => {
    validateCurrentToken();
    fetchSandwiches();
    dispatch({ type: "SET_CART", payload: getAllCart() });
  }, []);

  useEffect(() => {
    let cleanUp = () => {};
    if (state.user !== null) {
      state.user.role == "admin" ? fetchingAllOrders() : fetchingOrders();
      const socket = subscribeToOrders(state.user.name, dispatch);
      cleanUp = () => {
        socket.off(`update-${state.user?.name}`);
        socket.disconnect();
      };
    }

    return cleanUp;
  }, [state.user]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
