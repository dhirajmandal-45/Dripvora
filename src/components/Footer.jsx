import { Link } from "react-router-dom";
import { Camera, AtSign, Play } from "lucide-react";
import Logo from "./Logo";

const cols = [
  { title: "Shop", links: [["Men", "/shop/men"], ["Women", "/shop/women"], ["Kids", "/shop/kids"], ["New Arrivals", "/shop/new-arrivals"], ["Sale", "/shop/sale"]] },
  { title: "Help", links: [["Track an order", "/orders"], ["Shipping & delivery", "#"], ["Returns & exchanges", "#"], ["Size guide", "#"], ["Contact us", "#"]] },
  { title: "Company", links: [["Our story", "#"], ["Sustainability", "#"], ["Careers", "#"], ["Press", "#"], ["Stores", "#"]] },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/60">
            Considered fashion for every day. Premium fabrics, honest prices and cuts that look as good on the tenth wear as the first.
          </p>
          <div className="mt-6 flex gap-3">
            {[Camera, AtSign, Play].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="grid h-10 w-10 place-items-center rounded-full border border-paper/20 transition hover:bg-paper hover:text-ink"><Icon size={17} /></a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title} className="md:col-span-2">
            <h3 className="eyebrow mb-5 text-paper/50">{c.title}</h3>
            <ul className="space-y-3 text-sm">
              {c.links.map(([label, to]) => (
                <li key={label}>
                  {to.startsWith("/") ? <Link to={to} className="text-paper/85 transition hover:text-paper link-u">{label}</Link> : <a href={to} className="text-paper/85 transition hover:text-paper link-u">{label}</a>}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="md:col-span-2">
          <h3 className="eyebrow mb-5 text-paper/50">Visit</h3>
          <address className="text-sm not-italic leading-relaxed text-paper/85">
            12 Fashion Street<br />Bandra West, Mumbai<br />hello@dripvora.com
          </address>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-paper/50 sm:flex-row">
          <p>© {new Date().getFullYear()} DripVora. All rights reserved.</p>
          <p>Secure checkout · Cash on delivery · UPI · Cards</p>
        </div>
      </div>
    </footer>
  );
}
