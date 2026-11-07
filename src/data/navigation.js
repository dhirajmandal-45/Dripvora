export const NAV = [
  { label: "Home", to: "/", end: true },
  { label: "Men", to: "/shop/men", mega: "men" },
  { label: "Women", to: "/shop/women", mega: "women" },
  { label: "Kids", to: "/shop/kids", mega: "kids" },
  { label: "New Arrivals", to: "/shop/new-arrivals" },
  { label: "Sale", to: "/shop/sale", accent: true },
];

export const COLLECTIONS = {
  all: { title: "All", italic: "products", blurb: "Everything DripVora, in one place." },
  men: { title: "Men's", italic: "collection", blurb: "Considered basics, utility layers and sharp everyday pieces.", art: "/art/product-men.svg" },
  women: { title: "Women's", italic: "collection", blurb: "Fluid dresses, soft knits and tailoring with attitude.", art: "/art/product-women.svg" },
  kids: { title: "Kids'", italic: "collection", blurb: "Soft, tough, and made to be played in.", art: "/art/product-kids.svg" },
  "new-arrivals": { title: "New", italic: "arrivals", blurb: "Fresh off the rail — this season's latest drops.", art: "/art/product-knit.svg" },
  sale: { title: "The", italic: "sale", blurb: "Our favourite pieces, at prices worth the wait.", art: "/art/product-skirt.svg" },
};
