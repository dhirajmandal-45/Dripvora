import { api } from "./api";

export const checkout = (shippingAddress) => api.post("/dripvora/orders/checkout", { shippingAddress }).then((r) => r.data);
export const getMyOrders = () => api.get("/dripvora/orders").then((r) => r.data);
export const getMyOrder = (id) => api.get(`/dripvora/orders/${id}`).then((r) => r.data);
export const payForOrder = (orderId) => api.post("/dripvora/payment", { orderId }).then((r) => r.data);
