import { api } from "./api";

export const getReviews = (productId) => api.get(`/dripvora/reviews/product/${productId}`).then((r) => r.data);
export const addReview = (productId, rating, comment) =>
  api.post(`/dripvora/reviews/${productId}`, { rating, comment }).then((r) => r.data);
