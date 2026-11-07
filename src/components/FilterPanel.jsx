const PRICE_BANDS = [
  { id: "u1500", label: "Under ₹1,500", test: (p) => p < 1500 },
  { id: "1500-3000", label: "₹1,500 – ₹3,000", test: (p) => p >= 1500 && p <= 3000 },
  { id: "o3000", label: "Above ₹3,000", test: (p) => p > 3000 },
];

// eslint-disable-next-line react-refresh/only-export-components
export { PRICE_BANDS };

function Group({ title, children }) {
  return (
    <fieldset className="border-t border-ink/10 py-6 first:border-t-0 first:pt-0">
      <legend className="eyebrow mb-4 float-left w-full">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

export default function FilterPanel({ types, filters, setFilters, onClear }) {
  const toggle = (key, value) =>
    setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));

  return (
    <div>
      {types.length > 1 && (
        <Group title="Type">
          <ul className="space-y-2.5">
            {types.map((t) => (
              <li key={t}>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <input type="checkbox" className="h-4 w-4 accent-ink" checked={filters.types.includes(t)} onChange={() => toggle("types", t)} />
                  {t}
                </label>
              </li>
            ))}
          </ul>
        </Group>
      )}

      <Group title="Price">
        <ul className="space-y-2.5">
          {PRICE_BANDS.map((b) => (
            <li key={b.id}>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="checkbox" className="h-4 w-4 accent-ink" checked={filters.prices.includes(b.id)} onChange={() => toggle("prices", b.id)} />
                {b.label}
              </label>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Availability">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-ink" checked={filters.inStock} onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.checked }))} />
          In stock only
        </label>
      </Group>

      <button onClick={onClear} className="mt-2 text-sm font-semibold link-u">Clear all filters</button>
    </div>
  );
}
