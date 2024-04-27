import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { StoreContext } from "../context/StoreProvider";
import CloseIcon from "@mui/icons-material/Close";
import { makeOrder } from "../services/orders";
import { Cookies } from "typescript-cookie";
import { useNavigate } from "react-router-dom";

export const CartDrawer: React.FC = ({}) => {
  const { state, dispatch } = useContext(StoreContext);
  const navigate = useNavigate();

  let totalPrice = 0;

  const onPlaceOrder = async () => {
    if (state.user === null) {
      dispatch({
        type: "SET_SNACKBAR_MESSAGE",
        payload: "You need to log in to make an order!",
      });
      dispatch({ type: "TOGGLE_CART" });
      navigate("/login");
      return;
    }

    const orders = await makeOrder(
      state.cart,
      Cookies.get("accessToken")?.toString()!
    );

    dispatch({ type: "ADD_ORDER", payload: orders.data });
    dispatch({ type: "SET_CART", payload: [] });
    dispatch({ type: "SET_SNACKBAR_MESSAGE", payload: "Order successful!" });
    dispatch({ type: "TOGGLE_CART" });
  };

  return (
    <Drawer
      anchor="right"
      open={state.openCart}
      onClose={() => dispatch({ type: "TOGGLE_CART" })}
    >
      <Box
        sx={{
          width: 400,
          paddingTop: "100px",
          paddingBottom: "50px",
          paddingLeft: 2,
          paddingRight: 2, 
        }}
        role="presentation"
      >
        <Typography variant="h3" sx={{ mb: 5, color: "#DEAC80" }}>
          <strong>Cart</strong>
        </Typography>
        {state.cart && state.cart.length !== 0 ? state.cart.map((sandwich, i) => {
          let topping = "";
          let numberOfTopping = 0;
          sandwich.toppings.forEach((t) => {
            numberOfTopping += t.number;
            topping +=
              t.number !== 0
                ? (topping !== "" ? "and " : "") +
                  t.number +
                  "x " +
                  t.name +
                  " "
                : "";
          });

          const price = sandwich.price + numberOfTopping * 0.5;
          totalPrice += price;

          return (
            <div key={i}>
              <Typography sx={{ ml: 2, mb: 1, fontSize: "16px" }}>
                <strong>#{i + 1}: {sandwich.name}</strong>{" "}
                {topping !== "" ? "with " + topping : "with no topping"}
              </Typography>
              <Divider />

              <Box sx={{ display: "flex", mb: 5, mt: 1 }}>
                <Button
                  onClick={() =>
                    dispatch({ type: "REMOVE_ITEM_FROM_CART", id: i })
                  }
                >
                <CloseIcon />
                  Remove from order
                </Button>
                <Typography sx={{ ml: "auto", fontSize: "20px" }}>
                  {price.toFixed(2) + " €"}
                </Typography>
              </Box>
            </div>
          );
        }) : <Typography sx={{ml: 1, display: 'flex'}}>
          Cart is empty, go to <Typography sx={{mr: 0.5, ml: 0.5, cursor: 'pointer', color: 'blue'}} onClick={() => {navigate('/')}}>menu</Typography> 
          to add your sandwich(s)</Typography>}

        {state.cart && state.cart.length !== 0 && <Box sx={{ display: "flex", mt: 6, ml: 2, mr: 1 }}>
          <Typography sx={{ fontSize: "22px" }}>
            <strong>Total:</strong>
          </Typography>

          <Typography sx={{ ml: "auto", fontSize: "22px" }}>
            {totalPrice.toFixed(2) + " €"}
          </Typography>
        </Box>}
        

        {state.cart.length !== 0 ? (
          <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignContent: "center"}}>
            <Button onClick={() => onPlaceOrder()} sx={{ mt: 5 }}>
              Place Order
            </Button>
          </Box>
        ) : null}
      </Box>
    </Drawer>
  );
};
