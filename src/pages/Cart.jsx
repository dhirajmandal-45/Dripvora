import ProductImage from "../components/ProductImage";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import OrderSummary from "../components/OrderSummary";

export default function Cart() {
  const { lines, setQty, removeItem, busy } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container-x flex flex-col items-center py-28 text-center">
        <ShoppingBag size={52} strokeWidth={1.1} className="text-mute" />
        <h1 className="display mt-6 text-6xl">Your bag is empty</h1>
        <p className="mt-3 text-mute">Looks like you haven't added anything yet.</p>
        <Link to="/shop/all" className="mt-8 bg-ink px-9 py-4 text-sm font-semibold text-paper transition-colors hover:bg-clay">Discover the collection</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-16">
      <h1 className="display text-6xl md:text-7xl">Shopping <em className="font-normal italic">bag</em></h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4 py-6 md:gap-6">
                <Link to={`/product/${l.product.id}`} className="w-28 shrink-0 overflow-hidden bg-bone aspect-[4/5] md:w-36">
                  <ProductImage src={l.product.image} product={l.product} alt={l.product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.16em] text-mute">{l.product.brand}</p>
                      <Link to={`/product/${l.product.id}`} className="mt-1 block text-lg font-medium hover:text-clay">{l.product.name}</Link>
                      <p className="mt-1 text-sm text-mute">{l.product.type}</p>
                    </div>
                    <button onClick={() => removeItem(l.product.id)} disabled={busy} aria-label={`Remove ${l.product.name}`} className="h-fit text-mute hover:text-ink"><X size={18} /></button>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-4">
                    <div className="flex items-center border border-ink/25">
                      <button disabled={busy} className="grid h-10 w-10 place-items-center hover:bg-bone disabled:opacity-30" onClick={() => setQty(l.product.id, l.qty - 1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                      <span className="w-9 text-center font-semibold" aria-live="polite">{l.qty}</span>
                      <button className="grid h-10 w-10 place-items-center hover:bg-bone disabled:opacity-30" disabled={busy || l.qty >= l.product.stock} onClick={() => setQty(l.product.id, l.qty + 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{formatPrice(l.product.price * l.qty)}</p>
                      {l.qty > 1 && <p className="text-xs text-mute">{formatPrice(l.product.price)} each</p>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/shop/all" className="mt-6 inline-block text-sm font-semibold link-u">← Continue shopping</Link>
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-bone p-6 md:p-8 lg:sticky lg:top-28">
            <h2 className="display text-3xl mb-5">Order summary</h2>
            <OrderSummary />
            <Link to="/checkout" className="mt-6 block bg-ink py-4 text-center text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-clay">Proceed to checkout</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
