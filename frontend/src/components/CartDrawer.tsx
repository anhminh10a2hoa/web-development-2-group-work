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
          width: 500,
          paddingTop: "50px",
          paddingBottom: "150px",
          ml: 4,
          mr: 4,
        }}
        role="presentation"
      >
        <Typography variant="h2" sx={{ mb: 5 }}>
          <strong>Cart</strong>
        </Typography>
        {state.cart.map((sandwich, i) => {
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
              <Typography variant="h5" sx={{ ml: 2, mb: 1 }}>
                <strong>{sandwich.name}</strong>{" "}
                {topping !== "" ? "with " + topping : "with no topping"}
              </Typography>
              <Divider />

              <Container sx={{ display: "flex", mb: 5, mt: 1 }}>
                <Button
                  onClick={() =>
                    dispatch({ type: "REMOVE_ITEM_FROM_CART", id: i })
                  }
                >
                  <CloseIcon />
                  Remove
                </Button>
                <Typography variant="h5" sx={{ ml: "auto" }}>
                  {price.toFixed(2) + " €"}
                </Typography>
              </Container>
            </div>
          );
        })}

        <Container sx={{ display: "flex", mt: 8 }}>
          <Typography variant="h4">
            <strong>Total:</strong>
          </Typography>

          <Typography variant="h4" sx={{ ml: "auto" }}>
            {totalPrice.toFixed(2) + " €"}
          </Typography>
        </Container>

        {state.cart.length !== 0 ? (
          <Button onClick={() => onPlaceOrder()} sx={{ mt: 5 }}>
            Place Order
          </Button>
        ) : null}
      </Box>
    </Drawer>
  );
};
