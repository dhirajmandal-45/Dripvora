import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MailCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";

const LENGTH = 6;
const COOLDOWN = 30;

const mask = (email) => email.replace(/^(.{2}).*(@.*)$/, "$1•••$2");

export default function VerifyOtp() {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(COOLDOWN);
  const refs = useRef([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!email) return <Navigate to="/login" replace />;

  const submit = async (code) => {
    setError("");
    setBusy(true);
    try {
      const profile = await verifyOtp(email, code);
      toast.success(`Welcome, ${profile.name.split(" ")[0]}!`);
      navigate(state.from || (profile.role === "ADMIN" ? "/admin" : "/"), { replace: true });
    } catch (e) {
      setError(e.message);
      setDigits(Array(LENGTH).fill(""));
      refs.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  };

  const update = (next) => {
    setDigits(next);
    const code = next.join("");
    if (code.length === LENGTH && !next.includes("")) submit(code);
  };

  const onChange = (i, value) => {
    const v = value.replace(/\D/g, "");
    if (!v) return;
    const next = [...digits];
    // typing or pasting several digits fills the following boxes
    v.slice(0, LENGTH - i).split("").forEach((d, k) => { next[i + k] = d; });
    update(next);
    refs.current[Math.min(i + v.length, LENGTH - 1)]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) next[i] = "";
      else if (i > 0) { next[i - 1] = ""; refs.current[i - 1]?.focus(); }
      setDigits(next);
    } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const resend = async () => {
    try {
      await resendOtp(email);
      toast.success("A new code is on its way");
      setCooldown(COOLDOWN);
      setError("");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <AuthShell title="Check your" italic="inbox" art="/art/hero-2.svg"
      subtitle={<>We sent a 6-digit code to <b className="text-ink">{mask(email)}</b>. It expires in 5 minutes.</>}
      footer={<>Wrong email? <Link to={state.justSignedUp ? "/signup" : "/login"} className="font-semibold link-u">Go back</Link></>}>
      <MailCheck size={40} strokeWidth={1.2} className="mb-6 text-clay" />
      <div className="flex justify-between gap-2" role="group" aria-label="One-time code">
        {digits.map((d, i) => (
          <input
            key={i} ref={(el) => (refs.current[i] = el)} value={d} disabled={busy}
            inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={LENGTH}
            aria-label={`Digit ${i + 1}`}
            onChange={(e) => onChange(i, e.target.value)} onKeyDown={(e) => onKeyDown(i, e)} onFocus={(e) => e.target.select()}
            className={`h-14 w-full min-w-0 border bg-paper text-center text-2xl font-semibold outline-none transition focus:border-ink sm:h-16 ${error ? "border-clay" : "border-ink/25"}`}
          />
        ))}
      </div>
      <div className="mt-4 min-h-6" aria-live="polite">
        {error && <p className="text-sm text-clay" role="alert">{error}</p>}
        {busy && <p className="text-sm text-mute">Verifying…</p>}
      </div>
      <p className="mt-6 text-sm text-ink-soft">
        Didn't get it?{" "}
        {cooldown > 0 ? <span className="text-mute">Resend in {cooldown}s</span> : <button onClick={resend} className="font-semibold link-u">Resend code</button>}
      </p>
    </AuthShell>
  );
}
