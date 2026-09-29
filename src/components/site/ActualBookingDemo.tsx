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
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const anchor = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Stateful simulation mimicking real user inputs
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

  // High-cadence human simulation loop (fast time-lapse with scrolling and live selection changes)
  useEffect(() => {
    if (isPaused) return;

    // Sub-tick timer every 1.0s for realistic micro-actions
    const subTimer = setInterval(() => {
      setSubTick((t) => t + 1);
    }, 1000);

    // Scrubber progress tick
    const progressTimer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 2.5));
    }, 80);

    // Fast step transition timer: 3.2s per step (fast time-lapse)
    const stepTimer = setInterval(() => {
      setStep((prev) => {
        const next = prev >= 6 ? 1 : prev + 1;
        setProgress(0);
        // Scroll to top on step transition
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
        return next;
      });
    }, 3200);

    return () => {
      clearInterval(subTimer);
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [isPaused]);

  // Micro-actions simulation on subTick (scroll down smoothly to show all content, toggle vibe or partner, alternate dates)
  useEffect(() => {
    if (isPaused) return;

    if (step === 1) {
      // Simulate scrolling down to reveal 'Why people book' and 'Celebration vibe' chips
      if (scrollContainerRef.current) {
        const scrollTargets = [0, 100, 200, 300];
        scrollContainerRef.current.scrollTo({ top: scrollTargets[subTick % scrollTargets.length], behavior: "smooth" });
      }
      if (subTick % 2 === 0) {
        setVibes(["Black Tie Glamour", "Romantic Garden", "Intimate Candlelight"]);
      } else {
        setVibes(["Modern Minimalist", "Fairy Tale Luxe"]);
      }
    } else if (step === 2) {
      // Simulate guest count adjustment and scroll down
      const guestCounts = [45, 60, 90, 120];
      patch({ guests: guestCounts[subTick % guestCounts.length] });
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: (subTick % 2) * 90, behavior: "smooth" });
      }
    } else if (step === 3) {
      // Simulate deep scroll in Step 3 services to reveal partner cards and availability log
      if (scrollContainerRef.current) {
        const serviceScrolls = [0, 140, 260, 380];
        scrollContainerRef.current.scrollTo({ top: serviceScrolls[subTick % serviceScrolls.length], behavior: "smooth" });
      }
      if (subTick % 2 === 0) {
        patch({ services: ["catering", "dj", "photo"] });
      } else {
        patch({ services: ["catering", "dj"] });
      }
    } else if (step === 4) {
      // Simulate browsing dates and scrolling down to time shifts
      const sampleDays = [14, 18, 22, 27];
      setDay(sampleDays[subTick % sampleDays.length]);
      if (scrollContainerRef.current) {
        const dateScrolls = [0, 90, 180];
        scrollContainerRef.current.scrollTo({ top: dateScrolls[subTick % dateScrolls.length], behavior: "smooth" });
      }
    } else if (step === 5 || step === 6) {
      if (scrollContainerRef.current) {
        const finalScrolls = [0, 120, 240, 340];
        scrollContainerRef.current.scrollTo({ top: finalScrolls[subTick % finalScrolls.length], behavior: "smooth" });
      }
    }
  }, [subTick, step, isPaused]);

  return (
    <figure
      onClick={onLaunchBooking}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline shadow-raised h-full min-h-[360px] max-h-[460px] lg:max-h-full select-none group cursor-pointer transition-colors duration-300",
        demoIsDark
          ? "dark bg-[#110e14] text-[#f6f1e7] border-white/10"
          : "light bg-[#faf7f2] text-[#161217] border-black/10",
        className
      )}
      aria-label="Booking Engine Demo Video Container"
    >
      {/* Main Viewport: Scrollable Simulated Human Viewport (Video-like canvas) */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "relative flex-1 overflow-y-auto scroll-quiet p-3 sm:p-4 flex flex-col justify-start transition-colors",
          demoIsDark ? "bg-[#110e14]" : "bg-[#faf7f2]"
        )}
      >
        <div className="pointer-events-auto origin-top transition-all duration-300 w-full pb-14">
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

      {/* Video-player style bottom overlay: Kicker, Title, Progress bar (No tacky buttons) */}
      <figcaption
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-4 sm:p-5 pt-8 bg-gradient-to-t transition-opacity duration-300",
          demoIsDark
            ? "from-[#110e14] via-[#110e14]/85 to-transparent text-white"
            : "from-[#faf7f2] via-[#faf7f2]/85 to-transparent text-ink"
        )}
      >
        <div className="mb-2.5">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-widest text-primary">
            Live Demo
          </p>
          <p className="mt-0.5 font-sans text-xs sm:text-sm md:text-base font-black uppercase tracking-tight leading-snug [font-variation-settings:'wdth'_85]">
            Few steps away to celebrate without a single call
          </p>
        </div>

        {/* Video Duration / Scrubber Progress Bar */}
        <div className={cn("w-full h-1 overflow-hidden rounded-full", demoIsDark ? "bg-white/20" : "bg-black/15")}>
          <div
            className="h-full bg-primary rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </figcaption>
    </figure>
  );
}
