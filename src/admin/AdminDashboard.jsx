import ProductImage from "../components/ProductImage";
import { Link } from "react-router-dom";
import { getAllOrders, getAllProducts, getDashboard } from "../services/adminService";
import useAsync from "../hooks/useAsync";
import { formatDate, formatPrice } from "../lib/format";
import { statusLabel, statusStyle } from "../lib/orderStatus";
import { Empty, ErrorBox, Loading, PageHead } from "./ui";

export default function AdminDashboard() {
  const { data, error, loading, reload } = useAsync(async () => {
    const [stats, orders, products] = await Promise.all([getDashboard(), getAllOrders(), getAllProducts()]);
    return { stats, orders, products };
  });

  if (loading && !data) return <Loading />;
  if (error && !data) return <ErrorBox message={error} onRetry={reload} />;

  const { stats: s, orders, products } = data;
  const revenue = orders.filter((o) => o.paymentStatus === "PAID" && o.orderStatus !== "CANCELLED").reduce((n, o) => n + Number(o.totalAmount), 0);
  const recent = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
  const lowStock = products.filter((p) => p.stockQuantity <= 5).sort((a, b) => a.stockQuantity - b.stockQuantity).slice(0, 6);

  const cards = [
    { label: "Revenue (paid)", value: formatPrice(revenue) },
    { label: "Orders", value: s.totalOrders, sub: `${s.pendingOrders} pending · ${s.deliveredOrders} delivered` },
    { label: "Products", value: s.totalProducts, sub: `${s.activeProducts} active · ${s.lowStockProducts} low stock` },
    { label: "Customers", value: s.totalUsers, sub: `${s.verifiedUsers} verified · ${s.activeUsers} active` },
  ];

  return (
    <div>
      <PageHead title="Dashboard" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-bone p-5">
            <p className="eyebrow text-mute">{c.label}</p>
            <p className="display mt-2 text-4xl">{c.value}</p>
            {c.sub && <p className="mt-1 text-xs text-mute">{c.sub}</p>}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 xl:grid-cols-2">
        <section>
          <h3 className="display mb-4 text-3xl">Recent orders</h3>
          {recent.length === 0 ? <Empty>No orders yet.</Empty> : (
            <ul className="divide-y divide-ink/10 border border-ink/10">
              {recent.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span className="font-semibold">#{o.orderNumber}</span>
                  <span className="text-mute">{formatDate(o.createdAt)}</span>
                  <span>{formatPrice(o.totalAmount)}</span>
                  <span className={`px-2 py-0.5 text-[0.65rem] font-bold tracking-wider ${statusStyle(o.orderStatus)}`}>{statusLabel(o.orderStatus).toUpperCase()}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/orders" className="mt-3 inline-block text-sm font-semibold link-u">All orders →</Link>
        </section>

        <section>
          <h3 className="display mb-4 text-3xl">Low stock</h3>
          {lowStock.length === 0 ? <Empty>Every product is well stocked.</Empty> : (
            <ul className="divide-y divide-ink/10 border border-ink/10">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <ProductImage src={p.imageUrl} product={p} alt={p.name} className="h-12 w-10 bg-bone object-cover" />
                  <span className="flex-1 font-medium">{p.name}</span>
                  <span className={`font-semibold ${p.stockQuantity === 0 ? "text-clay" : ""}`}>{p.stockQuantity === 0 ? "Sold out" : `${p.stockQuantity} left`}</span>
                  <Link to={`/admin/products/${p.id}`} className="font-semibold link-u">Restock</Link>
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/products" className="mt-3 inline-block text-sm font-semibold link-u">All products →</Link>
        </section>
      </div>
    </div>
  );
}
