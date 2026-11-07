import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export default function OrderSummary({ totals }) {
  const cart = useCart();
  const t = totals || cart;
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(t.subtotal)}</dd></div>
      {t.savings > 0 && <div className="flex justify-between text-ok"><dt>You save</dt><dd>-{formatPrice(t.savings)}</dd></div>}
      <div className="flex justify-between"><dt>Shipping</dt><dd>{t.shipping === 0 ? "Free" : formatPrice(t.shipping)}</dd></div>
      <div className="flex justify-between border-t border-ink/15 pt-4 text-lg font-semibold"><dt>Total</dt><dd>{formatPrice(t.total)}</dd></div>
    </dl>
  );
}
