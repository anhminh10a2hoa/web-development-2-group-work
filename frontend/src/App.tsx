import { StoreContext, StoreProvider } from "./context/StoreProvider";
import { Box } from "@mui/material";
import { Order } from "../pages/Order";
import Navbar from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { Product } from "../pages/Product";
import { StoreMenu } from "../pages/StoreMenu";
import {
  BrowserRouter,
  Routes as Router,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";

function App() {
  const { state } = useContext(StoreContext);

  return (
    <BrowserRouter>
      {state.isReady && (
        <Navbar>
          <Router>
            <Route path="/" element={<StoreMenu />} />
            <Route path="/sandwich/:id" element={<Product />} />
            {state.user && <Route path="/orders" element={<Order />} />}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path={`*`} element={<Navigate to={`/`} />}></Route>
          </Router>
        </Navbar>
      )}
    </BrowserRouter>
  );
}

export default App;
