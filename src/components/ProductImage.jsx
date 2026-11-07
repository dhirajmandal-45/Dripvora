import { imageFallback } from "../lib/productImages";

export default function ProductImage({ src, product, alt = "", className = "", loading = "lazy", fetchPriority, ...props }) {
  return (
    <img
      src={src || "/art/product-men.svg"}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={(event) => imageFallback(event, product)}
      className={className}
      {...props}
    />
  );
}
