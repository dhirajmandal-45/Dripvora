import { RefreshCw } from "lucide-react";

export const inputCls = "w-full border border-ink/25 bg-paper px-3 py-2.5 text-sm outline-none transition focus:border-ink";

export function PageHead({ title, italic, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <h2 className="display text-4xl md:text-5xl">{title} {italic && <em className="font-normal italic">{italic}</em>}</h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function Loading({ rows = 4 }) {
  return <div className="space-y-3" aria-busy="true">{Array.from({ length: rows }, (_, i) => <div key={i} className="h-14 animate-pulse bg-bone" />)}</div>;
}

export function ErrorBox({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border border-clay/40 bg-clay/5 p-4 text-sm" role="alert">
      <span>{message}</span>
      {onRetry && <button onClick={onRetry} className="flex items-center gap-2 font-semibold link-u"><RefreshCw size={14} />Retry</button>}
    </div>
  );
}

export function Empty({ children }) {
  return <p className="border border-dashed border-ink/25 p-10 text-center text-mute">{children}</p>;
}

export function Table({ head, children, min = "44rem" }) {
  return (
    <div className="overflow-x-auto border border-ink/10">
      <table className="w-full text-left text-sm" style={{ minWidth: min }}>
        <thead className="bg-bone text-xs uppercase tracking-[0.12em]">
          <tr>{head.map((h) => <th key={h} className="p-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-ink/10">{children}</tbody>
      </table>
    </div>
  );
}

export function Badge({ children, tone = "ink" }) {
  const tones = { ink: "bg-ink text-paper", ok: "bg-ok text-paper", clay: "bg-clay text-paper", soft: "bg-stone text-ink" };
  return <span className={`inline-block px-2 py-0.5 text-[0.65rem] font-bold tracking-wider ${tones[tone]}`}>{children}</span>;
}
