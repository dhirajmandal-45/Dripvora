import ProductImage from "./ProductImage";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export default function CartDrawer() {
  const { drawerOpen, setDrawerOpen, lines, subtotal, count, setQty, removeItem, busy } = useCart();
  const close = () => setDrawerOpen(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" onClick={close}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Shopping bag"
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col bg-paper"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 h-[4.5rem]">
              <h2 className="display text-3xl">Your bag <span className="text-mute text-xl">({count})</span></h2>
              <button onClick={close} aria-label="Close bag" className="grid h-10 w-10 place-items-center"><X size={22} /></button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag size={42} strokeWidth={1.2} className="text-mute" />
                <p className="display text-3xl">Your bag is empty</p>
                <Link to="/shop/all" onClick={close} className="mt-2 bg-ink px-7 py-3.5 text-sm font-semibold tracking-wide text-paper hover:bg-clay transition-colors">Start shopping</Link>
              </div>
            ) : (
              <>
                <p className="border-b border-ink/10 px-6 py-3 text-sm text-ink-soft">Free shipping on every order.</p>

                <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
                  {lines.map((l) => (
                    <li key={l.key} className="flex gap-4 py-5">
                      <Link to={`/product/${l.product.id}`} onClick={close} className="w-24 shrink-0 bg-bone aspect-[4/5] overflow-hidden">
                        <ProductImage src={l.product.images[0]} product={l.product} alt={l.product.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-3">
                          <Link to={`/product/${l.product.id}`} onClick={close} className="font-medium leading-snug hover:text-clay">{l.product.name}</Link>
                          <button onClick={() => removeItem(l.product.id)} aria-label={`Remove ${l.product.name}`} className="text-mute hover:text-ink"><X size={16} /></button>
                        </div>
                        <p className="mt-1 text-xs text-mute">{l.product.type}</p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-ink/20">
                            <button disabled={busy} className="grid h-8 w-8 place-items-center hover:bg-bone disabled:opacity-30" onClick={() => setQty(l.product.id, l.qty - 1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                            <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{l.qty}</span>
                            <button className="grid h-8 w-8 place-items-center hover:bg-bone disabled:opacity-30" disabled={busy || l.qty >= l.product.stock} onClick={() => setQty(l.product.id, l.qty + 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                          </div>
                          <span className="font-semibold">{formatPrice(l.product.price * l.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-ink/10 p-6">
                  <div className="mb-1 flex justify-between text-[0.95rem]"><span>Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
                  <p className="mb-4 text-xs text-mute">Taxes included. Shipping is free.</p>
                  <Link to="/checkout" onClick={close} className="block bg-ink py-4 text-center text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-clay">Checkout</Link>
                  <Link to="/cart" onClick={close} className="mt-3 block py-2 text-center text-sm font-semibold link-u w-fit mx-auto">View full bag</Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
