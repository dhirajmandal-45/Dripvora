import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adaptProduct } from "../lib/adapters";
import * as cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const EMPTY = { items: [] };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load the server cart whenever the signed-in user changes.
  useEffect(() => {
    if (!user) { setCart(EMPTY); return; }
    let cancelled = false;
    cartService.getCart()
      .then((c) => { if (!cancelled) setCart(c); })
      .catch((e) => toast.error(e.message));
    return () => { cancelled = true; };
  }, [user]);

  const run = useCallback(async (fn, { open = false } = {}) => {
    setBusy(true);
    try {
      setCart(await fn());
      if (open) setDrawerOpen(true);
      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const requireLogin = useCallback(() => {
    if (user) return false;
    toast("Please sign in to use your bag");
    navigate("/login", { state: { from: location.pathname } });
    return true;
  }, [user, navigate, location.pathname]);

  const addItem = (product, { qty = 1 } = {}, { openDrawer = true } = {}) => {
    if (requireLogin()) return Promise.resolve(false);
    return run(() => cartService.addToCart(product.id, qty), { open: openDrawer });
  };
  const setQty = (productId, qty) =>
    qty < 1 ? removeItem(productId) : run(() => cartService.updateCartItem(productId, qty));
  const removeItem = (productId) => run(() => cartService.removeCartItem(productId));
  const clear = async () => { try { await cartService.clearCart(); } catch { /* ignore */ } setCart(EMPTY); };
  const refresh = async () => { if (user) setCart(await cartService.getCart()); };

  const lines = useMemo(
    () => (cart.items || []).map((i) => ({ key: i.product.id, qty: i.quantity, product: adaptProduct(i.product) })),
    [cart]
  );

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const mrpTotal = lines.reduce((n, l) => n + (l.product.mrp || l.product.price) * l.qty, 0);
  const savings = mrpTotal - subtotal;
  const total = subtotal; // the backend adds no shipping fee

  return (
    <CartContext.Provider value={{ lines, count, subtotal, savings, shipping: 0, total, busy, addItem, setQty, removeItem, clear, refresh, drawerOpen, setDrawerOpen }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
