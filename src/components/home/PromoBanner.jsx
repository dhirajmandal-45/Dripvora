import { Link } from "react-router-dom";
import Reveal from "../Reveal";

export default function PromoBanner() {
  return (
    <section className="container-x pt-20 md:pt-28">
      <Reveal>
        <div className="relative isolate overflow-hidden bg-clay text-paper">
          <img src="/art/promo-wide.svg" alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover object-right" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-clay via-clay/70 to-transparent md:via-clay/30" />
          <div className="max-w-xl px-7 py-14 md:px-14 md:py-24">
            <p className="eyebrow mb-4 opacity-80">Limited time</p>
            <h2 className="display text-5xl md:text-7xl">Layer up.<br /><em className="font-normal italic">Save up to 25%.</em></h2>
            <p className="mt-5 max-w-sm opacity-90">The winter edit — hoodies, knits and jackets, marked down for a short while.</p>
            <Link to="/shop/sale" className="mt-8 inline-block bg-paper px-8 py-4 text-sm font-semibold tracking-wide text-ink transition hover:bg-ink hover:text-paper">Shop the edit</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
