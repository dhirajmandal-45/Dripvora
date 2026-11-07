import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Shirt, Tags, Users } from "lucide-react";

const LINKS = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", Icon: Shirt },
  { to: "/admin/categories", label: "Categories", Icon: Tags },
  { to: "/admin/orders", label: "Orders", Icon: Package },
  { to: "/admin/customers", label: "Customers", Icon: Users },
];

export default function AdminLayout() {
  return (
    <div className="container-x py-8 md:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2 text-clay">Admin</p>
          <h1 className="display text-5xl md:text-6xl">Store <em className="font-normal italic">manager</em></h1>
        </div>
        <Link to="/" className="text-sm font-semibold link-u">← Back to store</Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[13rem_1fr]">
        <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col" aria-label="Admin">
          {LINKS.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex shrink-0 items-center gap-3 px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-ink text-paper" : "bg-bone hover:bg-stone"}`}>
              <Icon size={17} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0"><Outlet /></div>
      </div>
    </div>
  );
}
