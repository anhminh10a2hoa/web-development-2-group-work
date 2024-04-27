import {
  AppBar,
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import React, { useContext } from "react";
import { StoreContext } from "../context/StoreProvider";
import { Link, useNavigate } from "react-router-dom";
import { Cookies } from "typescript-cookie";

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}
function NavMenu() {
  const { state, dispatch } = useContext(StoreContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onLogout = (): void => {
    Cookies.remove("accessToken");
    dispatch({ type: "SET_USER", payload: null });
    dispatch({ type: "CLEAR_ORDERS" });
    dispatch({ type: "CLEAR_CART" });
    navigate("/");
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ElevationScroll>
      <AppBar
        sx={{
          backgroundColor: "#B5C18E",
        }}
      >
        <Toolbar>
          <React.Fragment>
            <Link to={"/"}>
              <Button>Menu</Button>
            </Link>
            <Link to={state.user ? "/orders" : "/login"}>
              <Button
                onClick={() => {
                  if (!state.user) {
                    dispatch({
                      type: "SET_SNACKBAR_MESSAGE",
                      payload: "You need to log in to view orders!",
                    });
                  }
                }}
              >
                Orders
              </Button>
            </Link>
            <Button onClick={() => dispatch({ type: "TOGGLE_CART" })}>
              Cart {state.cart.length > 0 ? ` (${state.cart.length})` : ""}
            </Button>
            <Box sx={{ flexGrow: 1, textAlign: "end" }}>
              {state.user ? (
                <React.Fragment>
                  <Button onClick={handleClick}>
                    <Typography
                      variant="subtitle2"
                      paddingRight={2}
                      component="span"
                    >
                      {state.user.name}
                    </Typography>
                    <Chip label={state.user.role.toUpperCase()} />
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </Menu>
                </React.Fragment>
              ) : (
                <Link to={"/login"}>
                  <Button>Login</Button>
                </Link>
              )}
            </Box>
          </React.Fragment>
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}

export default NavMenu;
