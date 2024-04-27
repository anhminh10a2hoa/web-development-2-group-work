import { Container, Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { StoreContext } from "../context/StoreProvider";
import { SandwichCard } from "./SandwichCard";

export const StoreMenu: React.FC = ({}) => {
  const { state, dispatch } = useContext(StoreContext);

  return (
    <Container sx={{ mt: 10, mb: 20 }}>
      <Box sx={{ display: "flex", justifyContent: "center", alignContent: "center", width: "100%", mb: 2 }}>
        <Typography sx={{ fontWeight: "bold", fontSize: "40px", color: "#DEAC80" }}>
          SANDWICH MENU
        </Typography>
      </Box>
      <Container
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {state.sandwiches.map((sandwich) => (
          <SandwichCard key={sandwich._id} item={sandwich} />
        ))}
      </Container>
    </Container>
  );
};
