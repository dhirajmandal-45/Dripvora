import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../ProductCard";
import Reveal from "../Reveal";

export default function CollectionBlock({ eyebrow, title, italic, copy, to, art, products, flip = false }) {
  if (!products.length) return null;
  return (
    <section className="container-x pt-20 md:pt-28">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center">
        <Reveal className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
          <Link to={to} className="group relative block aspect-[4/5] overflow-hidden bg-bone">
            <img src={art} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105" />
          </Link>
        </Reveal>
        <div className={`lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          <Reveal>
            <p className="eyebrow text-clay mb-3">{eyebrow}</p>
            <h2 className="display text-5xl md:text-7xl">{title} <em className="font-normal italic">{italic}</em></h2>
            <p className="mt-4 max-w-md text-ink-soft">{copy}</p>
            <Link to={to} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold link-u">Explore the collection <ArrowRight size={16} /></Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
