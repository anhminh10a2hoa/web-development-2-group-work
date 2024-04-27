import {
  AppBar,
  Button,
  Menu,
  MenuItem,
  Toolbar,
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
    navigate("/");
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  return (
    <ElevationScroll>
      <AppBar
        sx={{
          backgroundColor: trigger ? "rgba(255,255,255,0.7)" : "transparent",
        }}
      >
        <Toolbar>
          {state.user ? (
            <>
              <Button>
                <Link to={"/"}>Menu</Link>
              </Button>
              <Button onClick={handleClick}>{state.user.name}</Button>
              <Button onClick={() => dispatch({ type: "TOGGLE_CART" })}>
                Cart
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
                <MenuItem onClick={handleClose}>
                  <Link to={"/orders"}>Orders</Link>
                </MenuItem>
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button>
              <Link to={"/login"}>Login</Link>
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}

export default NavMenu;
