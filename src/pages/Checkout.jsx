import ProductImage from "../components/ProductImage";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Banknote, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { checkout, payForOrder } from "../services/orderService";
import { formatPrice } from "../lib/format";
import OrderSummary from "../components/OrderSummary";

const PAYMENTS = [
  { id: "online", label: "Pay online", Icon: CreditCard, hint: "UPI, cards & netbanking — paid instantly" },
  { id: "cod", label: "Cash on delivery", Icon: Banknote, hint: "Pay when your order arrives" },
];

const field = "w-full border bg-paper px-4 py-3.5 text-sm outline-none transition focus:border-ink";

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-clay" role="alert">{error}</span>}
    </label>
  );
}

export default function Checkout() {
  const { user } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user.name || "", phone: "", address: user.address || "",
    city: user.city || "", state: user.state || "", pincode: user.pincode || "",
  });
  const [payment, setPayment] = useState("online");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (cart.lines.length === 0 && !done) return <Navigate to="/cart" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const cls = (k) => `${field} ${errors[k] ? "border-clay" : "border-ink/25"}`;

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (form.address.trim().length < 6) e.address = "Enter your street address";
    if (!form.city.trim()) e.city = "Enter your city";
    if (!form.state.trim()) e.state = "Enter your state";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return toast.error("Please fix the highlighted fields");
    setBusy(true);
    // The backend stores one shipping-address string per order.
    const shippingAddress = `${form.name.trim()} (${form.phone}), ${form.address.trim()}, ${form.city.trim()}, ${form.state.trim()} - ${form.pincode}`;
    let order;
    try {
      order = await checkout(shippingAddress);
    } catch (e) {
      setBusy(false);
      return toast.error(e.message);
    }
    setDone(true);
    if (payment === "online") {
      try {
        await payForOrder(order.id);
      } catch (e) {
        toast.error(`Order placed, but payment failed: ${e.message}. You can pay from My Orders.`, { duration: 6000 });
      }
    }
    await cart.refresh().catch(() => cart.clear());
    navigate(`/order-success/${order.id}`, { replace: true });
  };

  return (
    <div className="container-x py-10 md:py-16">
      <h1 className="display text-6xl md:text-7xl">Check<em className="font-normal italic">out</em></h1>

      <form onSubmit={submit} noValidate className="mt-10 grid gap-12 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          <section>
            <h2 className="display mb-6 text-3xl"><span className="text-clay">1.</span> Delivery address</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}><input className={cls("name")} value={form.name} onChange={set("name")} autoComplete="name" /></Field>
              <Field label="Mobile number" error={errors.phone}><input inputMode="numeric" maxLength={10} className={cls("phone")} value={form.phone} onChange={set("phone")} autoComplete="tel" /></Field>
              <div className="sm:col-span-2"><Field label="Address" error={errors.address}><input className={cls("address")} value={form.address} onChange={set("address")} autoComplete="street-address" /></Field></div>
              <Field label="City" error={errors.city}><input className={cls("city")} value={form.city} onChange={set("city")} autoComplete="address-level2" /></Field>
              <Field label="State" error={errors.state}><input className={cls("state")} value={form.state} onChange={set("state")} autoComplete="address-level1" /></Field>
              <Field label="Pincode" error={errors.pincode}><input inputMode="numeric" maxLength={6} className={cls("pincode")} value={form.pincode} onChange={set("pincode")} autoComplete="postal-code" /></Field>
            </div>
          </section>

          <section>
            <h2 className="display mb-6 text-3xl"><span className="text-clay">2.</span> Payment</h2>
            <div className="space-y-3" role="radiogroup" aria-label="Payment method">
              {PAYMENTS.map(({ id, label, Icon, hint }) => (
                <label key={id} className={`flex cursor-pointer items-center gap-4 border p-4 transition ${payment === id ? "border-ink bg-bone" : "border-ink/20 hover:border-ink/50"}`}>
                  <input type="radio" name="payment" className="accent-ink" checked={payment === id} onChange={() => setPayment(id)} />
                  <Icon size={22} strokeWidth={1.5} />
                  <span><span className="block font-semibold">{label}</span><span className="text-xs text-mute">{hint}</span></span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-bone p-6 md:p-8 lg:sticky lg:top-28">
            <h2 className="display mb-5 text-3xl">Your order</h2>
            <ul className="mb-6 max-h-72 space-y-4 overflow-y-auto pr-1">
              {cart.lines.map((l) => (
                <li key={l.key} className="flex gap-4">
                  <ProductImage src={l.product.image} product={l.product} alt={l.product.name} className="h-20 w-16 bg-paper object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium leading-snug">{l.product.name}</p>
                    <p className="text-xs text-mute">Qty {l.qty}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(l.product.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <OrderSummary />
            <button disabled={busy} className="mt-6 w-full bg-ink py-4 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-clay disabled:bg-mute">
              {busy ? "Placing your order…" : `Place order · ${formatPrice(cart.total)}`}
            </button>
            <Link to="/cart" className="mt-3 mx-auto block w-fit text-center text-sm link-u">Back to bag</Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
