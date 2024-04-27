import { Box, Button, Container, Snackbar, Typography } from "@mui/material";
import React, { useContext } from "react";
import { StoreContext } from "../src/context/StoreProvider";
import { OrderItem } from "../src/components/OrderItem";

export const Order: React.FC = ({}) => {
  const { state, dispatch } = useContext(StoreContext);

  return (
    <Container sx={{ mt: 10, mb: 20 }}>
      <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center", width: "100%", mb: 2 }}>
        <Typography sx={{ fontWeight: "bold", fontSize: "40px", color: "#DEAC80" }}>
          {state.user?.role == "admin" ? "ALL" : "YOUR"} ORDERS
        </Typography>
      </Box>
      <Container>
        {state.orders && state.orders.length !== 0 ? state.orders.map((order) => (
          <OrderItem
            key={order._id}
            orderItem={order}
            onDeleteOrder={() => {
              dispatch({ type: "DELETE_ORDER", orderId: order._id });
              dispatch({
                type: "SET_SNACKBAR_MESSAGE",
                payload: `Successfully deleted order: ${order._id}`,
              });
            }}
          />
        )) : <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}><Typography sx={{fontSize: "18px"}}>The order list is empty.</Typography></Box>}
      </Container>
    </Container>
  );
};
