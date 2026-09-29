import { useSyncExternalStore } from "react";

/** The pre-paint theme initializer lives in the root route head. */
export const THEME_STORAGE_KEY = "bondz-theme";

function subscribeTheme(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function useTheme(): { theme: "light" | "dark" } {
  const dark = useSyncExternalStore(subscribeTheme, () => document.documentElement.classList.contains("dark"), () => false);
  return { theme: dark ? "dark" : "light" };
}
