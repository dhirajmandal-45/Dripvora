import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ImagePlus } from "lucide-react";
import { createProduct, getAllProducts, updateProduct } from "../services/adminService";
import { getCategories } from "../services/productService";
import useAsync from "../hooks/useAsync";
import { toProductPayload } from "./productPayload";
import { ErrorBox, Loading, PageHead, inputCls } from "./ui";

const GENDERS = ["Men", "Women", "Kids", "Unisex"];
const BLANK = { name: "", description: "", price: "", discountPercentage: 0, category: "", brand: "DripVora", gender: "Men", stockQuantity: 10, sku: "", fabric: "", active: true };

function Field({ label, hint, error, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em]">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-mute">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-clay" role="alert">{error}</span>}
    </label>
  );
}

export default function AdminProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  // The backend has no "get one including hidden" endpoint, so edit loads the full list and picks the product.
  const { data: all, error: loadError, loading, reload } = useAsync(() => (editing ? getAllProducts() : Promise.resolve([])));
  const { data: categories } = useAsync(() => getCategories().catch(() => []));

  const [form, setForm] = useState(BLANK);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const existing = editing ? all?.find((p) => String(p.id) === id) : null;

  useEffect(() => {
    if (existing) {
      setForm({ ...BLANK, ...existing, discountPercentage: Number(existing.discountPercentage) || 0, price: Number(existing.price) });
      setPreview(existing.imageUrl || "");
    }
  }, [existing]);

  useEffect(() => () => { if (preview.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const cls = (k) => `${inputCls} ${errors[k] ? "!border-clay" : ""}`;

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Required";
    if (!form.description.trim()) err.description = "Required";
    if (!(Number(form.price) > 0)) err.price = "Enter a price above 0";
    const d = Number(form.discountPercentage);
    if (d < 0 || d > 90) err.discountPercentage = "Between 0 and 90";
    if (!form.category.trim()) err.category = "Required";
    if (!form.brand.trim()) err.brand = "Required";
    if (!form.sku.trim()) err.sku = "Required";
    if (!form.fabric.trim()) err.fabric = "Required";
    if (!(Number(form.stockQuantity) >= 0) || form.stockQuantity === "") err.stockQuantity = "Enter 0 or more";
    if (!editing && !image) err.image = "A product image is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix the highlighted fields");
    setBusy(true);
    try {
      const payload = toProductPayload(form);
      if (editing) await updateProduct(id, payload, image);
      else await createProduct(payload, image);
      toast.success(editing ? "Product updated" : "Product added");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (editing && loading && !all) return <Loading rows={6} />;
  if (editing && loadError) return <ErrorBox message={loadError} onRetry={reload} />;
  if (editing && all && !existing) return <ErrorBox message="That product no longer exists." />;

  return (
    <form onSubmit={submit} noValidate>
      <PageHead title={editing ? "Edit" : "New"} italic="product">
        <Link to="/admin/products" className="text-sm font-semibold link-u">Cancel</Link>
      </PageHead>

      <div className="grid gap-8 xl:grid-cols-[1fr_20rem]">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Product name" error={errors.name} className="sm:col-span-2"><input className={cls("name")} value={form.name} onChange={set("name")} maxLength={150} /></Field>
          <Field label="Description" error={errors.description} className="sm:col-span-2"><textarea rows={4} className={cls("description")} value={form.description} onChange={set("description")} /></Field>

          <Field label="Price (₹)" error={errors.price} hint="Original price before discount"><input type="number" min="0" step="0.01" className={cls("price")} value={form.price} onChange={set("price")} /></Field>
          <Field label="Discount (%)" error={errors.discountPercentage} hint="0 for no discount"><input type="number" min="0" max="90" step="0.5" className={cls("discountPercentage")} value={form.discountPercentage} onChange={set("discountPercentage")} /></Field>

          <Field label="Category" error={errors.category} hint="e.g. T-Shirts, Dresses, Denim">
            <input list="category-list" className={cls("category")} value={form.category} onChange={set("category")} maxLength={100} />
            <datalist id="category-list">{(categories || []).map((c) => <option key={c.id} value={c.name} />)}</datalist>
          </Field>
          <Field label="For">
            <select className={inputCls} value={form.gender} onChange={set("gender")}>{GENDERS.map((g) => <option key={g}>{g}</option>)}</select>
          </Field>

          <Field label="Brand" error={errors.brand}><input className={cls("brand")} value={form.brand} onChange={set("brand")} maxLength={100} /></Field>
          <Field label="Fabric" error={errors.fabric}><input className={cls("fabric")} value={form.fabric} onChange={set("fabric")} maxLength={100} /></Field>
          <Field label="SKU" error={errors.sku} hint="Must be unique"><input className={cls("sku")} value={form.sku} onChange={set("sku")} maxLength={100} /></Field>
          <Field label="Stock quantity" error={errors.stockQuantity}><input type="number" min="0" className={cls("stockQuantity")} value={form.stockQuantity} onChange={set("stockQuantity")} /></Field>

          <label className="flex items-center gap-3 sm:col-span-2">
            <input type="checkbox" className="h-4 w-4 accent-ink" checked={form.active} onChange={set("active")} />
            <span className="text-sm">Visible in the store</span>
          </label>
        </div>

        <aside>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em]">Image</p>
          <label className={`relative flex aspect-[4/5] cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed bg-bone text-center transition hover:border-ink ${errors.image ? "border-clay" : "border-ink/30"}`}>
            {preview ? <img src={preview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" /> : (
              <span className="px-6 text-sm text-mute"><ImagePlus className="mx-auto mb-2" size={28} strokeWidth={1.3} />Click to upload<br /><span className="text-xs">JPG, PNG or WebP · max 5 MB</span></span>
            )}
            <input type="file" accept="image/*" className="sr-only" onChange={pickImage} aria-label="Product image" />
          </label>
          {errors.image && <p className="mt-1 text-xs text-clay" role="alert">{errors.image}</p>}
          {editing && <p className="mt-2 text-xs text-mute">Leave unchanged to keep the current image.</p>}

          <button disabled={busy} className="mt-6 w-full bg-ink py-4 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-clay disabled:bg-mute">
            {busy ? "Saving…" : editing ? "Save changes" : "Add product"}
          </button>
        </aside>
      </div>
    </form>
  );
}
