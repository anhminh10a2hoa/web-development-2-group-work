import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { StoreContext } from '../context/StoreProvider';
import service from '../services/login';
import { AxiosError } from 'axios';
import { decodeToken } from '../utils/login';
import { Cookies } from 'typescript-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { state, dispatch } = React.useContext(StoreContext);
  const navigate = useNavigate();

  const handleSubmit = (e : React.SyntheticEvent) => {  
    e.preventDefault();

    dispatch({ type : "clear-login-message" });

    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };
    const name = target.username.value;
    const password = target.password.value;

    service
      .login({name, password})
      .then(({accessToken}) => {
        Cookies.set('accessToken', accessToken);
        const user = decodeToken(accessToken);
        dispatch({ type : "set-user", payload : user});
        dispatch({ type : "set-snackbar-message", payload : `Welcome back, ${user.name}!`})
        setTimeout(() => {
          navigate('/');
        }, 1000);
      })
      .catch((err : AxiosError) => {
        dispatch({type : "login-failed", payload : "Username or password is incorrect!"})
      })
    
  };

  const handleSignup = (_ : React.SyntheticEvent ) => {
    navigate('/signup');
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography sx={{fontFamily: 'Futura', }} component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        {
          state.loginMessage
          ? <Typography>
              {state.loginMessage}
            </Typography>
          : null
        }

        <Button
          type="submit"
          fullWidth
          variant="contained"
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link sx={{ cursor: "pointer" }} variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link sx={{ cursor: "pointer" }} onClick={handleSignup} variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}



export default Login;
