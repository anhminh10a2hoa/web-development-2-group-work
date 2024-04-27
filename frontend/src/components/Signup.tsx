import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import loginService from '../services/login';
import { StoreContext } from '../context/StoreProvider';
import { useNavigate } from 'react-router-dom';

const RegisterModal = () => {
  const { state, dispatch } = React.useContext(StoreContext);
  const navigate = useNavigate();

  const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const information = {
      name: data.get('username')?.toString(),
      email: data.get('email')?.toString(),
      password: data.get('password')?.toString(),
      repeat_password: data.get('password-repeat')?.toString()
    };

    if (information.password !== information.repeat_password) {
      dispatch({ type : "set-signup-message", payload : "The repeat password does not match the original password. Please re-enter your password."});
      return;
    }
    
    try {
      await loginService.register(information);
      dispatch({ type : "set-signup-message", payload : "Sign up new account success."});
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      // console.log(error.response.data.error.message);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography sx={{fontFamily: 'Futura' }} component="h1" variant="h5">
        Sign up
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
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <Grid container>
          <Grid item xs>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
            />
          </Grid>
          <Grid item>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password-repeat"
              label="Repeat password"
              type="password"
              id="password-repeat"
              autoComplete="new-password"
            />
          </Grid>
        </Grid>
        <Typography>
          {state.signupMessage}
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}



export default RegisterModal;
