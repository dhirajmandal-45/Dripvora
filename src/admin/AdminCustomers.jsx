import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { getUsers, promoteUser, setUserActive } from "../services/adminService";
import useAsync from "../hooks/useAsync";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../lib/format";
import { Badge, Empty, ErrorBox, Loading, PageHead, Table, inputCls } from "./ui";

export default function AdminCustomers() {
  const { user: me } = useAuth();
  const { data: users, error, loading, reload, setData } = useAsync(getUsers);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(null);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (users || []).filter((u) => !t || `${u.name} ${u.email} ${u.city}`.toLowerCase().includes(t)).sort((a, b) => b.id - a.id);
  }, [users, q]);

  const toggle = async (u) => {
    setBusy(u.id);
    try {
      await setUserActive(u.id, !u.active);
      setData((list) => list.map((x) => (x.id === u.id ? { ...x, active: !u.active } : x)));
      toast.success(u.active ? "Account deactivated" : "Account reactivated");
    } catch (e) { toast.error(e.message); }
    finally { setBusy(null); }
  };

  const promote = async (u) => {
    if (!confirm(`Make ${u.name} an admin? They'll get full access to this panel.`)) return;
    setBusy(u.id);
    try {
      await promoteUser(u.id);
      setData((list) => list.map((x) => (x.id === u.id ? { ...x, role: "ADMIN" } : x)));
      toast.success(`${u.name} is now an admin`);
    } catch (e) { toast.error(e.message); }
    finally { setBusy(null); }
  };

  return (
    <div>
      <PageHead title="Customers" />
      <div className="relative mb-4 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mute" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, city…" aria-label="Search customers" className={`${inputCls} pl-9`} />
      </div>

      {loading && !users ? <Loading /> : error && !users ? <ErrorBox message={error} onRetry={reload} /> : rows.length === 0 ? <Empty>No customers found.</Empty> : (
        <Table head={["Customer", "Location", "Joined", "Status", ""]} min="46rem">
          {rows.map((u) => (
            <tr key={u.id} className={busy === u.id ? "opacity-50" : ""}>
              <td className="p-3"><p className="font-medium">{u.name} {u.role === "ADMIN" && <Badge tone="clay">ADMIN</Badge>}</p><p className="text-xs text-mute">{u.email}</p></td>
              <td className="p-3">{[u.city, u.state].filter(Boolean).join(", ") || "—"}</td>
              <td className="p-3">{formatDate(u.createdAt)}</td>
              <td className="p-3 space-x-1.5">
                <Badge tone={u.active ? "ok" : "soft"}>{u.active ? "ACTIVE" : "INACTIVE"}</Badge>
                <Badge tone={u.emailVerified ? "ink" : "soft"}>{u.emailVerified ? "VERIFIED" : "UNVERIFIED"}</Badge>
              </td>
              <td className="p-3">
                {u.email !== me.email && (
                  <div className="flex justify-end gap-4 text-xs font-semibold">
                    <button onClick={() => toggle(u)} disabled={busy === u.id} className="link-u">{u.active ? "Deactivate" : "Reactivate"}</button>
                    {u.role !== "ADMIN" && <button onClick={() => promote(u)} disabled={busy === u.id} className="link-u text-clay">Make admin</button>}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
