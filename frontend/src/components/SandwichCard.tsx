import React from "react";
import { Sandwich } from "../context/reducer";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

interface SandwichCardProps {
  item: Sandwich;
}

export const SandwichCard: React.FC<SandwichCardProps> = ({ item }) => {
  return (
    <Card sx={{ width: "100%", maxWidth: 350, flexGrow: 1 }}>
      <CardMedia sx={{ height: 140 }} image={item.image} title={item.name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
