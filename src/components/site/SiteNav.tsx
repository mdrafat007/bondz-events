import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lockup } from "./Brand";
import { playTapSound, useSoundState } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";
import { triggerBookingTransition } from "@/lib/booking-transition";
import { ConnectAIAssistant } from "./ConnectAIAssistant";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/book", label: "Get a Booking" },
  { to: "/how-it-works", label: "Who is Mr. Bondz" },
  { to: "/portfolios", label: "Events Gallery" },
  { to: "/services", label: "Event Services" },
  { to: "/partners", label: "Partners" },
  { to: "/contact", label: "Contact" },
] as const;

/** Borderless, physically tactile icon control - no button chrome, real press depth. */
export function TactileIcon({
  label,
  onClick,
  children,
  muted,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "bondz-tactile grid size-9 shrink-0 place-items-center rounded-full text-ink sm:size-10",
        muted && "opacity-45",
      )}
    >
      {children}
    </button>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSoundState();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const goBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    playTapSound();
    setOpen(false);
    triggerBookingTransition(() => navigate({ to: "/book", search: { intro: 1 } }));
  };

  return (
    <header className="relative z-40 shrink-0 bg-canvas transition-colors duration-300">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 md:px-8">
        <Link
          to="/"
          aria-label="Bondz Events home"
          className="shrink-0 transition-opacity hover:opacity-90"
          onClick={() => {
            playTapSound();
            setOpen(false);
          }}
        >
          <Lockup className="h-8 sm:h-10 md:h-11" />
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <TactileIcon
            label={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
            onClick={toggleSound}
            muted={!soundEnabled}
          >
            {soundEnabled ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </TactileIcon>

          <TactileIcon
            label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => {
              playTapSound();
              toggleTheme();
            }}
          >
            {theme === "dark" ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <circle cx="12" cy="12" r="4.4" />
                <line x1="12" y1="1.5" x2="12" y2="3.6" />
                <line x1="12" y1="20.4" x2="12" y2="22.5" />
                <line x1="4.2" y1="4.2" x2="5.7" y2="5.7" />
                <line x1="18.3" y1="18.3" x2="19.8" y2="19.8" />
                <line x1="1.5" y1="12" x2="3.6" y2="12" />
                <line x1="20.4" y1="12" x2="22.5" y2="12" />
                <line x1="4.2" y1="19.8" x2="5.7" y2="18.3" />
                <line x1="18.3" y1="5.7" x2="19.8" y2="4.2" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </TactileIcon>

          {!open && (
            <Link
              to="/portal"
              onClick={() => {
                playTapSound();
                setOpen(false);
              }}
              className="bondz-tactile hidden sm:inline-flex h-9 sm:h-10 items-center px-3.5 rounded-full text-xs font-bold text-ink hover:text-primary transition-colors duration-200"
              activeProps={{ className: "text-primary font-black bg-surface" }}
            >
              Portal
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              playTapSound();
              setOpen((o) => !o);
            }}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="bondz-tactile flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-ink sm:h-10 sm:px-3.5"
          >
            <span className="grid gap-[3px]" aria-hidden>
              <span
                className={cn(
                  "block h-[2px] w-4.5 rounded-full bg-current transition-transform duration-300",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-[2px] w-4.5 rounded-full bg-current transition-opacity duration-200",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-[2px] w-4.5 rounded-full bg-current transition-transform duration-300",
                  open && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
            <span className="eyebrow font-black">{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 top-16 z-50 bg-canvas/97 backdrop-blur-md sm:top-20"
          onClick={() => setOpen(false)}
        >
          <nav
            aria-label="Main navigation"
            onClick={(e) => e.stopPropagation()}
            className="scroll-quiet mx-auto flex h-full max-w-5xl flex-col overflow-y-auto px-5 pb-10 pt-4 sm:px-8 sm:pt-8"
          >
            <p className="eyebrow shrink-0 text-ink/45">Bondz Events · Menu</p>
            <ul className="mt-3 flex flex-col divide-y hairline sm:mt-5">
              {LINKS.map((l, i) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={
                      l.to === "/book"
                        ? goBooking
                        : () => {
                            playTapSound();
                            setOpen(false);
                          }
                    }
                    className="group flex items-baseline justify-between gap-4 py-3.5 sm:py-5"
                    activeProps={{ className: "text-primary" }}
                  >
                    <span className="flex min-w-0 items-baseline gap-3 sm:gap-5">
                      <span className="font-serif text-lg italic text-primary sm:text-2xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="display min-w-0 text-[clamp(1.6rem,7vw,3.6rem)] text-ink transition-colors group-hover:text-primary">
                        {l.label}
                      </span>
                    </span>
                    <span className="shrink-0 text-ink/35 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-primary">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* AI Assistant and Portal Links */}
            <div className="mt-auto pt-6 pb-4 flex flex-col items-center justify-center text-center gap-4">
              <ConnectAIAssistant variant="hero" className="w-full sm:w-auto" />

              <Link
                to="/portal"
                onClick={() => {
                  playTapSound();
                  setOpen(false);
                }}
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-wider text-ink bg-surface border hairline shadow-xs hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-md active:scale-95"
                activeProps={{ className: "text-primary font-black bg-surface border-primary ring-2 ring-primary/20" }}
              >
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  Operations &amp; Partner Portal
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono text-base font-black transition-transform duration-300 ease-out group-hover:translate-x-1 text-primary"
                >
                  →
                </span>
              </Link>

              <p className="mt-2 font-serif text-xl italic text-ink/55 sm:text-2xl text-center">
                Good times, beautifully made<span className="text-primary">.</span>
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
