import { Box } from "@mui/material";
import { CartDrawer } from "./CartDrawer";
import NavMenu from "./NavMenu";

export default function Navbar({ children }: any) {
  return (
    <Box>
      <NavMenu />
      <CartDrawer />
      {children}
    </Box>
  );
}
