import {
  Box,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreProvider";
import CloseIcon from "@mui/icons-material/Close";
import { Sandwich } from "../context/reducer";

interface ProductProps {
  id: string;
}

export const Product: React.FC<ProductProps> = ({ id }) => {
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
    <Container
      sx={{
        mt: 15,
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
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          <strong>{sandwich.name}</strong>
        </Typography>

        <Typography variant="h5" sx={{ mb: 2, ml: 1 }}>
          {sandwich.price}€
        </Typography>

        <Typography variant="h5" sx={{ ml: 1 }}>
          <strong>Description: </strong>
          {sandwich.description}
        </Typography>

        <Typography variant="h5" sx={{ mt: 3, ml: 1 }}>
          <strong>Bread type:</strong> {sandwich.breadType}
        </Typography>

        <Typography variant="h5" sx={{ ml: 1, mt: 3 }}>
          <strong>Toping:</strong>
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 5,
            mt: 2,
          }}
        >
          {state.currentSandwich.toppings.map((topping, i) => {
            return (
              <Box
                sx={{ display: "flex", mb: 1, width: "80%" }}
                key={topping.id}
              >
                <Typography variant="h6">{topping.name}</Typography>
                <Typography
                  sx={{ ml: "auto", alignSelf: "flex-end" }}
                  variant="h6"
                >
                  x{topping.number}
                </Typography>
                <ButtonGroup
                  sx={{ ml: "16px", alignSelf: "flex-end" }}
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
        </Box>
        <Button variant="contained" onClick={onAddToCart}>
          Add to cart
        </Button>
      </Box>
    </Container>
  ) : null;
};
