import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";

const input = "w-full border bg-paper px-4 py-3.5 text-sm outline-none transition focus:border-ink";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", city: "", state: "", pincode: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    const err = {};
    if (form.name.trim().length < 2) err.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email";
    if (form.password.length < 6) err.password = "Use at least 6 characters";
    if (form.address.trim().length < 3) err.address = "Enter your address";
    if (!form.city.trim()) err.city = "Enter your city";
    if (!form.state.trim()) err.state = "Enter your state";
    if (!/^\d{6}$/.test(form.pincode)) err.pincode = "Pincode must be 6 digits";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      const email = form.email.trim().toLowerCase();
      await signup({ ...form, email }); // backend creates the account and e-mails a verification code
      navigate("/verify", { state: { email, from: location.state?.from, justSignedUp: true } });
    } catch (ex) {
      setFormError(ex.message);
    } finally {
      setBusy(false);
    }
  };

  const F = ({ k, text, type = "text", auto, className = "" }) => (
    <label className={`block ${className}`}><span className={label}>{text}</span>
      <input type={type} autoComplete={auto} className={`${input} ${errors[k] ? "border-clay" : "border-ink/25"}`} value={form[k]} onChange={set(k)} />
      {errors[k] && <span className="mt-1 block text-xs text-clay" role="alert">{errors[k]}</span>}</label>
  );

  return (
    <AuthShell title="Join" italic="DripVora" subtitle="Create your account. We'll email a code to verify your address." art="/art/hero-3.svg"
      footer={<>Already a member? <Link to="/login" state={location.state} className="font-semibold link-u">Sign in</Link></>}>
      <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
        {F({ k: "name", text: "Full name", auto: "name", className: "sm:col-span-2" })}
        {F({ k: "email", text: "Email", type: "email", auto: "email", className: "sm:col-span-2" })}
        {F({ k: "password", text: "Password", type: "password", auto: "new-password", className: "sm:col-span-2" })}
        {F({ k: "address", text: "Address", auto: "street-address", className: "sm:col-span-2" })}
        {F({ k: "city", text: "City", auto: "address-level2" })}
        {F({ k: "state", text: "State", auto: "address-level1" })}
        {F({ k: "pincode", text: "Pincode", auto: "postal-code" })}
        {formError && (
          <p className="text-sm text-clay sm:col-span-2" role="alert">
            {formError} {/already registered/i.test(formError) && <Link to="/login" className="font-semibold underline">Sign in instead</Link>}
          </p>
        )}
        <button disabled={busy} className="bg-ink py-4 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-clay disabled:bg-mute sm:col-span-2">{busy ? "Creating account…" : "Create account"}</button>
      </form>
    </AuthShell>
  );
}
