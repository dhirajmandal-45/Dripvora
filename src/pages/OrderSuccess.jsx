import ProductImage from "../components/ProductImage";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { getMyOrder } from "../services/orderService";
import { formatPrice } from "../lib/format";
import { orderImage } from "../lib/orderStatus";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrder(id).then(setOrder).catch((e) => setError(e.message));
  }, [id]);

  return (
    <div className="container-x max-w-2xl py-20 text-center md:py-28">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ink text-paper"><Check size={36} /></motion.div>
      <p className="eyebrow mt-8 text-clay">Order placed</p>
      <h1 className="display mt-3 text-6xl md:text-7xl">Thank <em className="font-normal italic">you</em></h1>
      {error && <p className="mt-5 text-clay" role="alert">{error}</p>}

      {order && (
        <>
          <p className="mt-5 text-ink-soft">
            Order <b>#{order.orderNumber}</b> is {order.paymentStatus === "PAID" ? "paid and confirmed" : "placed — pay on delivery"}. We'll ship it to:
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-mute">{order.shippingAddress}</p>

          <div className="mt-10 border border-ink/10 bg-bone p-6 text-left">
            <ul className="divide-y divide-ink/10">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <ProductImage src={orderImage(it)} product={it.product || it} alt={it.product?.name || "Ordered item"} className="h-16 w-12 bg-paper object-cover" />
                  <div className="flex-1 text-sm"><p className="font-medium">{it.productName}</p><p className="text-xs text-mute">Qty {it.quantity}</p></div>
                  <p className="text-sm font-semibold">{formatPrice(it.subtotal)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-ink/15 pt-4 font-semibold"><span>Total</span><span>{formatPrice(order.totalAmount)}</span></div>
          </div>
        </>
      )}

      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <Link to="/orders" className="bg-ink px-8 py-4 text-sm font-semibold text-paper transition-colors hover:bg-clay">View my orders</Link>
        <Link to="/shop/all" className="border border-ink px-8 py-4 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper">Keep shopping</Link>
      </div>
    </div>
  );
}
