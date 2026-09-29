import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "../../lib/utils";
import { usd } from "../../lib/bondz-data";

interface HeroBookingDemoProps {
  onLaunchBooking?: () => void;
  className?: string;
}

const DEMO_STATES = [
  {
    stepNo: "01",
    label: "Celebration",
    title: "8 Curated Occasions",
  },
  {
    stepNo: "04",
    label: "Availability",
    title: "Real-time The Rule Sync",
  },
  {
    stepNo: "05",
    label: "25% Deposit",
    title: "One-Sitting Lock In",
  },
  {
    stepNo: "06",
    label: "Confirmed",
    title: "Instant 360° Dispatch",
  },
] as const;

export function HeroBookingDemo({ onLaunchBooking, className }: HeroBookingDemoProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 3800; // ms
    const intervalTick = 50; // ms
    const totalTicks = stepDuration / intervalTick;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIdx((idx) => (idx + 1) % DEMO_STATES.length);
          return 0;
        }
        return prev + (100 / totalTicks);
      });
    }, intervalTick);

    return () => clearInterval(timer);
  }, []);

  return (
    <figure
      onClick={onLaunchBooking}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-night text-canvas shadow-raised h-full min-h-[360px] lg:min-h-0 select-none group cursor-pointer p-5 sm:p-6",
        className
      )}
      aria-label="Interactive Booking Engine Live Preview"
    >
      {/* Top Bar Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-status animate-pulse" />
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-primary">
            ENGINE PREVIEW · 0{DEMO_STATES[activeIdx].stepNo}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {DEMO_STATES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIdx ? "w-5 bg-primary" : "w-1.5 bg-white/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Main Showcase Stage */}
      <div className="relative my-auto py-3 min-h-[190px] flex flex-col justify-center">
        {/* State 1: 01 Celebration */}
        <div
          className={cn(
            "transition-all duration-500 absolute inset-0 flex flex-col justify-center",
            activeIdx === 0
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="grid grid-cols-4 gap-2">
            {[
              { n: "01", t: "Wedding", active: true },
              { n: "02", t: "Anniversary" },
              { n: "03", t: "Birthday" },
              { n: "04", t: "BBQ Feast" },
              { n: "05", t: "Family" },
              { n: "06", t: "Corporate" },
              { n: "07", t: "Hybrid" },
              { n: "08", t: "Custom" },
            ].map((e) => (
              <div
                key={e.n}
                className={cn(
                  "flex flex-col justify-between p-2 rounded-lg border text-left min-h-[64px] transition-all",
                  e.active
                    ? "border-primary bg-primary/20 text-white ring-1 ring-primary/60 scale-[1.02]"
                    : "border-white/10 bg-white/5 text-white/50"
                )}
              >
                <span className="font-serif italic text-[0.7rem] text-primary">{e.n}</span>
                <span className="font-sans font-bold text-[0.72rem] truncate">{e.t}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-[0.7rem] text-white/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <span>60 Guests · Dinner Tier</span>
            <span className="text-primary font-bold">Vibe: Black Tie Glamour</span>
          </div>
        </div>

        {/* State 2: 04 The Rule Availability */}
        <div
          className={cn(
            "transition-all duration-500 absolute inset-0 flex flex-col justify-center",
            activeIdx === 1
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 mb-2.5">
            <span className="text-[0.62rem] uppercase font-bold text-primary block tracking-wider mb-1">
              Deterministic Intersection Equation
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-[0.68rem] text-white/80">
              <span className="px-2 py-0.5 rounded-full bg-white/10">Bondz (45 free)</span>
              <span className="text-primary">∩</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10">Venue (38 free)</span>
              <span className="text-primary">=</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/30 text-primary font-bold">14 Open Dates</span>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const isOpen = [3, 7, 8, 12, 14, 19, 22, 27].includes(i);
              const isSelected = i === 14;
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded flex items-center justify-center text-[0.65rem] font-mono",
                    isSelected
                      ? "bg-primary text-white font-bold ring-2 ring-white/50"
                      : isOpen
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-white/20 line-through"
                  )}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* State 3: 05 25% Deposit Lock */}
        <div
          className={cn(
            "transition-all duration-500 absolute inset-0 flex flex-col justify-center",
            activeIdx === 2
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="rounded-xl border border-white/10 bg-ink p-3 text-canvas">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[0.62rem] uppercase tracking-wider text-canvas/60 block">Deposit Required</span>
                <span className="font-serif text-3xl text-primary font-normal leading-none">$543</span>
              </div>
              <span className="font-mono text-[0.68rem] text-canvas/50">25% of $2,170</span>
            </div>
            <div className="mt-2.5 space-y-1 text-[0.7rem] border-t border-white/10 pt-2 text-canvas/70">
              <div className="flex justify-between"><span>Wedding · Smokestack Yard</span><span>$2,400</span></div>
              <div className="flex justify-between"><span>DJ Nova + Catering (60p)</span><span>$2,640</span></div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-primary/20 border border-primary/40 px-3 py-1.5 text-primary text-xs font-bold">
              <span>Signature & Terms Ready</span>
              <span>🔒 Sandbox Lock</span>
            </div>
          </div>
        </div>

        {/* State 4: 06 Confirmed & 360 Dispatch */}
        <div
          className={cn(
            "transition-all duration-500 absolute inset-0 flex flex-col justify-center",
            activeIdx === 3
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-serif italic text-base text-white">Ref: BZ-7492-OCT26</span>
            <span className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-status/20 text-status">
              100% Locked
            </span>
          </div>
          <div className="space-y-1.5 text-[0.72rem]">
            {[
              { who: "You (Host)", what: "Receipt, agreement & invite card sent" },
              { who: "Smokestack Yard", what: "Courtyard locked for chosen date" },
              { who: "Ember & Oak Kitchen", what: "60-plate catering work order" },
              { who: "Mr. Bondz", what: "Master production brief on iPad" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/5">
                <span className="size-3.5 rounded-full bg-status text-white flex items-center justify-center text-[0.55rem] font-black shrink-0">✓</span>
                <span className="font-bold text-white/90 truncate">{r.who}</span>
                <span className="text-white/40 truncate text-[0.65rem] ml-auto">{r.what}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Kicker Overlay & Progress */}
      <div className="z-10 mt-auto pt-3 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-sans text-[0.62rem] font-extrabold uppercase tracking-wider text-primary">
              Live Interactive Engine
            </p>
            <p className="font-sans text-xs font-black uppercase text-white tracking-tight">
              Test The Entire Flow in 6 Steps →
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-white/40 group-hover:text-primary transition-colors">
            RUN LIVE DEMO ↗
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </figure>
  );
}
