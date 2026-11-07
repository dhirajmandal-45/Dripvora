// Fields the backend's Product entity accepts. Always send all of them: the update endpoint
// compares `active`, so omitting it would silently hide the product.
export const toProductPayload = (p) => ({
  name: p.name,
  description: p.description,
  price: Number(p.price),
  discountPercentage: Number(p.discountPercentage) || 0,
  category: p.category,
  brand: p.brand,
  gender: p.gender,
  stockQuantity: Number(p.stockQuantity),
  sku: p.sku,
  fabric: p.fabric,
  active: Boolean(p.active),
});
