// Backend product -> the shape the UI components use.
import { localProductImage } from "./productImages";

export const PLACEHOLDER_IMAGE = "/art/placeholder.svg";
const NEW_WITHIN_DAYS = 45;

export const adaptProduct = (p) => {
  const base = Number(p.price) || 0;
  const discount = Number(p.discountPercentage) || 0;
  const price = discount > 0 ? Math.round(base * (1 - discount / 100)) : base;
  const image = p.imageUrl || localProductImage(p);
  const ageDays = p.createdAt ? (Date.now() - new Date(p.createdAt).getTime()) / 86_400_000 : Infinity;

  return {
    id: p.id,
    name: p.name,
    description: p.description,
    brand: p.brand,
    type: p.category,                        // e.g. "T-Shirts"  (backend "category")
    category: (p.gender || "").toLowerCase(), // men | women | kids | unisex (backend "gender")
    gender: p.gender,
    price,                                   // selling price after discount
    mrp: discount > 0 ? base : null,         // original price, only when discounted
    discount,
    stock: p.stockQuantity ?? 0,
    sku: p.sku,
    fabric: p.fabric,
    image,
    images: [image],
    active: p.active,
    createdAt: p.createdAt,
    isNew: ageDays <= NEW_WITHIN_DAYS,
  };
};
