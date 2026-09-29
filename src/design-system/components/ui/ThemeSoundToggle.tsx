import { forwardRef, useEffect, useState, useSyncExternalStore, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { playSwitchSound, playTapSound } from "../../lib/haptics";
import { setSoundEnabled, useSoundState } from "../../lib/sound-state";
import { Button } from "./Button";
const themeListeners = new Set<() => void>();
function subscribeTheme(listener: () => void) { themeListeners.add(listener); return () => { themeListeners.delete(listener); }; }
function getTheme() { return typeof document !== "undefined" && document.documentElement.classList.contains("dark"); }
function useDarkTheme() {
  const dark = useSyncExternalStore(subscribeTheme, getTheme, () => false);
  useEffect(() => {
    const observer = new MutationObserver(() => themeListeners.forEach((listener) => listener()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    themeListeners.forEach((listener) => listener());
    return () => observer.disconnect();
  }, []);
  return dark;
}
export interface ThemeSoundToggleProps extends HTMLAttributes<HTMLDivElement> { variant?: "pills" | "icons" }
export const ThemeSoundToggle = forwardRef<HTMLDivElement, ThemeSoundToggleProps>(function ThemeSoundToggle({ variant = "pills", className, ...props }, ref) {
  const sound = useSoundState();
  const dark = useDarkTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const icons = variant === "icons";
  return <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
    <Button variant="outline" size={icons ? "icon" : "sm"} aria-label={sound ? "Mute sound" : "Enable sound"} aria-pressed={sound} title={sound ? "Mute sound" : "Enable sound"} onClick={() => { setSoundEnabled(!sound); if (!sound) playSwitchSound(true); }}>
      {icons ? <span aria-hidden="true">{sound ? "♫" : "♪̸"}</span> : sound ? "♫ SFX" : "♪ MUTE"}
    </Button>
    <Button variant="outline" size={icons ? "icon" : "sm"} aria-label={mounted && dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={mounted && dark} title={mounted && dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => { playTapSound(); const next = !document.documentElement.classList.contains("dark"); document.documentElement.classList.toggle("dark", next); try { localStorage.setItem("bondz-theme", next ? "dark" : "light"); } catch { /* Storage may be blocked. */ } themeListeners.forEach((listener) => listener()); }}>
      {icons ? <span aria-hidden="true">{mounted && dark ? "☼" : "☾"}</span> : mounted && dark ? "☼ LIGHT" : "☾ DARK"}
    </Button>
  </div>;
});
