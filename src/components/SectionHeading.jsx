import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, italic, to, linkLabel = "Shop all", center = false }) {
  return (
    <Reveal className={`mb-8 md:mb-12 flex items-end gap-6 ${center ? "justify-center text-center" : "justify-between"}`}>
      <div>
        {eyebrow && <p className="eyebrow text-clay mb-3">{eyebrow}</p>}
        <h2 className="display text-4xl md:text-6xl">
          {title} {italic && <em className="font-normal italic">{italic}</em>}
        </h2>
      </div>
      {to && !center && (
        <Link to={to} className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold link-u shrink-0">
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </Reveal>
  );
}
