import React from "react";
import { Order } from "../context/reducer";
import {
  Typography,
  Button,
  Container,
  Divider,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItemText,
} from "@mui/material";

interface OrderItemProps {
  orderItem: Order;
  onDeleteOrder: React.MouseEventHandler<HTMLButtonElement>;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  orderItem,
  onDeleteOrder,
}) => {
  return (
    <Container sx={{ mb: 3 }}>
      <Typography>
        <strong>Id: </strong>
        {orderItem._id}
      </Typography>

      <Typography sx={{ mt: 2 }}>
        <strong>Customer: </strong>
        {orderItem.customerName}
        {" "}-{" "}
        {orderItem.customerId}
      </Typography>

      <Typography sx={{ mt: 2 }}>
        
      </Typography>

      <Typography sx={{ mt: 2 }}>
        <strong>Status: </strong>
      </Typography>

      <Stepper sx={{ mt: 2 }} activeStep={orderItem.activeStep}>
        <Step>
          <StepLabel>Order</StepLabel>
          <Typography variant="subtitle1">
            {new Date(orderItem.time.orderTime).toLocaleTimeString()}
          </Typography>
        </Step>
        <Step>
          <StepLabel>Receive order</StepLabel>
          {orderItem.activeStep >= 2 ? (
            <Typography>
              {new Date(orderItem.time.receiveOrderTime).toLocaleTimeString()}
            </Typography>
          ) : null}
        </Step>
        <Step>
          <StepLabel>In queue</StepLabel>
          {orderItem.activeStep >= 3 ? (
            <Typography>
              {new Date(orderItem.time.inQueueTime).toLocaleTimeString()}
            </Typography>
          ) : null}
        </Step>

        <Step>
          <StepLabel>
            {orderItem.status === "Ready"
              ? "Ready!"
              : orderItem.status === "Failed"
              ? "Failed!"
              : "Ready / Failed"}
          </StepLabel>
          {orderItem.activeStep >= 4 ? (
            <Typography>
              {new Date(orderItem.time.doneTime).toLocaleTimeString()}
            </Typography>
          ) : null}
        </Step>
      </Stepper>

      <Typography sx={{ mt: 2 }}>
        <strong>Items: </strong>
      </Typography>
      <Container>
        <List>
          {orderItem.items.map((item) => {
            const toppingString = item.toppings.reduce(
              (a, c) =>
                c.number !== 0 ? (a += c.number + "X " + c.name + " ") : "",
              ""
            );
            return (
              <ListItemText
                key={item._id}
                primary={item.name}
                secondary={
                  toppingString === ""
                    ? "Without topping"
                    : "With " + toppingString
                }
              />
            );
          })}
        </List>
      </Container>

      <Typography sx={{ mt: 2 }}>
        <strong>Total price: </strong>
        {orderItem.orderPrice.toFixed(2) + "€"}
      </Typography>

      <Button onClick={onDeleteOrder} sx={{ mt: 1 }}>
        Delete order
      </Button>

      <Divider style={{ marginTop: 40 }} />
    </Container>
  );
};
