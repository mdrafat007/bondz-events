import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lockup } from "./Brand";
import { playTapSound, useSoundState } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";
import { triggerBookingTransition } from "@/lib/booking-transition";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/book", label: "Get a Booking" },
  { to: "/how-it-works", label: "Who is Mr. Bondz" },
  { to: "/portfolios", label: "Events Gallery" },
  { to: "/services", label: "Event Services" },
  { to: "/partners", label: "Partners" },
  { to: "/contact", label: "Contact" },
  { to: "/connect-ai", label: "Connect AI Agent" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSoundState();

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playTapSound();
    setOpen(false);
    triggerBookingTransition(() => navigate({ to: "/book", search: { intro: 1 } }));
  };

  return (
    <header className="relative z-40 shrink-0 bg-canvas transition-colors duration-300">
      <div className="flex h-16 sm:h-20 md:h-22 items-center justify-between gap-2.5 sm:gap-4 px-3.5 sm:px-6 md:px-8">
        {/* Brand Lockup */}
        <Link
          to="/"
          aria-label="Bondz Events home"
          className="shrink-0 transition-opacity hover:opacity-90"
          onClick={() => {
            playTapSound();
            setOpen(false);
          }}
        >
          <Lockup className="h-7.5 sm:h-9 md:h-11" />
        </Link>

        {/* Desktop Navigation & Utilities (scales gracefully from lg to xl+) */}
        <div className="hidden items-center gap-3 lg:flex">
          <nav className="flex items-center gap-1 xl:gap-2.5">
            {LINKS.map((l, i) => {
              const isBooking = l.to === "/book";
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={isBooking ? handleBookingClick : playTapSound}
                  className="group relative flex items-center px-2.5 xl:px-3 py-2 font-display text-[0.88rem] xl:text-[0.98rem] font-black uppercase tracking-tight text-ink/85 transition-colors hover:text-ink [font-variation-settings:'wdth'_85]"
                  activeProps={{ className: "!text-ink" }}
                >
                  {({ isActive }) => (
                    <span className="relative inline-flex items-center">
                      {/* Number at the top-left corner of the link name (13px+ high contrast) */}
                      <span className="font-serif-i absolute -top-3 -left-3 text-[0.84rem] xl:text-[0.90rem] font-bold italic text-primary select-none pointer-events-none drop-shadow-xs">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{l.label}</span>
                      <span
                        className={cn(
                          "absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-primary transition-transform duration-300",
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Tactile Utility Controls (Sound & Theme) */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-ink/20">
            {/* Realistic Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? "Mute realistic sound effects" : "Enable realistic sound effects"}
              title={soundEnabled ? "Sound ON - Click to mute" : "Sound MUTED - Click to enable"}
              className={cn(
                "group relative flex items-center gap-1.5 rounded-full border hairline px-2.5 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs",
                soundEnabled
                  ? "bg-surface-light text-ink border-ink/25 hover:border-ink"
                  : "bg-surface-light/50 text-ink/50 border-ink/15 hover:text-ink",
              )}
            >
              {soundEnabled ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-primary">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-ink/50">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
              <span className="font-mono text-[0.68rem] uppercase tracking-wider">
                {soundEnabled ? "SFX" : "MUTE"}
              </span>
            </button>

            {/* Realistic Light / Dark Mood Toggle */}
            <button
              type="button"
              onClick={() => {
                playTapSound();
                toggleTheme();
              }}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Dark Mood active - Click for light" : "Light Mood active - Click for dark"}
              className="flex items-center gap-1.5 rounded-full border hairline bg-surface-light px-2.5 py-1.5 text-xs font-bold text-ink transition-all hover:border-ink hover:bg-canvas active:scale-95 cursor-pointer shadow-xs border-ink/25"
            >
              {theme === "dark" ? (
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
              <span className="font-mono text-[0.68rem] uppercase tracking-wider">
                {theme === "dark" ? "DARK" : "LIGHT"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Controls (< lg) */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          {/* Quick Sound & Theme Toggles (hidden when drawer is open) */}
          {!open && (
            <>
              <button
                type="button"
                onClick={toggleSound}
                aria-label="Toggle sound"
                className="flex size-8 sm:size-9 items-center justify-center rounded-full border hairline bg-surface-light text-ink active:scale-95"
              >
                {soundEnabled ? (
                  <span className="text-primary text-xs font-bold">♪</span>
                ) : (
                  <span className="text-ink/40 text-xs font-bold">✕</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  toggleTheme();
                }}
                aria-label="Toggle theme"
                className="flex size-8 sm:size-9 items-center justify-center rounded-full border hairline bg-surface-light text-ink active:scale-95"
              >
                {theme === "dark" ? "☼" : "☾"}
              </button>
            </>
          )}

          {/* Menu Button */}
          <button
            className="eyebrow flex items-center gap-1.5 sm:gap-2 rounded-full border hairline bg-surface-light px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-ink shadow-sm transition hover:border-ink hover:bg-canvas active:scale-95"
            onClick={() => {
              playTapSound();
              setOpen((o) => !o);
            }}
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            <span className="text-primary font-bold text-xs sm:text-sm">{open ? "✕" : "☰"}</span>
            <span className="font-display font-extrabold uppercase tracking-wider text-[0.68rem] sm:text-xs">{open ? "CLOSE" : "MENU"}</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Navigation */}
      {open && (
        <div className="absolute inset-x-0 top-full z-50 max-h-[82vh] overflow-y-auto scroll-quiet border-b hairline bg-canvas/98 px-5 sm:px-8 pb-6 pt-3 shadow-2xl backdrop-blur-md lg:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col divide-y hairline">
            {LINKS.map((l, i) => {
              const isBooking = l.to === "/book";
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={isBooking ? handleBookingClick : () => {
                    playTapSound();
                    setOpen(false);
                  }}
                  className="group flex items-baseline justify-between py-3 transition-colors hover:text-primary"
                  activeProps={{ className: "!text-primary" }}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif-i text-base sm:text-lg font-normal italic text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink group-hover:text-primary transition-colors [font-variation-settings:'wdth'_85]">
                      {l.label}
                    </span>
                  </div>
                  <span className="text-ink/40 group-hover:text-primary transition-transform group-hover:translate-x-1 font-bold">
                    →
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Drawer Footer Preferences */}
          <div className="mt-4 flex items-center justify-center gap-3 border-t border-ink/15 pt-4">
            <button
              type="button"
              onClick={toggleSound}
              className="flex items-center gap-1.5 rounded-full border hairline bg-surface-light px-4 py-2 text-xs font-bold text-ink active:scale-95 shadow-xs"
            >
              <span>{soundEnabled ? "♪ Sound ON" : "✕ Sound OFF"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playTapSound();
                toggleTheme();
              }}
              className="flex items-center gap-1.5 rounded-full border hairline bg-surface-light px-4 py-2 text-xs font-bold text-ink active:scale-95 shadow-xs"
            >
              <span>{theme === "dark" ? "☼ Light Mood" : "☾ Dark Mood"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

