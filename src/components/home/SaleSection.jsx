import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../ProductCard";
import Reveal from "../Reveal";
import { discountPercent } from "../../lib/format";

export default function SaleSection({ products }) {
  if (!products.length) return null;
  const max = Math.max(0, ...products.map(discountPercent));
  return (
    <section className="mt-20 bg-ink py-16 text-paper md:mt-28 md:py-24">
      <div className="container-x">
        <Reveal className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3 text-clay">Season sale</p>
            <h2 className="display text-5xl md:text-7xl">Up to <em className="font-normal italic text-clay">{max}% off</em></h2>
          </div>
          <Link to="/shop/sale" className="hidden items-center gap-2 text-sm font-semibold link-u sm:inline-flex">Shop all sale <ArrowRight size={16} /></Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4 [&_a:hover]:text-clay [&_.text-mute]:!text-paper/50 [&_.bg-bone]:!bg-paper/10">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <Link to="/shop/sale" className="mt-10 block bg-paper py-4 text-center text-sm font-semibold text-ink sm:hidden">Shop all sale</Link>
      </div>
    </section>
  );
}
