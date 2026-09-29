import { useEffect, useState, useMemo, useRef } from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../design-system/lib/theme";
import {
  EVENT_TYPES,
  SLOTS,
  SLOT_TIMES,
  VENUES,
  availableDays,
  dayToDate,
  estimate,
  freeDayCount,
  usd,
  type EventTypeId,
  type Sel,
  type Slot,
} from "../../lib/bondz-data";
import { Step1Event } from "../booking/Step1Event";
import { Step2Where } from "../booking/Step2Where";
import { Step3Services } from "../booking/Step3Services";
import { Step4Date } from "../booking/Step4Date";
import { Step5Lock } from "../booking/Step5Lock";
import { Step6Booked } from "../booking/Step6Booked";
import type { BookingCtx } from "../booking/shared";

interface ActualBookingDemoProps {
  onLaunchBooking?: () => void;
  className?: string;
}

export function ActualBookingDemo({ onLaunchBooking, className }: ActualBookingDemoProps) {
  // Global theme detection to enforce OPPOSITE theme mode inside the showcase card
  const { theme } = useTheme();
  const demoIsDark = theme === "light"; // Invert: if page is light, demo is dark. If page is dark, demo is light.

  const [step, setStep] = useState(1);
  const [subTick, setSubTick] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const anchor = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Stateful simulation mimicking human inputs (event type selection, guest count slider, partner clicks, date pick)
  const [sel, setSel] = useState<Sel>({
    event: "wedding",
    guests: 60,
    where: "venue",
    venue: "smokestack",
    services: ["catering", "dj"],
  });
  const [vibes, setVibes] = useState<string[]>(["Black Tie Glamour"]);
  const [day, setDay] = useState<number | null>(14);
  const [slot, setSlot] = useState<Slot | null>("Evening");
  const [details, setDetails] = useState({
    name: "Amira & Jonah",
    phone: "+1 (555) 234-5678",
    email: "amira.k@example.com",
    honor: "Amira & Jonah",
    notes: "Golden hour sunset cocktails, outdoor candlelit dinner.",
  });
  const [code] = useState("BZ-7492-OCT26");

  const patch = (u: Partial<Sel>) => setSel((s) => ({ ...s, ...u }));
  const setDetailsPatch = (u: Partial<typeof details>) => setDetails((d) => ({ ...d, ...u }));

  const ctx: BookingCtx = {
    sel,
    patch,
    vibes,
    setVibes,
    day,
    setDay: (d) => {
      setDay(d);
      setSlot("Evening");
    },
    slot,
    setSlot: (s) => setSlot(s),
    details,
    setDetails: setDetailsPatch,
    anchor,
    goto: setStep,
  };

  // High-cadence human simulation loop (faster time-lapse with scrolling and live selection changes)
  useEffect(() => {
    if (isPaused) return;

    // Sub-tick timer every 1.1s for realistic micro-actions
    const subTimer = setInterval(() => {
      setSubTick((t) => t + 1);
    }, 1100);

    // Fast step transition timer: 3.2s per step (fast time-lapse)
    const stepTimer = setInterval(() => {
      setStep((prev) => {
        const next = prev >= 6 ? 1 : prev + 1;
        // Scroll to top on step transition
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
        return next;
      });
    }, 3200);

    return () => {
      clearInterval(subTimer);
      clearInterval(stepTimer);
    };
  }, [isPaused]);

  // Micro-actions simulation on subTick (scroll down slightly, toggle a vibe or partner, alternate dates)
  useEffect(() => {
    if (isPaused) return;

    if (step === 1) {
      // Simulate choosing between wedding and birthday, adding vibes
      if (subTick % 2 === 0) {
        setVibes(["Black Tie Glamour", "Intimate Candlelight"]);
      } else {
        setVibes(["Romantic Garden"]);
      }
    } else if (step === 2) {
      // Simulate guest count adjustment
      const guestCounts = [45, 60, 90, 120];
      patch({ guests: guestCounts[subTick % guestCounts.length] });
    } else if (step === 3) {
      // Simulate scroll in Step 3 services and toggling partners
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: (subTick % 3) * 70, behavior: "smooth" });
      }
      if (subTick % 2 === 0) {
        patch({ services: ["catering", "dj", "photo"] });
      } else {
        patch({ services: ["catering", "dj"] });
      }
    } else if (step === 4) {
      // Simulate browsing dates
      const sampleDays = [14, 18, 22, 27];
      setDay(sampleDays[subTick % sampleDays.length]);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: (subTick % 2) * 50, behavior: "smooth" });
      }
    } else if (step === 5 || step === 6) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: (subTick % 3) * 60, behavior: "smooth" });
      }
    }
  }, [subTick, step, isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline shadow-raised h-full min-h-[380px] max-h-[460px] lg:max-h-full select-none group transition-colors duration-300",
        demoIsDark
          ? "dark bg-[#110e14] text-[#f6f1e7] border-white/10"
          : "light bg-[#faf7f2] text-[#161217] border-black/10",
        className
      )}
      aria-label="Interactive Booking Engine Live Simulation"
    >
      {/* Top Banner Header: Opposite Theme Indicator + Step Counter */}
      <div
        className={cn(
          "flex items-center justify-between border-b px-4 py-2.5 z-20 shrink-0 transition-colors",
          demoIsDark
            ? "border-white/10 bg-[#161218]/90 text-white"
            : "border-black/10 bg-[#f0eae1]/90 text-ink"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-status animate-pulse" />
          <span className="font-mono text-[0.68rem] font-black uppercase tracking-wider text-primary">
            LIVE DEMO · 0{step} OF 06
          </span>
          <span className={cn(
            "text-[0.62rem] font-mono px-2 py-0.5 rounded-full border uppercase tracking-widest hidden sm:inline-block",
            demoIsDark ? "border-white/15 text-white/60" : "border-black/15 text-ink/60"
          )}>
            {demoIsDark ? "DARK MODE ACTIVE" : "LIGHT MODE ACTIVE"}
          </span>
        </div>

        {/* Step Jump Pills */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                s === step
                  ? "w-6 bg-primary"
                  : demoIsDark
                  ? "w-2 bg-white/20 hover:bg-white/40"
                  : "w-2 bg-black/20 hover:bg-black/40"
              )}
              aria-label={`Jump to step ${s}`}
            />
          ))}
        </div>
      </div>

      {/* Main Viewport: Scrollable Simulated Human Viewport */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "relative flex-1 overflow-y-auto scroll-quiet p-3 sm:p-4 flex flex-col justify-start transition-colors",
          demoIsDark ? "bg-[#110e14]" : "bg-[#faf7f2]"
        )}
      >
        <div className="pointer-events-auto origin-top transition-all duration-300 w-full pb-6">
          {step === 1 && (
            <div className="scale-[0.80] origin-top-left w-[125%] pointer-events-none">
              <Step1Event ctx={ctx} />
            </div>
          )}

          {step === 2 && (
            <div className="scale-[0.80] origin-top-left w-[125%] pointer-events-none">
              <Step2Where ctx={ctx} />
            </div>
          )}

          {step === 3 && (
            <div className="scale-[0.80] origin-top-left w-[125%] pointer-events-none">
              <Step3Services ctx={ctx} />
            </div>
          )}

          {step === 4 && (
            <div className="scale-[0.78] origin-top-left w-[128%] pointer-events-none">
              <Step4Date ctx={ctx} />
            </div>
          )}

          {step === 5 && (
            <div className="scale-[0.76] origin-top-left w-[131%] pointer-events-none">
              <Step5Lock
                ctx={ctx}
                onBooked={() => {
                  setStep(6);
                }}
              />
            </div>
          )}

          {step === 6 && (
            <div className="scale-[0.76] origin-top-left w-[131%] pointer-events-none">
              <Step6Booked
                ctx={ctx}
                code={code}
                onRestart={() => {
                  setStep(1);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Showcase Window Bottom Caption Bar matching user exact wording */}
      <div
        onClick={onLaunchBooking}
        className={cn(
          "border-t px-4 py-3 flex items-center justify-between cursor-pointer transition-colors z-20 shrink-0",
          demoIsDark
            ? "border-white/10 bg-[#161218] hover:bg-[#1a151d] text-white"
            : "border-black/10 bg-[#f0eae1] hover:bg-[#e8e2d8] text-ink"
        )}
      >
        <div className="min-w-0 pr-2">
          <span className="font-sans text-[0.62rem] font-extrabold uppercase tracking-wider text-primary block">
            LIVE DEMO
          </span>
          <p className="font-sans text-xs sm:text-sm font-black uppercase tracking-tight truncate [font-variation-settings:'wdth'_85]">
            Few steps away to celebrate without a single call
          </p>
        </div>
        <button
          type="button"
          onClick={onLaunchBooking}
          className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-raised hover:bg-primary-hover shrink-0 transition-transform active:scale-95"
        >
          {isPaused ? "BOOK NOW ↗" : "LAUNCH ↗"}
        </button>
      </div>
    </div>
  );
}
