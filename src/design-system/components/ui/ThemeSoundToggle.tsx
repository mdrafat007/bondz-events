import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { playSwitchSound } from "../../lib/haptics";
import { setSoundEnabled, useSoundState } from "../../lib/sound-state";
import { setTheme, useTheme } from "../../lib/theme";
import { Button } from "./Button";
export interface ThemeSoundToggleProps extends HTMLAttributes<HTMLDivElement> { variant?: "pills" | "icons" }
export const ThemeSoundToggle = forwardRef<HTMLDivElement, ThemeSoundToggleProps>(function ThemeSoundToggle({ variant = "pills", className, ...props }, ref) {
  const sound = useSoundState();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const icons = variant === "icons";
  return <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
    <Button variant="outline" size={icons ? "icon" : "sm"} aria-label={sound ? "Mute sound" : "Enable sound"} aria-pressed={sound} title={sound ? "Mute sound" : "Enable sound"} onClick={() => { setSoundEnabled(!sound); if (!sound) playSwitchSound(true); }}>
      {icons ? <span aria-hidden="true">{sound ? "♫" : "♪̸"}</span> : sound ? "♫ SFX" : "♪ MUTE"}
    </Button>
    <Button variant="outline" size={icons ? "icon" : "sm"} aria-label={mounted && dark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={mounted && dark} title={mounted && dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setTheme(dark ? "light" : "dark")}>
      {icons ? <span aria-hidden="true">{mounted && dark ? "☼" : "☾"}</span> : mounted && dark ? "☼ LIGHT" : "☾ DARK"}
    </Button>
  </div>;
});
