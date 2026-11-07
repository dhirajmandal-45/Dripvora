import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const THEMES = ["default", "midnight", "sage", "rose"];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("dripvora_theme");
      return THEMES.includes(saved) ? saved : "default";
    } catch {
      return "default";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("dripvora_theme", theme); } catch { /* storage may be unavailable */ }
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
