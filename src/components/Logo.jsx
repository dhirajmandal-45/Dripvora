import { Link } from "react-router-dom";

export default function Logo({ className = "", light = false }) {
  return (
    <Link
      to="/"
      aria-label="DripVora home"
      className={`display text-[1.65rem] md:text-[1.9rem] font-semibold tracking-[0.16em] ${light ? "text-paper" : "text-ink"} ${className}`}
    >
      DRIPVORA<span className="text-clay">.</span>
    </Link>
  );
}
