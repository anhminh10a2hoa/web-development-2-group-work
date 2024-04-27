import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./context/StoreProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StoreProvider>
    <App />
  </StoreProvider>
);
