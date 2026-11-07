import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

const TILES = [
  { label: "Men", to: "/shop/men", art: "/art/product-men.svg", note: "Basics & layers" },
  { label: "Women", to: "/shop/women", art: "/art/product-women.svg", note: "Dresses & knits" },
  { label: "Kids", to: "/shop/kids", art: "/art/product-kids.svg", note: "Play-ready" },
];

export default function CategoryTiles() {
  return (
    <section className="container-x pt-20 md:pt-28">
      <SectionHeading eyebrow="Featured categories" title="Shop by" italic="category" />
      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {TILES.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.1}>
            <Link to={t.to} className="group relative block aspect-[4/5] overflow-hidden bg-bone">
              <img src={t.art} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-paper">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80">{t.note}</p>
                  <h3 className="display text-5xl md:text-6xl mt-1">{t.label}</h3>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight size={20} /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
