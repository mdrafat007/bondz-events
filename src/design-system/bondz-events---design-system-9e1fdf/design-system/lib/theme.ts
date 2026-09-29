import { useSyncExternalStore } from "react";

/** The preview app applies the saved theme before first paint. */
export const THEME_STORAGE_KEY = "bondz-theme";

export function setTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* Storage may be blocked. */ }
}

function subscribeTheme(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function useTheme(): { theme: "light" | "dark" } {
  const dark = useSyncExternalStore(subscribeTheme, () => document.documentElement.classList.contains("dark"), () => false);
  return { theme: dark ? "dark" : "light" };
}
