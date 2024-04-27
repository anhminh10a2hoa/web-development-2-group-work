import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Button, Menu, MenuItem } from '@mui/material';
import { StoreContext } from '../context/StoreProvider';
import { Cookies } from 'typescript-cookie';
import { Link } from 'react-router-dom';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function ElevationScroll(props: Props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function Navbar() {
  const { state, dispatch } = React.useContext(StoreContext);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onLogout = () : void => {
    Cookies.remove('accessToken');
    dispatch({ type : "set-user", payload: null });
    handleClose();
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10
  });

  const handleLogin = () => dispatch({type: "open-login"});

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar sx={{ backgroundColor: trigger ? "rgba(255,255,255,0.7)" : "transparent"}}>
          <Toolbar>
            {
              state.user
              ? <>
                  <Link to={"/"}>
                    Menu
                  </Link>
                  <Button onClick={handleClick}>
                    {state.user.name}
                  </Button>
                  <Button onClick={ () => dispatch({ type : "togle-cart" })}>
                    Cart
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleClose}><Link to={"/orders"}>Orders</Link></MenuItem>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </Menu>
                </>
              : <Button onClick={handleLogin}>Login</Button>
            }
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </React.Fragment>
  );
}