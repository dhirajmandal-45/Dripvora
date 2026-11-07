import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SLIDES = [
  { eyebrow: "Autumn Edit — 2026", title: "Dressed for the", italic: "in-between", copy: "Tailoring, satin and soft knits for days that start cold and end golden.", cta: ["Shop women", "/shop/women"], alt: ["Shop men", "/shop/men"], art: `${import.meta.env.BASE_URL}art/product-women.svg` },
  { eyebrow: "Street Essentials", title: "Built to be", italic: "lived in", copy: "Heavyweight cotton, utility cuts and quiet colours that go with everything.", cta: ["Shop men", "/shop/men"], alt: ["New arrivals", "/shop/new-arrivals"], art: `${import.meta.env.BASE_URL}art/product-hoodie.svg` },
  { eyebrow: "Mini DripVora", title: "Little looks,", italic: "big play", copy: "Soft, tough, brightly coloured pieces made for playgrounds and growth spurts.", cta: ["Shop kids", "/shop/kids"], alt: ["On sale", "/shop/sale"], art: `${import.meta.env.BASE_URL}art/product-kids.svg` },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, [paused]);

  const s = SLIDES[i];

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel" aria-label="Featured collections"
    >
      <div className="container-x grid items-center gap-7 py-7 sm:gap-8 md:py-12 lg:grid-cols-12 lg:gap-6 lg:min-h-[44rem]">
        <div className="lg:col-span-6 lg:pr-10 order-2 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <p className="eyebrow text-clay mb-5">{s.eyebrow}</p>
              <h1 className="display text-[clamp(2.8rem,8vw,4.4rem)] sm:text-7xl xl:text-[7.5rem]">
                {s.title}<br /><em className="font-normal italic">{s.italic}</em>
              </h1>
              <p className="mt-6 max-w-md text-base md:text-lg text-ink-soft leading-relaxed">{s.copy}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link to={s.cta[1]} className="group inline-flex items-center gap-3 bg-ink px-8 py-4 text-sm font-semibold tracking-wide text-paper transition-colors hover:bg-clay">
                  {s.cta[0]} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to={s.alt[1]} className="link-u text-sm font-semibold">{s.alt[0]}</Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center gap-3" role="tablist" aria-label="Choose slide">
            {SLIDES.map((_, n) => (
              <button key={n} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className="group py-3">
                <span className={`block h-0.5 transition-all duration-500 ${n === i ? "w-14 bg-ink" : "w-7 bg-ink/25 group-hover:bg-ink/50"}`} />
              </button>
            ))}
            <span className="ml-2 text-xs tabular-nums text-mute">0{i + 1} / 0{SLIDES.length}</span>
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden bg-bone lg:max-w-none lg:aspect-auto lg:h-[40rem]">
            <AnimatePresence initial={false}>
              <motion.img
                key={s.art} src={s.art} alt="" fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <div className="absolute bottom-4 left-4 bg-paper/90 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] backdrop-blur">New season</div>
          </div>
        </div>
      </div>
    </section>
  );
}
