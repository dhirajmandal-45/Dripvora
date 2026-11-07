import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProductsProvider } from "./context/ProductsContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
              <Toaster
                position="bottom-center"
                toastOptions={{ style: { background: "#111", color: "#f6f3ec", borderRadius: 0, fontSize: "0.875rem", padding: "12px 18px" } }}
              />
            </CartProvider>
          </WishlistProvider>
        </ProductsProvider>
      </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>
);