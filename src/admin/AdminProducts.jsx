import ProductImage from "../components/ProductImage";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { deleteProduct, getAllProducts, updateProduct } from "../services/adminService";
import useAsync from "../hooks/useAsync";
import { formatPrice } from "../lib/format";
import { toProductPayload } from "./productPayload";
import { Badge, Empty, ErrorBox, Loading, PageHead, Table, inputCls } from "./ui";

const FILTERS = [["all", "All"], ["active", "Active"], ["inactive", "Hidden"], ["low", "Low stock"]];

export default function AdminProducts() {
  const { data: products, error, loading, reload, setData } = useAsync(getAllProducts);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (products || [])
      .filter((p) => !term || [p.name, p.sku, p.brand, p.category].join(" ").toLowerCase().includes(term))
      .filter((p) => filter === "all" || (filter === "active" && p.active) || (filter === "inactive" && !p.active) || (filter === "low" && p.stockQuantity <= 5))
      .sort((a, b) => b.id - a.id);
  }, [products, q, filter]);

  const toggleActive = async (p) => {
    setBusyId(p.id);
    try {
      const saved = await updateProduct(p.id, { ...toProductPayload(p), active: !p.active });
      setData((list) => list.map((x) => (x.id === p.id ? saved : x)));
      toast.success(saved.active ? "Product is now visible in the store" : "Product hidden from the store");
    } catch (e) { toast.error(e.message); }
    finally { setBusyId(null); }
  };

  const remove = async (p) => {
    if (!confirm(`Permanently delete “${p.name}”? Hiding it instead keeps order history intact.`)) return;
    setBusyId(p.id);
    try {
      await deleteProduct(p.id);
      setData((list) => list.filter((x) => x.id !== p.id));
      toast.success("Product deleted");
    } catch (e) { toast.error(`Couldn't delete — it may be part of existing orders. Hide it instead. (${e.message})`, { duration: 6000 }); }
    finally { setBusyId(null); }
  };

  return (
    <div>
      <PageHead title="Products">
        <Link to="/admin/products/new" className="flex items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay"><Plus size={16} />Add product</Link>
      </PageHead>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, SKU, brand…" aria-label="Search products" className={`${inputCls} pl-9`} />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id}
              className={`px-3.5 py-2.5 text-xs font-semibold transition ${filter === id ? "bg-ink text-paper" : "bg-bone hover:bg-stone"}`}>{label}</button>
          ))}
        </div>
      </div>

      {loading && !products ? <Loading /> : error && !products ? <ErrorBox message={error} onRetry={reload} /> : rows.length === 0 ? (
        <Empty>{products?.length ? "No products match your filters." : "No products yet — add your first one."}</Empty>
      ) : (
        <Table head={["Product", "Category", "Price", "Stock", "Status", ""]} min="52rem">
          {rows.map((p) => (
            <tr key={p.id} className={busyId === p.id ? "opacity-50" : ""}>
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <ProductImage src={p.imageUrl} product={p} alt={p.name} className="h-16 w-12 bg-bone object-cover" />
                  <div><p className="font-medium">{p.name}</p><p className="text-xs text-mute">{p.brand} · {p.sku}</p></div>
                </div>
              </td>
              <td className="p-3">{p.category}<br /><span className="text-xs text-mute">{p.gender}</span></td>
              <td className="p-3">
                {formatPrice(Number(p.discountPercentage) > 0 ? Math.round(p.price * (1 - p.discountPercentage / 100)) : p.price)}
                {Number(p.discountPercentage) > 0 && <><br /><span className="text-xs text-clay">{Number(p.discountPercentage)}% off</span></>}
              </td>
              <td className={`p-3 font-semibold ${p.stockQuantity <= 5 ? "text-clay" : ""}`}>{p.stockQuantity}</td>
              <td className="p-3">
                <button onClick={() => toggleActive(p)} disabled={busyId === p.id} aria-label={`${p.active ? "Hide" : "Show"} ${p.name}`}>
                  <Badge tone={p.active ? "ok" : "soft"}>{p.active ? "ACTIVE" : "HIDDEN"}</Badge>
                </button>
              </td>
              <td className="p-3">
                <div className="flex justify-end gap-3">
                  <Link to={`/admin/products/${p.id}`} aria-label={`Edit ${p.name}`} className="text-mute hover:text-ink"><Pencil size={17} /></Link>
                  <button onClick={() => remove(p)} disabled={busyId === p.id} aria-label={`Delete ${p.name}`} className="text-mute hover:text-clay"><Trash2 size={17} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
