import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, Package, Search, ShieldCheck, ShoppingBag, User, CircleUserRound } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "../data/navigation";
import { useAuth } from "../context/AuthContext";
import { inCollection } from "../lib/collections";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useWishlist } from "../context/WishlistContext";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";
import ProductImage from "./ProductImage";

function MegaMenu({ category }) {
  const { products } = useProducts();
  const inCat = useMemo(() => products.filter((p) => inCollection(p, category)), [products, category]);
  const types = useMemo(() => [...new Set(inCat.map((p) => p.type))], [inCat]);
  const feature = inCat.find((p) => p.discount > 0) || inCat[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 right-0 top-full border-t border-ink/10 bg-paper shadow-[0_24px_40px_-24px_rgba(0,0,0,0.25)]"
    >
      <div className="container-x grid grid-cols-12 gap-5 py-7">
        <div className="col-span-3">
          <p className="eyebrow text-mute mb-4">Shop by type</p>
          <ul className="space-y-2.5">
            {types.map((t) => (
              <li key={t}>
                <Link to={`/shop/${category}?type=${encodeURIComponent(t)}`} className="text-[0.95rem] hover:text-clay transition-colors">{t}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-3">
          <p className="eyebrow text-mute mb-4">Edits</p>
          <ul className="space-y-2.5 text-[0.95rem]">
            <li><Link className="hover:text-clay transition-colors" to={`/shop/${category}?sort=newest`}>Latest drops</Link></li>
                        <li><Link className="text-clay hover:underline" to={`/shop/${category}?sale=1`}>On sale</Link></li>
            <li><Link className="font-semibold" to={`/shop/${category}`}>View all →</Link></li>
          </ul>
        </div>
        {feature && (
          <Link to={`/product/${feature.id}`} className="col-span-6 grid grid-cols-5 gap-5 group">
            <div className="col-span-2 aspect-[4/5] overflow-hidden bg-bone">
              <ProductImage src={feature.image} product={feature} alt={feature.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="col-span-3 self-center">
              <p className="eyebrow text-clay mb-2">Featured</p>
              <p className="display text-3xl mb-2">{feature.name}</p>
              <p className="text-sm text-mute line-clamp-3">{feature.description}</p>
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mega, setMega] = useState(null);
  const { user, isAdmin, logout } = useAuth();
  const { count, setDrawerOpen } = useCart();
  const wish = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMega(null); setMobileOpen(false); }, [location.pathname, location.search]);

  const iconBtn = "relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-ink/5";

  return (
    <>
      <div className="bg-ink text-paper text-[0.7rem] tracking-[0.14em] uppercase text-center py-2 px-4">
        Free shipping over ₹2,999 &nbsp;·&nbsp; Easy 30-day returns
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-paper/90 backdrop-blur-md border-b border-ink/10" : "bg-paper border-b border-transparent"
        }`}
        onMouseLeave={() => setMega(null)}
      >
        <div className={`container-x flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-[4.75rem]"}`}>
          <div className="flex items-center gap-1 lg:hidden">
            <button className={iconBtn} onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          </div>

          <Logo className="lg:mr-10" />

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink
                key={n.label} to={n.to} end={n.end}
                onMouseEnter={() => setMega(n.mega || null)}
                onFocus={() => setMega(n.mega || null)}
                className={({ isActive }) =>
                  `link-u py-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] transition-colors ${n.accent ? "text-clay" : ""} ${isActive ? "is-active" : "text-ink/80 hover:text-ink"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <button className={iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={20} /></button>
            <Link to="/wishlist" className={`${iconBtn} hidden sm:grid`} aria-label={`Wishlist, ${wish.count} items`}>
              <Heart size={20} />
              {wish.count > 0 && <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[0.6rem] font-bold text-paper">{wish.count}</span>}
            </Link>

            {/* account */}
            <div className="relative group hidden lg:block">
              <Link to={user ? "/profile" : "/login"} className={iconBtn} aria-label="Account">
                {user ? <CircleUserRound size={21} /> : <User size={20} />}
              </Link>
              <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 transition duration-200 absolute right-0 top-full pt-2 w-56">
                <div className="bg-paper border border-ink/10 shadow-xl p-2 text-sm">
                  {user ? (
                    <>
                      <p className="px-3 py-2 text-mute truncate">Hi, {user.name.split(" ")[0]}</p>
                      <Link className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-bone" to="/profile"><User size={16} />My profile</Link>
                      <Link className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-bone" to="/orders"><Package size={16} />My orders</Link>
                      {isAdmin && <Link className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-bone text-clay" to="/admin"><ShieldCheck size={16} />Admin</Link>}
                      <button className="flex w-full items-center gap-2.5 px-3 py-2.5 hover:bg-bone" onClick={() => { logout(); navigate("/"); }}><LogOut size={16} />Sign out</button>
                    </>
                  ) : (
                    <>
                      <Link className="block px-3 py-2.5 hover:bg-bone font-semibold" to="/login">Sign in</Link>
                      <Link className="block px-3 py-2.5 hover:bg-bone" to="/signup">Create account</Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button className={iconBtn} onClick={() => setDrawerOpen(true)} aria-label={`Shopping bag, ${count} items`}>
              <ShoppingBag size={20} />
              {count > 0 && (
                <motion.span key={count} initial={{ scale: 0.4 }} animate={{ scale: 1 }}
                  className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[0.6rem] font-bold text-paper">
                  {count}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>{mega && <MegaMenu key={mega} category={mega} />}</AnimatePresence>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
