import { Box, Snackbar } from "@mui/material";
import { CartDrawer } from "./CartDrawer";
import NavMenu from "./NavMenu";
import { useContext } from "react";
import { StoreContext } from "../context/StoreProvider";

export default function Navbar({ children }: any) {
  const { state, dispatch } = useContext(StoreContext);

  return (
    <Box>
      <NavMenu />
      <CartDrawer />
      {children}
      <Snackbar
        open={state.snackOpen}
        onClose={() => dispatch({ type: "CLOSE_SNACKBAR" })}
        message={state.snackMessage}
      />
    </Box>
  );
}
