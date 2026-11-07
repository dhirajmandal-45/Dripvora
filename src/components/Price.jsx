import { discountPercent, formatPrice } from "../lib/format";

export default function Price({ product, size = "md" }) {
  const off = discountPercent(product);
  const big = size === "lg";
  return (
    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span className={`font-semibold ${big ? "text-2xl" : "text-[0.95rem]"}`}>{formatPrice(product.price)}</span>
      {off > 0 && (
        <>
          <span className={`text-mute line-through ${big ? "text-base" : "text-[0.8rem]"}`}>{formatPrice(product.mrp)}</span>
          <span className={`text-clay font-semibold ${big ? "text-sm" : "text-[0.75rem]"}`}>{off}% off</span>
        </>
      )}
    </div>
  );
}
