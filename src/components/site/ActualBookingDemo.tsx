import { useEffect, useState, useMemo } from "react";
import { cn } from "../../lib/utils";
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
  const [step, setStep] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const anchor = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Real internal state driven by the actual booking engine data contracts
  const [sel, setSel] = useState<Sel>({
    event: "wedding",
    guests: 60,
    where: "venue",
    venue: "smokestack",
    services: ["dj", "catering"],
  });
  const [vibes, setVibes] = useState<string[]>(["Black Tie Glamour", "Intimate Candlelight"]);
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

  // Automated step simulation cycling through the actual 6 steps
  useEffect(() => {
    if (isPaused) return;

    // Cycle through steps 1 -> 2 -> 3 -> 4 -> 5 -> 6 every 3.8s
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= 6) {
          // Reset slightly on restart for visual dynamism
          return 1;
        }
        return prev + 1;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-surface shadow-raised h-full min-h-[390px] lg:min-h-0 select-none group",
        className
      )}
      aria-label="Actual Interactive Booking Engine Live Simulation"
    >
      {/* Top Banner indicating the LIVE engine runner */}
      <div className="flex items-center justify-between border-b border-hairline bg-surface-light px-4 py-2.5 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-status animate-pulse" />
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-primary">
            LIVE ENGINE DEMO · STEP 0{step} OF 06
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                s === step ? "w-6 bg-primary" : "w-2 bg-ink/20 hover:bg-ink/40"
              )}
              aria-label={`Jump to step ${s}`}
            />
          ))}
        </div>
      </div>

      {/* Main Viewport rendering the REAL booking components scaled cleanly */}
      <div className="relative flex-1 overflow-hidden p-3 sm:p-4 bg-canvas flex flex-col justify-start">
        <div className="pointer-events-auto origin-top transition-all duration-300 w-full">
          {step === 1 && (
            <div className="scale-[0.82] origin-top-left w-[122%]">
              <Step1Event ctx={ctx} />
            </div>
          )}

          {step === 2 && (
            <div className="scale-[0.82] origin-top-left w-[122%]">
              <Step2Where ctx={ctx} />
            </div>
          )}

          {step === 3 && (
            <div className="scale-[0.82] origin-top-left w-[122%]">
              <Step3Services ctx={ctx} />
            </div>
          )}

          {step === 4 && (
            <div className="scale-[0.80] origin-top-left w-[125%]">
              <Step4Date ctx={ctx} />
            </div>
          )}

          {step === 5 && (
            <div className="scale-[0.78] origin-top-left w-[128%]">
              <Step5Lock
                ctx={ctx}
                onBooked={() => {
                  setStep(6);
                }}
              />
            </div>
          )}

          {step === 6 && (
            <div className="scale-[0.78] origin-top-left w-[128%]">
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

      {/* Hover Call-to-action bar linking directly to /book */}
      <div
        onClick={onLaunchBooking}
        className="border-t border-hairline bg-surface-light px-4 py-2.5 flex items-center justify-between cursor-pointer group-hover:bg-primary/5 transition-colors z-20 shrink-0"
      >
        <div>
          <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-primary block">
            THE REAL BOOKING ENGINE IS LIVE
          </span>
          <span className="font-sans text-xs font-black uppercase text-ink">
            {isPaused ? "Paused on Hover — Click to Book in Full Screen →" : "Auto-looping live engine. Click to open →"}
          </span>
        </div>
        <button
          type="button"
          onClick={onLaunchBooking}
          className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm group-hover:scale-105 transition-transform"
        >
          Open Engine ↗
        </button>
      </div>
    </div>
  );
}
