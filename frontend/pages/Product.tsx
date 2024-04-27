import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../src/context/StoreProvider";
import { Sandwich } from "../src/context/reducer";
import { useParams } from "react-router-dom";

export const Product: React.FC = () => {
  const { id } = useParams();

  const { state, dispatch } = useContext(StoreContext);
  const [open, setOpen] = React.useState(false);

  const [sandwich, setSandwich] = useState<Sandwich>();

  useEffect(() => {
    const newSandwich = state.sandwiches.find((s) => s._id === id);
    if (newSandwich) setSandwich({ ...sandwich, ...newSandwich });
    dispatch({ type: "SET_CURRENT_SANDWICH", payload: newSandwich });
  }, [id, state.sandwiches]);

  const onAddToCart = () => {
    setOpen(true);
    dispatch({ type: "ADD_TO_CART" });
    dispatch({ type: "SET_CURRENT_SANDWICH", payload: sandwich });
  };

  const onTopping = (id: number, number: number) => {
    dispatch({
      type: "SET_CURRENT_TOPPING",
      id,
      number,
    });
  };

  return sandwich && state.currentSandwich ? (
    <Box sx={{ mt: 15 }}>
      <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
        <Typography variant="h3" sx={{ mb: 3, color: "#DEAC80" }}>
          <strong>{sandwich.name}</strong>
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Container
          sx={{
            display: "grid",
            gridTemplateColumns: "50% 50%",
            gap: 2,
          }}
        >
          <Box
            component="img"
            sx={{
              height: "50vh",
              objectFit: "cover",
              width: "100%",
            }}
            alt={sandwich.name}
            src={sandwich.image}
          />
          <Box>
          <Typography sx={{ fontSize: "18px", mt: 2 }}>
            {sandwich.description}
          </Typography>
          <Typography sx={{ fontSize: "16px", mt: 2 }}>
            {sandwich.breadType} - {sandwich.price}€
          </Typography>
          <Typography sx={{ fontSize: "16px", mt: 2 }}>
            <strong>Toping:</strong>
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              mt: 2,
              fontSize: "16px"
            }}
          >
            {state.currentSandwich.toppings.map((topping, i) => {
              return (
                <Box
                  sx={{ display: "flex", mb: 1, width: "80%" }}
                  key={topping.id}
                >
                  <Typography>{topping.name}</Typography>
                  <Typography
                    sx={{ ml: "auto" }}
                  >
                    x{topping.number}
                  </Typography>
                  <ButtonGroup
                    sx={{ ml: "auto" }}
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <Button
                      onClick={() => {
                        onTopping(i, -1);
                      }}
                    >
                      -
                    </Button>
                    <Button
                      onClick={() => {
                        onTopping(i, 1);
                      }}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                </Box>
            );
          })}
          <Button onClick={onAddToCart}>Add to cart</Button>
        </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  ) : null;
};
