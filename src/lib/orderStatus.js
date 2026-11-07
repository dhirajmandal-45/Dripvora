import { localProductImage } from "./productImages";
// Statuses accepted by the backend (OrderService.status).
export const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

// The happy path shown as a progress tracker.
export const ORDER_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

export const statusLabel = (s) => (s || "").toLowerCase().replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export const statusStyle = (s) =>
  s === "CANCELLED" ? "bg-clay text-paper" : s === "DELIVERED" ? "bg-ok text-paper" : "bg-ink text-paper";

export const orderImage = (item) => item.product?.imageUrl || localProductImage(item.product || item);
