import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SERVICES_11 } from "@/lib/bondz-data";
import { cn } from "@/lib/utils";
import { playTapSound, triggerTap } from "@/lib/haptics";
import { triggerBookingTransition } from "@/lib/booking-transition";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Event Services - Bondz Events" },
      {
        name: "description",
        content:
          "Eleven services, one Solo Event Organizer: production, catering, decor, photo & video, lights & sound, DJ, hybrid events, PR and cleaning.",
      },
      { property: "og:title", content: "Event Services - Bondz Events" },
      { property: "og:description", content: "Everything an event needs, coordinated by Mr. Bondz." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

const TABS = ["All", "Plan", "Host", "Produce"] as const;

// Bespoke Hairline Editorial SVG Icons (strokeWidth 1.5, geometric minimalism)
function ServiceIcon({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case "01": // Events Production: Baton / Run-of-show cue sheet
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <line x1="8" y1="8" x2="16" y2="8" />
          <line x1="8" y1="12" x2="14" y2="12" />
          <line x1="8" y1="16" x2="11" y2="16" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        </svg>
      );
    case "02": // Design Support: Architectural Drafting Caliper / Swatch
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2L4 20h3l5-12 5 12h3L12 2z" />
          <circle cx="12" cy="7" r="1.5" fill="currentColor" />
          <line x1="7" y1="14" x2="17" y2="14" />
        </svg>
      );
    case "03": // Media & PR: Editorial Megaphone & Broadcast Waves
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 11v2a2 2 0 0 0 2 2h2l5 4V5L7 9H5a2 2 0 0 0-2 2z" />
          <path d="M16 8a4.5 4.5 0 0 1 0 8" />
          <path d="M19 5a8.5 8.5 0 0 1 0 14" />
        </svg>
      );
    case "04": // Catering: Gourmet Cloche Dome & Platter
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 18h18" />
          <path d="M4 18a8 8 0 0 1 16 0" />
          <circle cx="12" cy="8" r="1.5" />
          <line x1="2" y1="21" x2="22" y2="21" />
        </svg>
      );
    case "05": // Decorations: Botanical Flora & Table Arch
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 22V8" />
          <path d="M12 8C12 4 16 3 18 5c1 1 0 4-4 5" />
          <path d="M12 13C12 9 8 8 6 10c-1 1 0 4 4 5" />
          <path d="M12 18C12 15 16 14 18 16c1 1 0 3-4 4" />
        </svg>
      );
    case "06": // Music & DJ: Turntable Vinyl Grooves & Needle
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="0.8" fill="currentColor" />
          <path d="M12 3v3" />
          <path d="M18 18l3 3" />
        </svg>
      );
    case "07": // Post-Event Cleaning Support: Pristine Whisk & Sparkle
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
          <path d="M18 16l.9 2.1L21 19l-2.1.9L18 22l-.9-2.1L15 19l2.1-.9L18 16z" />
          <path d="M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6L5 16z" />
        </svg>
      );
    case "08": // Photo & Videography: Rangefinder Camera Viewfinder
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="6" width="20" height="15" rx="3" />
          <circle cx="12" cy="13.5" r="4" />
          <circle cx="12" cy="13.5" r="1.5" fill="currentColor" />
          <path d="M7 6V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
        </svg>
      );
    case "09": // Equipment Support: Event Canopy Pavilion & Staging
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3L2 10l2 11h16l2-11L12 3z" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="7" y1="13" x2="17" y2="13" />
        </svg>
      );
    case "10": // Lights & Sound: Stage Luminaire & Flare
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 2v4" />
          <path d="M5.5 5.5l2.8 2.8" />
          <path d="M18.5 5.5l-2.8 2.8" />
          <circle cx="12" cy="14" r="5" />
          <path d="M7 19l-3 3" />
          <path d="M17 19l3 3" />
        </svg>
      );
    case "11": // Hybrid Events: Dual Synchronous Broadcast Feed
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="4" width="13" height="10" rx="1.5" />
          <path d="M9 18h6" />
          <path d="M12 14v4" />
          <path d="M17 8h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-1" />
          <circle cx="7" cy="8" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

const SERVICE_TAGS: Record<string, string> = {
  "01": "Direct on-site master",
  "02": "Moodboard & spatial",
  "03": "Press lists & release",
  "04": "Curated chef tasting",
  "05": "Custom styling & strike",
  "06": "Live sound curation",
  "07": "Next-morning sweep",
  "08": "4K footage & highlight",
  "09": "Turnkey power & shade",
  "10": "Warm washes & crisp PA",
  "11": "Multi-cam live stream",
};

function Services() {
  const [tab, setTab] = useState<string>("All");
  const navigate = useNavigate();

  const handleBook = () => {
    triggerTap();
    triggerBookingTransition(() => navigate({ to: "/book", search: { intro: 1 } }));
  };

  const list = SERVICES_11.filter((s) => tab === "All" || s.tab === tab);

  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-4 md:px-8">
      {/* Header Bar */}
      <div className="flex shrink-0 flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <p className="eyebrow text-primary font-bold tracking-widest uppercase">
            Nº 03 - Comprehensive Coordination
          </p>
          <h1 className="display mt-1 text-4xl sm:text-5xl md:text-6xl tracking-tight">
            Eleven services. <span className="text-primary font-serif-i italic">One Bondz.</span>
          </h1>
        </div>

        {/* Tab Filter Controls */}
        <div
          role="tablist"
          className="scroll-quiet inline-flex items-center gap-1 rounded-full border hairline bg-surface-light/60 p-1 shadow-xs max-w-full overflow-x-auto"
        >
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => {
                playTapSound();
                setTab(t);
              }}
              className={cn(
                "whitespace-nowrap shrink-0 rounded-full px-4 py-2 font-display text-xs font-black uppercase tracking-wider transition-all duration-200 [font-variation-settings:'wdth'_85]",
                tab === t
                  ? "bg-ink text-canvas shadow-sm"
                  : "text-ink/70 hover:text-ink hover:bg-canvas/50",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 11 Services */}
      <div
        key={tab}
        className="scroll-quiet grid min-h-0 flex-1 auto-rows-[minmax(12rem,auto)] grid-cols-1 gap-px overflow-y-auto bg-[var(--rule)] pt-px sm:auto-rows-[minmax(13rem,auto)] sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-4"
      >
        {list.map((s, i) => (
          <article
            key={s.t}
            className="rise group relative flex flex-col justify-between overflow-hidden bg-canvas p-5 sm:p-6 transition-all duration-300 hover:bg-surface-light"
            style={{ animationDelay: `${i * 35}ms` }}
          >
            {/* Creative editorial visual: oversized animated hairline illustration */}
            <div
              aria-hidden
              className="bondz-service-art pointer-events-none absolute -bottom-4 -right-4 size-28 text-ink/10 transition-all duration-500 group-hover:text-primary/35 sm:-bottom-6 sm:-right-6 sm:size-44"
              style={{ animationDelay: `${i * 240}ms` }}
            >
              <ServiceIcon id={s.no} className="size-full" />
            </div>

            {/* Top row: Numeral + Bespoke Hairline SVG Icon + Category Badge */}
            <div className="relative z-10 flex items-start justify-between gap-3">
              <span className="display text-4xl sm:text-5xl font-black text-ink/20 transition-colors duration-300 group-hover:text-primary">
                {s.no}
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-ink/65 border border-ink/10">
                  {s.tab}
                </span>
                <div className="flex size-10 items-center justify-center rounded-xl border hairline bg-surface-light text-ink/70 transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105">
                  <ServiceIcon id={s.no} className="size-5" />
                </div>
              </div>
            </div>

            {/* Bottom block: Service Title & Scaled Human Description */}
            <div className="relative z-10 mt-6 flex flex-col justify-end">
              <span className="text-[0.72rem] font-mono uppercase tracking-widest text-primary font-bold">
                {SERVICE_TAGS[s.no] || "Included in coordination"}
              </span>
              <h2 className="mt-1 font-display text-lg sm:text-xl font-black uppercase tracking-tight text-ink transition-colors duration-200 group-hover:text-primary [font-variation-settings:'wdth'_85]">
                {s.t}
              </h2>
              <p className="mt-2 text-[0.84rem] sm:text-[0.88rem] leading-relaxed text-ink/85 font-medium">
                {s.d}
              </p>
            </div>
          </article>
        ))}


        {/* Dynamic Build Yours Card */}
        {tab === "All" && (
          <div
            onClick={handleBook}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleBook()}
            className="group cursor-pointer flex flex-col justify-between p-6 text-white transition-all duration-300 relative overflow-hidden bg-gradient-to-b from-[#f55248] via-[#ee4339] to-[#de3429] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2),0_12px_32px_rgba(241,69,59,0.36)] ring-1 ring-white/20 ring-inset hover:brightness-105 active:scale-[0.98]"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-white/80 font-bold">
                Live Engine
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                Instant Lock
              </span>
            </div>

            <div className="my-auto py-4">
              <span className="eyebrow text-white/85 text-xs">Ready to organize?</span>
              <h3 className="display mt-1 text-3xl sm:text-4xl font-black tracking-tight text-white">
                Build your celebration
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-white/90">
                Pick your date, guest count, and service cocktail. Every slot is verified in real-time.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/20 pt-4">
              <span className="font-display text-sm font-black uppercase tracking-wider text-white">
                Launch Booking Engine →
              </span>
              <div className="size-8 rounded-full bg-white text-primary flex items-center justify-center font-bold shadow-md transition-transform duration-300 group-hover:translate-x-1">
                →
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

