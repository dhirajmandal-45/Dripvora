import ProductImage from "./ProductImage";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { useProducts } from "../context/ProductsContext";
import { formatPrice } from "../lib/format";

const SUGGESTIONS = ["Hoodie", "Dress", "Denim", "Linen", "Cargo"];

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { products } = useProducts();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    else setQ("");
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) => [p.name, p.type, p.gender, p.brand, p.fabric].join(" ").toLowerCase().includes(term))
      .slice(0, 5);
  }, [q, products]);

  const submit = (e, value = q) => {
    e?.preventDefault();
    if (!value.trim()) return;
    navigate(`/shop/all?q=${encodeURIComponent(value.trim())}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-paper overflow-y-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          role="dialog" aria-modal="true" aria-label="Search"
        >
          <div className="container-x pt-6 pb-16 max-w-4xl">
            <div className="flex justify-end">
              <button onClick={onClose} aria-label="Close search" className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5"><X size={24} /></button>
            </div>

            <form onSubmit={submit} className="mt-6 flex items-center gap-4 border-b-2 border-ink pb-4">
              <Search size={26} />
              <input
                ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} type="search"
                placeholder="Search for dresses, hoodies, denim…" aria-label="Search products"
                className="display w-full bg-transparent text-3xl md:text-5xl outline-none placeholder:text-mute/60"
              />
            </form>

            {!q && (
              <div className="mt-8">
                <p className="eyebrow text-mute mb-4">Popular searches</p>
                <div className="flex flex-wrap gap-2.5">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => submit(null, s)} className="border border-ink/20 px-4 py-2 text-sm hover:bg-ink hover:text-paper transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            )}

            {q && (
              <div className="mt-8">
                {results.length === 0 ? (
                  <p className="text-mute">No matches for “{q}”. Try a different word.</p>
                ) : (
                  <ul className="divide-y divide-ink/10">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link to={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-4 py-3 group">
                          <ProductImage src={p.image} product={p} alt={p.name} className="h-20 w-16 object-cover bg-bone" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate group-hover:text-clay transition-colors">{p.name}</p>
                            <p className="text-sm text-mute capitalize">{p.gender} · {p.type}</p>
                          </div>
                          <span className="font-semibold">{formatPrice(p.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {results.length > 0 && (
                  <button onClick={submit} className="mt-6 inline-flex items-center gap-2 font-semibold link-u">See all results <ArrowRight size={16} /></button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
