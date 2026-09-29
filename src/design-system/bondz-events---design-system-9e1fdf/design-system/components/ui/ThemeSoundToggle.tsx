import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { playSwitchSound, playTapSound } from "../../lib/haptics";
import { setSoundEnabled, useSoundState } from "../../lib/sound-state";
import { setTheme, useTheme } from "../../lib/theme";

export interface ThemeSoundToggleProps extends HTMLAttributes<HTMLDivElement> { variant?: "pills" | "icons" }

export const ThemeSoundToggle = forwardRef<HTMLDivElement, ThemeSoundToggleProps>(function ThemeSoundToggle({ className, ...props }, ref) {
  const sound = useSoundState();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div ref={ref} className={cn("flex items-center gap-1.5 pl-3 border-l border-hairline", className)} {...props}>
      <button
        type="button"
        onClick={() => {
          setSoundEnabled(!sound);
          if (!sound) playSwitchSound(true);
        }}
        aria-label={sound ? "Mute sound effects" : "Enable sound effects"}
        title={sound ? "Sound ON (Click to mute)" : "Sound MUTED (Click to enable)"}
        className={cn(
          "group relative flex items-center gap-1.5 rounded-full border border-hairline px-2.5 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs",
          sound
            ? "bg-surface-light text-ink border-ink/25 hover:border-ink"
            : "bg-surface-light/50 text-ink/50 border-hairline hover:text-ink",
        )}
      >
        {sound ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-primary">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-ink/40">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
        <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider">
          {sound ? "SFX" : "MUTE"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => {
          playTapSound();
          setTheme(dark ? "light" : "dark");
        }}
        aria-label={mounted && dark ? "Switch to light mode" : "Switch to dark mode"}
        title={mounted && dark ? "Dark mode active (Click for light)" : "Light mode active (Click for dark)"}
        className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface-light px-2.5 py-1.5 text-xs font-bold text-ink transition-all hover:border-ink hover:bg-canvas active:scale-95 cursor-pointer shadow-xs border-ink/25"
      >
        {mounted && dark ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-amber-400">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-primary">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider">
          {mounted && dark ? "DARK" : "LIGHT"}
        </span>
      </button>
    </div>
  );
});
