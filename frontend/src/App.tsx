import { StoreProvider } from "./context/StoreProvider";
import { Box } from '@mui/material';
import { Order } from './components/Order';
import Navbar from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import Login from './components/Login';
import Signup from './components/Signup';
import { Product } from './components/Product';
import { StoreMenu } from "./components/StoreMenu";
import { BrowserRouter, Routes as Router, Route, useParams } from "react-router-dom";

const OrderPage = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Navbar />
      <CartDrawer/>
      <Order/>
    </Box>
  );
}

const ProductPage = () => {
  let product = useParams();
  
  return (
    <Box sx={{ position: "relative" }}>
      <Navbar />
      <CartDrawer/>
      <Product id={product.id ? product.id : ""}/>
    </Box>
  );
}

const StoreFront = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Navbar />
      <CartDrawer/>
      <StoreMenu />
    </Box>
  );
};

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Router>
          <Route path="/" element={ <StoreFront/> }/>
          <Route path="/sandwich/:id" element={ <ProductPage/>}/>
          <Route path="/orders" element={ <OrderPage/>}/>
          <Route path="/login" element={ <Login />}/>
          <Route path="/signup" element={ <Signup />}/>
        </Router>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
