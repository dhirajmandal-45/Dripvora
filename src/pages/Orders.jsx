import ProductImage from "../components/ProductImage";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { PackageOpen } from "lucide-react";
import { getMyOrders, payForOrder } from "../services/orderService";
import { formatDate, formatPrice } from "../lib/format";
import { ORDER_STEPS, orderImage, statusLabel, statusStyle } from "../lib/orderStatus";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(null);

  const load = useCallback(() => getMyOrders().then(setOrders).catch((e) => setError(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const pay = async (id) => {
    setPaying(id);
    try { await payForOrder(id); toast.success("Payment received"); await load(); }
    catch (e) { toast.error(e.message); }
    finally { setPaying(null); }
  };

  return (
    <div className="container-x max-w-4xl py-10 md:py-16">
      <h1 className="display text-6xl md:text-7xl">My <em className="font-normal italic">orders</em></h1>

      {error && <p className="mt-8 text-clay" role="alert">{error}</p>}
      {!orders && !error && <div className="mt-10 space-y-6" aria-busy="true">{[0, 1].map((i) => <div key={i} className="h-48 animate-pulse bg-bone" />)}</div>}

      {orders?.length === 0 && (
        <div className="py-24 text-center">
          <PackageOpen size={48} strokeWidth={1.1} className="mx-auto text-mute" />
          <p className="display mt-5 text-4xl">No orders yet</p>
          <Link to="/shop/all" className="mt-7 inline-block bg-ink px-8 py-4 text-sm font-semibold text-paper hover:bg-clay transition-colors">Start shopping</Link>
        </div>
      )}

      <ul className="mt-10 space-y-6">
        {orders?.map((o) => {
          const step = ORDER_STEPS.indexOf(o.orderStatus);
          return (
            <li key={o.id} className="border border-ink/10">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-bone px-5 py-4 text-sm">
                <div><p className="eyebrow text-mute">Order</p><p className="font-semibold">#{o.orderNumber}</p></div>
                <div><p className="eyebrow text-mute">Placed</p><p>{formatDate(o.createdAt)}</p></div>
                <div><p className="eyebrow text-mute">Total</p><p className="font-semibold">{formatPrice(o.totalAmount)}</p></div>
                <div><p className="eyebrow text-mute">Payment</p><p className={o.paymentStatus === "PAID" ? "font-semibold text-ok" : ""}>{statusLabel(o.paymentStatus)}</p></div>
                <span className={`px-3 py-1 text-xs font-bold tracking-wider ${statusStyle(o.orderStatus)}`}>{statusLabel(o.orderStatus).toUpperCase()}</span>
              </div>

              {o.orderStatus !== "CANCELLED" && (
                <ol className="flex gap-1 px-5 pt-5" aria-label="Order progress">
                  {ORDER_STEPS.map((s, i) => (
                    <li key={s} className="flex-1 text-center">
                      <div className={`h-1 ${i <= step ? "bg-ink" : "bg-stone"}`} />
                      <p className={`mt-2 hidden text-[0.6rem] uppercase tracking-[0.1em] sm:block ${i === step ? "font-bold" : "text-mute"}`}>{statusLabel(s)}</p>
                    </li>
                  ))}
                </ol>
              )}

              <ul className="divide-y divide-ink/10 p-5">
                {o.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <ProductImage src={orderImage(it)} product={it.product || it} alt={it.product?.name || "Ordered item"} className="h-20 w-16 bg-bone object-cover" />
                    <div className="flex-1 text-sm">
                      {it.product?.id ? <Link to={`/product/${it.product.id}`} className="font-medium hover:text-clay">{it.productName}</Link> : <span className="font-medium">{it.productName}</span>}
                      <p className="text-xs text-mute">Qty {it.quantity} · {formatPrice(it.price)} each</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(it.subtotal)}</p>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 px-5 py-4 text-sm">
                <p className="max-w-md text-mute">Ships to: {o.shippingAddress}</p>
                {o.paymentStatus === "PENDING" && o.orderStatus !== "CANCELLED" && (
                  <button disabled={paying === o.id} onClick={() => pay(o.id)} className="bg-ink px-6 py-3 text-xs font-semibold tracking-wide text-paper transition-colors hover:bg-clay disabled:bg-mute">
                    {paying === o.id ? "Processing…" : `Pay ${formatPrice(o.totalAmount)} now`}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
