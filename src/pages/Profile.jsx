import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BadgeCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { formatDate } from "../lib/format";

const input = "w-full border border-ink/25 bg-paper px-4 py-3.5 text-sm outline-none transition focus:border-ink";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]";

export default function Profile() {
  const { user, updateProfile, deactivate, logout, isAdmin } = useAuth();
  const wish = useWishlist();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user.name || "", address: user.address || "", city: user.city || "", state: user.state || "", pincode: user.pincode || "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Please enter your name");
    if (!form.address.trim() || !form.city.trim() || !form.state.trim()) return toast.error("Address, city and state are required");
    if (!/^\d{6}$/.test(form.pincode)) return toast.error("Pincode must be 6 digits");
    setBusy(true);
    try { await updateProfile(form); toast.success("Profile updated"); }
    catch (err) { toast.error(err.message); }
    finally { setBusy(false); }
  };

  const close = async () => {
    if (!confirm("Deactivate your account? You will be signed out and won't be able to sign in again.")) return;
    try { await deactivate(); toast.success("Your account has been deactivated"); navigate("/"); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div className="container-x max-w-4xl py-10 md:py-16">
      <h1 className="display text-6xl md:text-7xl">My <em className="font-normal italic">account</em></h1>

      <div className="mt-10 grid gap-10 md:grid-cols-3">
        <div>
          <div className="display grid h-24 w-24 place-items-center rounded-full bg-ink text-4xl text-paper">{user.name[0].toUpperCase()}</div>
          <p className="mt-4 text-lg font-semibold">{user.name}</p>
          <p className="break-all text-sm text-mute">{user.email}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ok"><BadgeCheck size={15} />{user.emailVerified ? "Email verified" : "Email not verified"}</p>
          {isAdmin && <Link to="/admin" className="mt-3 inline-block bg-clay px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-paper">ADMIN PANEL →</Link>}
          <p className="mt-4 text-xs text-mute">Member since {formatDate(user.createdAt)}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-center">
            <Link to="/orders" className="border border-ink/15 p-4 text-sm font-semibold transition hover:border-ink">Orders</Link>
            <Link to="/wishlist" className="border border-ink/15 p-4 text-sm transition hover:border-ink"><span className="font-semibold">Saved</span> ({wish.count})</Link>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={save} className="grid gap-5 sm:grid-cols-2">
            <h2 className="display text-3xl sm:col-span-2">Personal details</h2>
            <label className="block sm:col-span-2"><span className={label}>Full name</span><input className={input} value={form.name} onChange={set("name")} /></label>
            <label className="block sm:col-span-2"><span className={label}>Email</span><input className={`${input} bg-bone text-mute`} value={user.email} disabled /></label>
            <label className="block sm:col-span-2"><span className={label}>Address</span><input className={input} value={form.address} onChange={set("address")} /></label>
            <label className="block"><span className={label}>City</span><input className={input} value={form.city} onChange={set("city")} /></label>
            <label className="block"><span className={label}>State</span><input className={input} value={form.state} onChange={set("state")} /></label>
            <label className="block"><span className={label}>Pincode</span><input className={input} inputMode="numeric" maxLength={6} value={form.pincode} onChange={set("pincode")} /></label>
            <div className="sm:col-span-2"><button disabled={busy} className="bg-ink px-8 py-4 text-sm font-semibold text-paper transition-colors hover:bg-clay disabled:bg-mute">{busy ? "Saving…" : "Save changes"}</button></div>
          </form>

          <div className="mt-12 flex flex-wrap gap-6 border-t border-ink/10 pt-6 text-sm">
            <button onClick={() => { logout(); navigate("/"); }} className="font-semibold link-u">Sign out</button>
            <button onClick={close} className="text-clay link-u">Deactivate account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
