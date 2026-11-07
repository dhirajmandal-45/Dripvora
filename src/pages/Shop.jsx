import { useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { COLLECTIONS } from "../data/navigation";
import { useProducts } from "../context/ProductsContext";
import { inCollection, newArrivals } from "../lib/collections";
import ApiStatus from "../components/ApiStatus";
import ProductCard from "../components/ProductCard";
import FilterPanel, { PRICE_BANDS } from "../components/FilterPanel";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "discount", label: "Biggest discount" },
];

const EMPTY = { types: [], prices: [], inStock: false };

const sorters = {
  featured: () => 0,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  discount: (a, b) => b.discount - a.discount,
};

// Remount when the collection / type / search changes so filter state resets cleanly.
export default function Shop() {
  const { collection = "all" } = useParams();
  const [params] = useSearchParams();
  return <ShopInner key={`${collection}|${params.get("type") || ""}|${params.get("q") || ""}`} />;
}

function ShopInner() {
  const { collection = "all" } = useParams();
  const [params, setParams] = useSearchParams();
  const { products, loading, error, reload } = useProducts();
  const [filters, setFilters] = useState(() => ({ ...EMPTY, types: params.get("type") ? [params.get("type")] : [] }));
  const [drawer, setDrawer] = useState(false);

  const meta = COLLECTIONS[collection];
  const q = (params.get("q") || "").trim().toLowerCase();
  const sort = params.get("sort") && sorters[params.get("sort")] ? params.get("sort") : "featured";
  const saleOnly = params.get("sale") === "1";

  const base = useMemo(() => {
    let list = products.filter((p) => inCollection(p, collection));
    if (collection === "new-arrivals") list = newArrivals(list);
    if (saleOnly) list = list.filter((p) => p.discount > 0);
    if (q) list = list.filter((p) => [p.name, p.type, p.gender, p.brand, p.fabric, p.description].join(" ").toLowerCase().includes(q));
    return list;
  }, [products, collection, saleOnly, q]);

  const types = useMemo(() => [...new Set(base.map((p) => p.type))], [base]);

  const visible = useMemo(() => {
    const bands = PRICE_BANDS.filter((b) => filters.prices.includes(b.id));
    return base
      .filter((p) => !filters.types.length || filters.types.includes(p.type))
      .filter((p) => !bands.length || bands.some((b) => b.test(p.price)))
      .filter((p) => !filters.inStock || p.stock > 0)
      .sort(sorters[sort]);
  }, [base, filters, sort]);

  if (!meta) return <Navigate to="/shop/all" replace />;

  const activeCount = filters.types.length + filters.prices.length + (filters.inStock ? 1 : 0);
  const setSort = (v) => { const n = new URLSearchParams(params); v === "featured" ? n.delete("sort") : n.set("sort", v); setParams(n, { replace: true }); };
  const clear = () => setFilters(EMPTY);
  const panel = <FilterPanel types={types} filters={filters} setFilters={setFilters} onClear={clear} />;

  return (
    <>
      <header className="overflow-hidden bg-bone">
        <div className="container-x grid items-center gap-6 py-10 sm:py-12 md:grid-cols-12 md:py-14">
          <div className="md:col-span-7">
            <nav aria-label="Breadcrumb" className="mb-5 text-xs text-mute">
              <Link to="/" className="hover:text-ink">Home</Link> <span className="mx-1.5">/</span> <span className="text-ink">{q ? "Search" : meta.title + " " + meta.italic}</span>
            </nav>
            <h1 className="display text-[clamp(2.8rem,7vw,5.5rem)]">
              {q ? <>Results for <em className="font-normal italic">“{params.get("q")}”</em></> : <>{meta.title} <em className="font-normal italic">{meta.italic}</em></>}
            </h1>
            {!q && <p className="mt-4 max-w-lg text-ink-soft">{meta.blurb}</p>}
          </div>
          {!q && meta.art && <div className="md:col-span-5">
            <div className="aspect-[16/9] w-full max-w-md overflow-hidden bg-paper/40 md:ml-auto md:aspect-[5/3]">
              <img src={meta.art} alt={`${meta.title} collection`} className="h-full w-full object-cover" />
            </div>
          </div>}
        </div>
      </header>

      <div className="container-x py-8 md:py-12">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-ink/10 pb-5">
          <p className="text-sm text-mute"><span className="font-semibold text-ink">{visible.length}</span> {visible.length === 1 ? "piece" : "pieces"}</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setDrawer(true)} className="flex items-center gap-2 border border-ink/25 px-4 py-2.5 text-sm font-semibold lg:hidden">
              <SlidersHorizontal size={16} /> Filters{activeCount > 0 && ` (${activeCount})`}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-mute sm:inline">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-ink/25 bg-paper px-3 py-2.5 text-sm font-medium outline-none focus:border-ink">
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[15rem_1fr] xl:grid-cols-[17rem_1fr]">
          <aside className="hidden lg:block" aria-label="Filters"><div className="sticky top-28">{panel}</div></aside>

          <div>
            {error ? <ApiStatus error={error} onRetry={reload} /> : loading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 xl:grid-cols-3" aria-busy="true">
                {Array.from({ length: 6 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse bg-bone" />)}
              </div>
            ) : visible.length === 0 ? (
              <div className="py-24 text-center">
                <p className="display text-4xl">Nothing matches just yet</p>
                <p className="mt-3 text-mute">Try removing a filter or searching for something else.</p>
                <button onClick={clear} className="mt-7 bg-ink px-7 py-3.5 text-sm font-semibold text-paper hover:bg-clay transition-colors">Clear filters</button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 xl:grid-cols-3">
                {visible.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04 }}>
                    <ProductCard product={p} priority={i < 4} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-ink/50" onClick={() => setDrawer(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside role="dialog" aria-modal="true" aria-label="Filters"
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col bg-paper"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                <h2 className="display text-3xl">Filters</h2>
                <button onClick={() => setDrawer(false)} aria-label="Close filters"><X size={22} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6">{panel}</div>
              <div className="border-t border-ink/10 p-4">
                <button onClick={() => setDrawer(false)} className="w-full bg-ink py-4 text-sm font-semibold text-paper">Show {visible.length} pieces</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
