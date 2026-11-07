import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adaptProduct } from "../lib/adapters";
import * as wishlistService from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]); // [{ id, product }]

  useEffect(() => {
    if (!user) { setItems([]); return; }
    let cancelled = false;
    wishlistService.getWishlist()
      .then((list) => { if (!cancelled) setItems(list); })
      .catch((e) => toast.error(e.message));
    return () => { cancelled = true; };
  }, [user]);

  const ids = useMemo(() => items.map((i) => i.product.id), [items]);
  const products = useMemo(() => items.map((i) => adaptProduct(i.product)), [items]);

  const toggle = async (product) => {
    if (!user) {
      toast("Sign in to save items to your wishlist");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    try {
      if (ids.includes(product.id)) {
        await wishlistService.removeFromWishlist(product.id);
        setItems((cur) => cur.filter((i) => i.product.id !== product.id));
        toast("Removed from wishlist", { icon: "♡" });
      } else {
        const saved = await wishlistService.addToWishlist(product.id);
        setItems((cur) => [...cur, saved]);
        toast("Saved to wishlist", { icon: "♥" });
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <WishlistContext.Provider value={{ ids, products, count: ids.length, has: (id) => ids.includes(id), toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);
