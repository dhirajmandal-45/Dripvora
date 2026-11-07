import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Price from "./Price";
import ProductImage from "./ProductImage";
import { discountPercent } from "../lib/format";

export default function ProductCard({ product, priority = false }) {
  const { addItem, busy } = useCart();
  const wish = useWishlist();
  const off = discountPercent(product);
  const liked = wish.has(product.id);
  const soldOut = product.stock < 1;
  const href = `/product/${product.id}`;

  return (
    <article className="group relative">
      <div className="relative overflow-hidden bg-bone aspect-[4/5]">
        <Link to={href} className="block h-full" aria-label={product.name}>
          <ProductImage
            src={product.image} product={product} alt={product.name} loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          {off > 0 && <span className="bg-clay text-paper text-[0.65rem] font-bold tracking-wider px-2 py-1">-{off}%</span>}
          {product.isNew && <span className="bg-ink text-paper text-[0.65rem] font-bold tracking-[0.15em] px-2 py-1">NEW</span>}
        </div>

        <button
          onClick={() => wish.toggle(product)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={liked}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 backdrop-blur transition hover:scale-110 hover:bg-paper"
        >
          <Heart size={17} className={liked ? "fill-clay stroke-clay" : ""} />
        </button>

        {!soldOut ? (
          <button
            onClick={() => addItem(product, { qty: 1 })} disabled={busy}
            aria-label={`Add ${product.name} to bag`}
            className="absolute right-3 bottom-3 grid h-10 w-10 place-items-center rounded-full bg-ink text-paper transition duration-300 hover:bg-clay md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 focus-visible:opacity-100 disabled:opacity-50"
          >
            <Plus size={18} />
          </button>
        ) : (
          <div className="absolute inset-x-0 bottom-0 bg-ink/80 text-paper text-center text-xs font-semibold tracking-widest py-2">SOLD OUT</div>
        )}
      </div>

      <div className="pt-3.5">
        <p className="text-[0.68rem] uppercase tracking-[0.16em] text-mute">{product.brand}</p>
        <Link to={href} className="mt-1 block text-[0.95rem] font-medium leading-snug hover:text-clay transition-colors">{product.name}</Link>
        <div className="mt-1.5"><Price product={product} /></div>
      </div>
    </article>
  );
}
