import { api } from "./api";

// Paths are exactly as the Spring controllers declare them. Two controllers use the
// spelling "/dripora/admin" (without the "v"); products and users live under "/dripvora/admin".

/* dashboard */
export const getDashboard = () => api.get("/dripora/admin/dashboard").then((r) => r.data);

/* products (multipart: `product` = JSON string, `image` = file) */
export const getAllProducts = () => api.get("/dripvora/products").then((r) => r.data);

const productForm = (product, image) => {
  const form = new FormData();
  form.append("product", JSON.stringify(product));
  if (image) form.append("image", image);
  return form;
};
export const createProduct = (product, image) =>
  api.post("/dripvora/admin/products", productForm(product, image)).then((r) => r.data);
export const updateProduct = (id, product, image) =>
  api.put(`/dripvora/admin/products/${id}`, productForm(product, image)).then((r) => r.data);
export const deleteProduct = (id) => api.delete(`/dripvora/admin/products/${id}`).then((r) => r.data);

/* categories */
export const createCategory = (payload) => api.post("/dripora/admin/categories", payload).then((r) => r.data);
export const updateCategory = (id, payload) => api.put(`/dripora/admin/categories/${id}`, payload).then((r) => r.data);
export const deleteCategory = (id) => api.delete(`/dripora/admin/categories/${id}`);

/* orders */
export const getAllOrders = () => api.get("/dripora/admin/orders").then((r) => r.data);
export const updateOrderStatus = (id, status) =>
  api.put(`/dripora/admin/orders/${id}/status`, null, { params: { status } }).then((r) => r.data);

/* customers */
export const getUsers = () => api.get("/dripvora/admin/users").then((r) => r.data);
export const setUserActive = (id, active) => api.patch(`/dripvora/admin/users/${id}/status`, null, { params: { active } });
export const promoteUser = (id) => api.patch(`/dripvora/admin/users/${id}/promote`);
