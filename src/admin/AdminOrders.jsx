import { Fragment, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "../services/adminService";
import useAsync from "../hooks/useAsync";
import { formatDateTime, formatPrice } from "../lib/format";
import { ORDER_STATUSES, statusLabel } from "../lib/orderStatus";
import { Badge, Empty, ErrorBox, Loading, PageHead, Table, inputCls } from "./ui";

export default function AdminOrders() {
  const { data: orders, error, loading, reload, setData } = useAsync(getAllOrders);
  const [filter, setFilter] = useState("ALL");
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(null);

  const rows = useMemo(
    () => [...(orders || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter((o) => filter === "ALL" || o.orderStatus === filter),
    [orders, filter]
  );

  const change = async (o, status) => {
    setBusy(o.id);
    try {
      const saved = await updateOrderStatus(o.id, status);
      setData((list) => list.map((x) => (x.id === o.id ? saved : x)));
      toast.success(`Order #${o.orderNumber} → ${statusLabel(status)}`);
    } catch (e) { toast.error(e.message); }
    finally { setBusy(null); }
  };

  return (
    <div>
      <PageHead title="Orders">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status" className={`${inputCls} !w-auto`}>
          <option value="ALL">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </PageHead>

      {loading && !orders ? <Loading /> : error && !orders ? <ErrorBox message={error} onRetry={reload} /> : rows.length === 0 ? <Empty>No orders found.</Empty> : (
        <Table head={["Order", "Customer", "Placed", "Total", "Payment", "Status"]} min="52rem">
          {rows.map((o) => (
            <Fragment key={o.id}>
              <tr className={busy === o.id ? "opacity-50" : ""}>
                <td className="p-3">
                  <button onClick={() => setOpen(open === o.id ? null : o.id)} aria-expanded={open === o.id} className="flex items-center gap-1.5 font-semibold">
                    #{o.orderNumber} <ChevronDown size={15} className={`transition-transform ${open === o.id ? "rotate-180" : ""}`} />
                  </button>
                </td>
                <td className="p-3">{o.user?.name}<br /><span className="text-xs text-mute">{o.user?.email}</span></td>
                <td className="p-3">{formatDateTime(o.createdAt)}</td>
                <td className="p-3 font-semibold">{formatPrice(o.totalAmount)}</td>
                <td className="p-3"><Badge tone={o.paymentStatus === "PAID" ? "ok" : "soft"}>{o.paymentStatus}</Badge></td>
                <td className="p-3">
                  <select value={o.orderStatus} disabled={busy === o.id} onChange={(e) => change(o, e.target.value)} aria-label={`Status of order ${o.orderNumber}`} className={`${inputCls} !w-auto !py-1.5`}>
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                  </select>
                </td>
              </tr>
              {open === o.id && (
                <tr className="bg-bone/60">
                  <td colSpan={6} className="p-4">
                    <p className="mb-3 text-sm"><span className="font-semibold">Ship to:</span> {o.shippingAddress}</p>
                    <ul className="space-y-1.5 text-sm">
                      {o.items.map((it) => (
                        <li key={it.id} className="flex justify-between gap-4"><span>{it.productName} × {it.quantity}</span><span>{formatPrice(it.subtotal)}</span></li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </Table>
      )}
    </div>
  );
}
