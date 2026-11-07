import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adaptProduct } from "../lib/adapters";
import * as productService from "../services/productService";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const list = await productService.getActiveProducts();
      setProducts(list.map(adaptProduct));
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const value = useMemo(
    () => ({
      products, loading, error,
      reload: () => { setLoading(true); return fetchAll(); },
      getById: (id) => products.find((p) => String(p.id) === String(id)),
    }),
    [products, loading, error, fetchAll]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => useContext(ProductsContext);
