import { StoreContext, StoreProvider } from "./context/StoreProvider";
import { Box } from "@mui/material";
import { Order } from "./components/Order";
import Navbar from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Product } from "./components/Product";
import { StoreMenu } from "./components/StoreMenu";
import {
  BrowserRouter,
  Routes as Router,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";

const OrderPage = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Order />
    </Box>
  );
};

const ProductPage = () => {
  let product = useParams();

  return (
    <Box sx={{ position: "relative" }}>
      <Product id={product.id ? product.id : ""} />
    </Box>
  );
};

const StoreFront = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <StoreMenu />
    </Box>
  );
};

function App() {
  const { state } = useContext(StoreContext);

  return (
    <BrowserRouter>
      <Navbar>
        <Router>
          <Route path="/" element={<StoreFront />} />
          <Route path="/sandwich/:id" element={<ProductPage />} />
          {state.user && <Route path="/orders" element={<OrderPage />} />}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path={`*`} element={<Navigate to={`/`} />}></Route>
        </Router>
      </Navbar>
    </BrowserRouter>
  );
}

export default App;
