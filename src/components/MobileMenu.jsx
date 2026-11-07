import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LogOut, Package, ShieldCheck, User, X } from "lucide-react";
import { NAV } from "../data/navigation";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import Logo from "./Logo";

export default function MobileMenu({ open, onClose }) {
  const { user, isAdmin, logout } = useAuth();
  const wish = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  const sub = "flex items-center gap-3 py-3 text-[0.95rem]";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Menu"
            className="fixed left-0 top-0 bottom-0 z-50 flex w-[88%] max-w-sm flex-col bg-paper"
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-[4.5rem] items-center justify-between px-5 border-b border-ink/10">
              <Logo />
              <button onClick={onClose} aria-label="Close menu" className="grid h-10 w-10 place-items-center"><X size={22} /></button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
              {NAV.map((n, i) => (
                <motion.div key={n.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }}>
                  <NavLink to={n.to} end={n.end} onClick={onClose}
                    className={({ isActive }) => `display block py-2.5 text-[2.4rem] ${n.accent ? "text-clay" : ""} ${isActive ? "italic" : ""}`}>
                    {n.label}
                  </NavLink>
                </motion.div>
              ))}

              <div className="mt-8 border-t border-ink/10 pt-4">
                <Link to="/wishlist" onClick={onClose} className={sub}><Heart size={18} />Wishlist{wish.count > 0 && ` (${wish.count})`}</Link>
                {user ? (
                  <>
                    <Link to="/profile" onClick={onClose} className={sub}><User size={18} />My profile</Link>
                    <Link to="/orders" onClick={onClose} className={sub}><Package size={18} />My orders</Link>
                    {isAdmin && <Link to="/admin" onClick={onClose} className={`${sub} text-clay`}><ShieldCheck size={18} />Admin</Link>}
                    <button className={sub} onClick={() => { logout(); onClose(); navigate("/"); }}><LogOut size={18} />Sign out</button>
                  </>
                ) : (
                  <Link to="/login" onClick={onClose} className={sub}><User size={18} />Sign in / Create account</Link>
                )}
              </div>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
