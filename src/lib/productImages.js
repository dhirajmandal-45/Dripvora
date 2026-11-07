const LOCAL_PRODUCT_IMAGES = [
  "/art/product-men.svg",
  "/art/product-women.svg",
  "/art/product-kids.svg",
  "/art/product-hoodie.svg",
  "/art/product-shirt.svg",
  "/art/product-pants.svg",
  "/art/product-knit.svg",
  "/art/product-skirt.svg",
];

export function localProductImage(product = {}) {
  const gender = String(product.gender || product.category || "").toLowerCase();
  const type = String(product.type || product.categoryName || product.name || "").toLowerCase();
  if (gender.includes("kid") || type.includes("kid") || type.includes("child")) return LOCAL_PRODUCT_IMAGES[2];
  if (gender.includes("women") || gender.includes("female") || type.includes("dress") || type.includes("skirt")) {
    return type.includes("skirt") ? LOCAL_PRODUCT_IMAGES[7] : LOCAL_PRODUCT_IMAGES[1];
  }
  if (type.includes("hoodie") || type.includes("sweatshirt")) return LOCAL_PRODUCT_IMAGES[3];
  if (type.includes("shirt") || type.includes("tee")) return LOCAL_PRODUCT_IMAGES[4];
  if (type.includes("pant") || type.includes("jean") || type.includes("cargo")) return LOCAL_PRODUCT_IMAGES[5];
  if (type.includes("knit") || type.includes("sweater")) return LOCAL_PRODUCT_IMAGES[6];
  return LOCAL_PRODUCT_IMAGES[0];
}

export function imageFallback(event, product) {
  const image = event.currentTarget;
  if (image.dataset.localFallback === "true") return;
  image.dataset.localFallback = "true";
  image.src = localProductImage(product);
}
