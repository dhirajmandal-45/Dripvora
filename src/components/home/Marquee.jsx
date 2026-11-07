const WORDS = ["Premium fabrics", "Free shipping over ₹2,999", "30-day easy returns", "New drops every week", "Made to last"];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-bone py-4" aria-hidden>
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="display flex items-center gap-12 text-2xl italic text-ink-soft">
            {w} <span className="text-clay not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
