import { api } from "./api";

export const getCart = () => api.get("/dripvora/cart").then((r) => r.data);
export const addToCart = (productId, quantity) => api.post("/dripvora/cart/items", { productId, quantity }).then((r) => r.data);
export const updateCartItem = (productId, quantity) => api.put(`/dripvora/cart/items/${productId}`, null, { params: { quantity } }).then((r) => r.data);
export const removeCartItem = (productId) => api.delete(`/dripvora/cart/items/${productId}`).then((r) => r.data);
export const clearCart = () => api.delete("/dripvora/cart");
