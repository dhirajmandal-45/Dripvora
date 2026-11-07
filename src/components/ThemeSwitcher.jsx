import { useEffect, useState } from "react";
import { Check, Moon, Palette, Sun, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const OPTIONS = [
  { id: "default", name: "DripVora", detail: "Original warm neutral", swatches: ["#f6f3ec", "#111111", "#b5532f"] },
  { id: "midnight", name: "Midnight", detail: "Dark and minimal", swatches: ["#141615", "#f5f1e8", "#d28c68"] },
  { id: "sage", name: "Sage", detail: "Soft earthy green", swatches: ["#eef0e8", "#25332c", "#71866f"] },
  { id: "rose", name: "Rose", detail: "Muted blush tones", swatches: ["#f4e9e7", "#332625", "#b56c70"] },
];

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed right-4 top-1/2 z-[45] -translate-y-1/2 sm:right-5">
      {open && (
        <>
          <button aria-label="Close theme settings" className="fixed inset-0 z-0 cursor-default" onClick={() => setOpen(false)} />
          <section role="dialog" aria-modal="false" aria-label="Appearance settings" className="theme-panel absolute right-14 top-1/2 z-10 w-[min(19rem,calc(100vw-5.5rem))] -translate-y-1/2 border border-ink/10 bg-paper p-4 shadow-2xl sm:right-16 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Appearance</p>
                <p className="mt-1 text-xs text-mute">Choose your DripVora theme</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close appearance settings" className="grid h-8 w-8 place-items-center rounded-md hover:bg-bone"><X size={17} /></button>
            </div>
            <div className="space-y-2">
              {OPTIONS.map((option) => (
                <button key={option.id} onClick={() => setTheme(option.id)} aria-pressed={theme === option.id}
                  className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition ${theme === option.id ? "border-ink bg-bone" : "border-ink/10 hover:border-ink/40"}`}>
                  <span className="flex shrink-0 overflow-hidden rounded-full border border-ink/10">
                    {option.swatches.map((color) => <span key={color} className="h-5 w-5" style={{ backgroundColor: color }} />)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{option.name}</span>
                    <span className="mt-0.5 block text-[0.7rem] text-mute">{option.detail}</span>
                  </span>
                  {theme === option.id && <Check size={17} className="shrink-0" />}
                </button>
              ))}
            </div>
            <p className="mt-4 border-t border-ink/10 pt-3 text-[0.68rem] leading-relaxed text-mute">Your choice is saved on this device.</p>
          </section>
        </>
      )}
      <button onClick={() => setOpen((value) => !value)} aria-label="Open appearance settings" aria-expanded={open}
        className="relative z-20 grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-paper text-ink shadow-lg transition hover:-translate-x-0.5 hover:bg-ink hover:text-paper sm:h-14 sm:w-14">
        {theme === "midnight" ? <Moon size={20} /> : theme === "default" ? <Sun size={20} /> : <Palette size={20} />}
      </button>
    </div>
  );
}
