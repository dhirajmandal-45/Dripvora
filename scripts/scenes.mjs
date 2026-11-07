// Editorial compositions used by the hero, category tiles and promo banners.
const arch = (fill) => `<path d="M90 1000 V430 Q90 110 400 110 Q710 110 710 430 V1000 Z" fill="${fill}"/>`;
const dot = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

export const SCENES = [
  { slug: "hero-1", bg: "#e3d9c8", back: arch("#cfc1aa") + dot(640, 190, 70, "#b5532f"),
    items: [
      { kind: "dress", color: "#7a1f3d", x: 200, y: 70, s: 0.78 },
      { kind: "jacket", color: "#3d3d3d", x: -70, y: 10, s: 1.02 },
    ] },
  { slug: "hero-2", bg: "#262626", back: arch("#343434") + dot(150, 200, 60, "#b5532f"),
    items: [
      { kind: "cargo", color: "#6b705c", x: 190, y: 90, s: 0.8 },
      { kind: "hoodie", color: "#e9e1d1", x: -80, y: 10, s: 1.0 },
    ] },
  { slug: "hero-3", bg: "#f0dfa8", back: arch("#ead08a") + dot(630, 200, 62, "#e07a5f"),
    items: [
      { kind: "kidhoodie", color: "#e07a5f", x: -110, y: 40, s: 1.15 },
      { kind: "kidtee", color: "#1f3a5f", opts: { graphic: "#f4c95d" }, x: 190, y: 90, s: 0.95 },
    ] },

  { slug: "cat-men", bg: "#dcd6c8", back: arch("#c9c1ae"),
    items: [{ kind: "tee", color: "#6b705c", x: 140, y: 160, s: 0.7 }, { kind: "jacket", color: "#8b5e3c", x: -60, y: 20, s: 1 }] },
  { slug: "cat-women", bg: "#ecd5d1", back: arch("#e0bdb8"),
    items: [{ kind: "skirt", color: "#2f4a3c", x: 170, y: 150, s: 0.7 }, { kind: "dress", color: "#e8c9c1", opts: { dots: "#b5532f" }, x: -60, y: 20, s: 1 }] },
  { slug: "cat-kids", bg: "#f0dfa8", back: arch("#e9cf86"),
    items: [{ kind: "shorts", color: "#5b7fa6", x: 170, y: 160, s: 0.8 }, { kind: "kidhoodie", color: "#e07a5f", x: -60, y: 20, s: 1.05 }] },
  { slug: "cat-new", bg: "#cfd8cd", back: arch("#bcc8ba"),
    items: [{ kind: "hoodie", color: "#d8b4c4", x: 170, y: 120, s: 0.75 }, { kind: "knit", color: "#c9b79c", x: -60, y: 20, s: 1 }] },
  { slug: "cat-sale", bg: "#b5532f", back: arch("#9d4524") + dot(640, 190, 56, "#e8c9a8"),
    items: [{ kind: "dress", color: "#1f6b57", x: 170, y: 90, s: 0.78 }, { kind: "jacket", color: "#3d3d3d", x: -70, y: 20, s: 1 }] },

  { slug: "collection-men", bg: "#d9d6cd", back: arch("#c5c2b7"),
    items: [{ kind: "cargo", color: "#b8ad98", x: 190, y: 100, s: 0.8 }, { kind: "shirt", color: "#c3cdb5", x: -70, y: 10, s: 1 }] },
  { slug: "collection-women", bg: "#e8d6d2", back: arch("#dcc1bc"),
    items: [{ kind: "jeans", color: "#9bb3c9", x: 190, y: 100, s: 0.8 }, { kind: "knit", color: "#6b4b3e", x: -70, y: 10, s: 1 }] },

  { slug: "promo-wide", w: 1600, h: 700, bg: "#b5532f",
    back: `<circle cx="970" cy="350" r="330" fill="#c4643f"/>`,
    items: [
      { kind: "hoodie", color: "#2c3e50", x: 480, y: -150, s: 0.7 },
      { kind: "dress", color: "#efe7df", x: 720, y: -120, s: 0.72 },
      { kind: "cargo", color: "#6b705c", x: 960, y: -150, s: 0.7 },
    ] },
  { slug: "sale-wide", w: 1600, h: 700, bg: "#1f1f1f",
    back: `<circle cx="840" cy="350" r="300" fill="#2c2c2c"/>`,
    items: [
      { kind: "jacket", color: "#8b5e3c", x: 430, y: -150, s: 0.72 },
      { kind: "jeans", color: "#9bb3c9", x: 690, y: -140, s: 0.7 },
      { kind: "dress", color: "#1f6b57", x: 920, y: -140, s: 0.72 },
    ] },

  // Product fallbacks: locally bundled, single-garment artwork used when API images fail.
  { slug: "product-men", bg: "#e5e0d5", back: arch("#d4ccbd"), items: [{ kind: "tee", color: "#343b36", x: 0, y: 70, s: 1.12 }] },
  { slug: "product-women", bg: "#eadbd7", back: arch("#ddc5bf"), items: [{ kind: "dress", color: "#713c4b", x: 0, y: 15, s: 1.04 }] },
  { slug: "product-kids", bg: "#f0e2bd", back: arch("#e4cf9e"), items: [{ kind: "kidhoodie", color: "#d7795c", x: 0, y: 40, s: 1.12 }] },
  { slug: "product-hoodie", bg: "#d8d9d4", back: arch("#c2c7c0"), items: [{ kind: "hoodie", color: "#697465", x: 0, y: 5, s: 1.08 }] },
  { slug: "product-shirt", bg: "#e7dfd2", back: arch("#d8cbbb"), items: [{ kind: "shirt", color: "#c9c5b7", x: 0, y: 15, s: 1.05 }] },
  { slug: "product-pants", bg: "#d8dfe2", back: arch("#c1cdd2"), items: [{ kind: "cargo", color: "#626e62", x: 0, y: 5, s: 1.08 }] },
  { slug: "product-knit", bg: "#e7ddd2", back: arch("#d8c8b8"), items: [{ kind: "knit", color: "#9a7968", x: 0, y: 15, s: 1.06 }] },
  { slug: "product-skirt", bg: "#e9d8d5", back: arch("#d9c0bd"), items: [{ kind: "skirt", color: "#3e594b", x: 0, y: 30, s: 1.08 }] },
];
