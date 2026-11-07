import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { createCategory, deleteCategory, updateCategory } from "../services/adminService";
import { getCategories } from "../services/productService";
import useAsync from "../hooks/useAsync";
import { Empty, ErrorBox, Loading, PageHead, inputCls } from "./ui";

export default function AdminCategories() {
  const { data: categories, error, loading, reload } = useAsync(getCategories);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({ name: "", description: "" });
  const [busy, setBusy] = useState(false);

  const act = async (fn, success) => {
    setBusy(true);
    try { await fn(); toast.success(success); await reload(); return true; }
    catch (e) { toast.error(e.message); return false; }
    finally { setBusy(false); }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Give the category a name");
    if (await act(() => createCategory({ name: form.name.trim(), description: form.description.trim() }), "Category added")) setForm({ name: "", description: "" });
  };

  const save = async (id) => {
    if (!draft.name.trim()) return toast.error("Name can't be empty");
    if (await act(() => updateCategory(id, { name: draft.name.trim(), description: draft.description.trim() }), "Category updated")) setEditId(null);
  };

  const remove = (c) => confirm(`Remove “${c.name}”? Products already using it keep their category text.`) && act(() => deleteCategory(c.id), "Category removed");

  return (
    <div>
      <PageHead title="Categories" />

      <form onSubmit={add} className="mb-8 grid gap-3 bg-bone p-4 sm:grid-cols-[1fr_1.6fr_auto]">
        <input className={inputCls} placeholder="Name (e.g. Hoodies)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} aria-label="Category name" />
        <input className={inputCls} placeholder="Short description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} aria-label="Category description" />
        <button disabled={busy} className="bg-ink px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-clay disabled:bg-mute">Add category</button>
      </form>

      {loading && !categories ? <Loading /> : error && !categories ? <ErrorBox message={error} onRetry={reload} /> : categories.length === 0 ? <Empty>No categories yet.</Empty> : (
        <ul className="divide-y divide-ink/10 border border-ink/10">
          {categories.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              {editId === c.id ? (
                <>
                  <input className={`${inputCls} flex-1`} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} aria-label="Name" />
                  <input className={`${inputCls} flex-[2]`} value={draft.description || ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} aria-label="Description" />
                  <button onClick={() => save(c.id)} disabled={busy} aria-label="Save" className="text-ok"><Check size={19} /></button>
                  <button onClick={() => setEditId(null)} aria-label="Cancel" className="text-mute hover:text-ink"><X size={19} /></button>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1"><p className="font-medium">{c.name}</p>{c.description && <p className="truncate text-xs text-mute">{c.description}</p>}</div>
                  <button onClick={() => { setEditId(c.id); setDraft({ name: c.name, description: c.description || "" }); }} aria-label={`Edit ${c.name}`} className="text-mute hover:text-ink"><Pencil size={17} /></button>
                  <button onClick={() => remove(c)} disabled={busy} aria-label={`Remove ${c.name}`} className="text-mute hover:text-clay"><Trash2 size={17} /></button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
