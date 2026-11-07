import { api } from "./api";

export const getActiveProducts = () => api.get("/dripvora/products/active").then((r) => r.data);
export const getCategories = () => api.get("/dripvora/categories").then((r) => r.data);
