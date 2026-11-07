import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Minus, Plus, RotateCcw, Truck } from "lucide-react";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { discountPercent } from "../lib/format";
import { inCollection } from "../lib/collections";
import Price from "../components/Price";
import ProductImage from "../components/ProductImage";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import Reviews, { Stars, useReviews } from "../components/Reviews";

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-ink/10">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold uppercase tracking-[0.12em]">
        {title} <ChevronDown size={18} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="pb-5 text-sm leading-relaxed text-ink-soft">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetails() {
  const { slug } = useParams(); // the route param holds the product id
  return <ProductView key={slug} id={slug} />; // remount per product so quantity etc. reset
}

function ProductView({ id }) {
  const { products, getById, loading } = useProducts();
  const product = getById(id);
  const { addItem, busy } = useCart();
  const wish = useWishlist();
  const navigate = useNavigate();
  const { reviews, average, reload } = useReviews(id);

  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(null);

  const related = useMemo(() => {
    if (!product) return [];
    const same = products.filter((p) => p.id !== product.id && p.category === product.category);
    const pool = same.length >= 4 ? same : products.filter((p) => p.id !== product.id && inCollection(p, product.category));
    return [...pool].sort((a, b) => Number(b.type === product.type) - Number(a.type === product.type)).slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="display text-6xl">{loading ? "Loading…" : "Piece not found"}</h1>
        {!loading && (
          <>
            <p className="mt-4 text-mute">This item may have sold out or been removed.</p>
            <Link to="/shop/all" className="mt-8 inline-block bg-ink px-8 py-4 text-sm font-semibold text-paper hover:bg-clay transition-colors">Back to shop</Link>
          </>
        )}
      </div>
    );
  }

  const off = discountPercent(product);
  const liked = wish.has(product.id);
  const soldOut = product.stock < 1;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const add = () => addItem(product, { qty });
  const buyNow = async () => {
    const ok = await addItem(product, { qty }, { openDrawer: false });
    if (ok) navigate("/checkout");
  };

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <>
      <div className="container-x py-6 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-mute">
          <Link to="/" className="hover:text-ink">Home</Link> <span className="mx-1.5">/</span>
          {["men", "women", "kids"].includes(product.category) && (<><Link to={`/shop/${product.category}`} className="capitalize hover:text-ink">{product.category}</Link> <span className="mx-1.5">/</span></>)}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          {/* gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse gap-4 md:flex-row">
            {product.images.length > 1 && (
              <div className="flex gap-3 md:flex-col">
                {product.images.map((src, i) => (
                  <button key={src + i} className="aspect-[4/5] w-16 overflow-hidden bg-bone ring-2 ring-ink ring-offset-2 ring-offset-paper md:w-20">
                    <ProductImage src={src} product={product} alt={`${product.name} view ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex-1 overflow-hidden bg-bone aspect-[4/5] cursor-zoom-in" onMouseMove={onMove} onMouseLeave={() => setZoom(null)}>
              <ProductImage src={product.image} product={product} alt={product.name} className="h-full w-full object-cover transition-transform duration-200"
                style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
              {off > 0 && <span className="absolute left-4 top-4 bg-clay px-2.5 py-1 text-xs font-bold tracking-wider text-paper">-{off}%</span>}
            </div>
          </div>

          {/* info */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-mute">{product.brand}</p>
              <h1 className="display mt-2 text-5xl md:text-6xl">{product.name}</h1>

              {reviews.length > 0 && (
                <a href="#reviews-title" className="mt-4 flex items-center gap-3 text-sm">
                  <Stars value={average} />
                  <span className="font-semibold">{average.toFixed(1)}</span>
                  <span className="text-mute">({reviews.length} review{reviews.length > 1 ? "s" : ""})</span>
                </a>
              )}

              <div className="mt-5"><Price product={product} size="lg" /></div>
              <p className="mt-1 text-xs text-mute">Inclusive of all taxes</p>

              <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>

              <p className={`mt-7 flex items-center gap-2 text-sm font-medium ${soldOut || lowStock ? "text-clay" : "text-ok"}`}>
                <span className={`h-2 w-2 rounded-full ${soldOut || lowStock ? "bg-clay" : "bg-ok"}`} />
                {soldOut ? "Out of stock" : lowStock ? `Only ${product.stock} left` : "In stock — ships in 1–2 days"}
              </p>

              <div className="mt-6 flex gap-3">
                <div className="flex items-center border border-ink/25">
                  <button className="grid h-14 w-12 place-items-center hover:bg-bone" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={16} /></button>
                  <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
                  <button className="grid h-14 w-12 place-items-center hover:bg-bone" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity"><Plus size={16} /></button>
                </div>
                <button disabled={soldOut || busy} onClick={add} className="flex-1 bg-ink text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-clay disabled:bg-mute">
                  {soldOut ? "Sold out" : "Add to bag"}
                </button>
                <button onClick={() => wish.toggle(product)} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={liked}
                  className="grid h-14 w-14 place-items-center border border-ink/25 transition hover:border-ink">
                  <Heart size={20} className={liked ? "fill-clay stroke-clay" : ""} />
                </button>
              </div>
              <button disabled={soldOut || busy} onClick={buyNow} className="mt-3 h-14 w-full border border-ink text-sm font-semibold tracking-wide transition-colors hover:bg-ink hover:text-paper disabled:opacity-40">
                Buy now
              </button>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-ink-soft">
                <p className="flex items-center gap-2"><Truck size={16} className="text-clay" />Free shipping</p>
                <p className="flex items-center gap-2"><RotateCcw size={16} className="text-clay" />30-day easy returns</p>
              </div>

              <div className="mt-8 border-b border-ink/10">
                <Accordion title="Product details" defaultOpen>
                  <dl className="grid grid-cols-[7rem_1fr] gap-y-2.5">
                    <dt className="text-mute">Brand</dt><dd>{product.brand}</dd>
                    <dt className="text-mute">Category</dt><dd>{product.type}</dd>
                    <dt className="text-mute">Gender</dt><dd>{product.gender}</dd>
                    <dt className="text-mute">Fabric</dt><dd>{product.fabric}</dd>
                    <dt className="text-mute">SKU</dt><dd>{product.sku}</dd>
                    <dt className="text-mute">Availability</dt><dd>{soldOut ? "Out of stock" : `${product.stock} in stock`}</dd>
                  </dl>
                </Accordion>
                <Accordion title="Care">Machine wash cold with like colours. Do not bleach. Tumble dry low or line dry. Iron on low heat if needed.</Accordion>
                <Accordion title="Shipping & returns">Orders ship within 1–2 working days and arrive in 3–6 days. Return unworn items with tags within 30 days for a full refund or exchange.</Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Reviews productId={product.id} reviews={reviews} onChanged={reload} />

      {related.length > 0 && (
        <section className="container-x pt-16 md:pt-24">
          <SectionHeading eyebrow="Pair it with" title="You may also" italic="like" to={`/shop/${["men", "women", "kids"].includes(product.category) ? product.category : "all"}`} linkLabel="View more" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
