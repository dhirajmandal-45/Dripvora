import { api } from "./api";

// NOTE: the backend maps the wishlist under "/dripora" (sic) — kept exactly as the controller declares it.
export const getWishlist = () => api.get("/dripora/wishlist").then((r) => r.data);
export const addToWishlist = (productId) => api.post(`/dripora/wishlist/${productId}`).then((r) => r.data);
export const removeFromWishlist = (productId) => api.delete(`/dripora/wishlist/${productId}`);
