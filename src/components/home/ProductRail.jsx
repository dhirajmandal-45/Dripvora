import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../ProductCard";
import SectionHeading from "../SectionHeading";

// Horizontally scrollable row of product cards (touch-swipe on mobile, arrows on desktop).
export default function ProductRail({ eyebrow, title, italic, to, products }) {
  const ref = useRef(null);
  if (!products.length) return null;
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section className="container-x pt-20 md:pt-28">
      <SectionHeading eyebrow={eyebrow} title={title} italic={italic} to={to} />
      <div className="relative">
        <div ref={ref} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:-mx-0 md:gap-6 md:px-0">
          {products.map((p, i) => (
            <div key={p.id} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[28%] lg:w-[23.5%]">
              <ProductCard product={p} priority={i < 3} />
            </div>
          ))}
        </div>
        <button onClick={() => scroll(-1)} aria-label="Scroll left" className="absolute -left-5 top-[38%] hidden h-11 w-11 place-items-center rounded-full bg-paper shadow-lg transition hover:bg-ink hover:text-paper lg:grid"><ChevronLeft size={20} /></button>
        <button onClick={() => scroll(1)} aria-label="Scroll right" className="absolute -right-5 top-[38%] hidden h-11 w-11 place-items-center rounded-full bg-paper shadow-lg transition hover:bg-ink hover:text-paper lg:grid"><ChevronRight size={20} /></button>
      </div>
    </section>
  );
}
