import { RefreshCw, ServerCrash } from "lucide-react";

// Shown when the product list can't be loaded from the backend.
export default function ApiStatus({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="container-x pt-8" role="alert">
      <div className="flex flex-col items-start gap-4 border border-clay/40 bg-clay/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ServerCrash className="mt-0.5 shrink-0 text-clay" size={22} />
          <div>
            <p className="font-semibold">We couldn't load the collection</p>
            <p className="text-sm text-ink-soft">{error}</p>
          </div>
        </div>
        <button onClick={onRetry} className="flex shrink-0 items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay">
          <RefreshCw size={15} /> Try again
        </button>
      </div>
    </div>
  );
}
