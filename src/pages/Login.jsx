import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";

const input = "w-full border border-ink/25 bg-paper px-4 py-3.5 text-sm outline-none transition focus:border-ink";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const email = form.email.trim().toLowerCase();
      await login(email, form.password); // backend e-mails a one-time code
      navigate("/verify", { state: { email, from: location.state?.from } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome" italic="back" subtitle="Sign in — we'll email you a one-time code to confirm it's you." art="/art/hero-1.svg"
      footer={<>New to DripVora? <Link to="/signup" state={location.state} className="font-semibold link-u">Create an account</Link></>}>
      <form onSubmit={submit} className="space-y-5">
        <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]">Email</span>
          <input type="email" required autoComplete="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]">Password</span>
          <div className="relative">
            <input type={show ? "text" : "password"} required autoComplete="current-password" className={`${input} pr-12`} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-ink">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div></label>
        {error && <p className="text-sm text-clay" role="alert">{error}</p>}
        <button disabled={busy} className="w-full bg-ink py-4 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-clay disabled:bg-mute">{busy ? "Sending code…" : "Continue"}</button>
      </form>
    </AuthShell>
  );
}
