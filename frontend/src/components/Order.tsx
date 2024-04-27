import { Button, Container, Snackbar, Typography } from "@mui/material";
import React, { useContext } from "react";
import { StoreContext } from "../context/StoreProvider";
import { OrderItem } from "./OrderItem";

export const Order: React.FC = ({}) => {
  const { state, dispatch } = useContext(StoreContext);

  return (
    <Container sx={{ mt: 15, mb: 20 }}>
      <Typography sx={{ fontWeight: "bold", fontSize: "40px", mb: 5 }}>
        ORDERS
      </Typography>
      <Container>
        {state.orders.map((order) => (
          <OrderItem
            key={order._id}
            orderItem={order}
            onDeleteOrder={() => {
              dispatch({ type: "DELETE_ORDER", orderId: order._id })
              dispatch({ type: "SET_SNACKBAR_MESSAGE", payload: `Successfully deleted order: ${order._id}`})
            }
            }
          />
        ))}
      </Container>
      <Snackbar
        open={state.snackOpen}
        onClose={() => dispatch({ type: "CLOSE_SNACKBAR" })}
        message={state.snackMessage}
      />
    </Container>
  );
};
