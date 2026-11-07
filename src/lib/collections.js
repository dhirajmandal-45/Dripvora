const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

export const inCollection = (p, collection) => {
  if (["men", "women"].includes(collection)) return p.category === collection || p.category === "unisex";
  if (collection === "kids") return p.category === "kids";
  if (collection === "sale") return p.discount > 0;
  return true;
};

// Products added recently; if nothing is recent, fall back to the 8 newest so the section is never empty.
export const newArrivals = (products) => {
  const fresh = products.filter((p) => p.isNew).sort(byNewest);
  return fresh.length ? fresh : [...products].sort(byNewest).slice(0, 8);
};
