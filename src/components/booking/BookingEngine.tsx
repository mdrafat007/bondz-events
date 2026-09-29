import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { EVENT_TYPES, VENUES, VIBES_BY_EVENT, availableDays, slotOpen, SLOTS } from "@/lib/bondz-data";
import { Lockup, StatusLine } from "@/components/site/Brand";
import type { CategoryId, EventTypeId, Slot } from "@/lib/bondz-data";

import { cn } from "@/lib/utils";
import { EstimatePanel, EstimateSheet, RealityPanel } from "./panels";
import { Ghost, Primary, SlotPicker, Step1, Step2, Step3A, Step3B, Step4 } from "./steps";
import { Step5, Step6 } from "./finish";
import { BookingProvider, useBooking, useBookingState, type Step } from "./store";
import { triggerTap, playTapSound, useSoundState } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";

const STEPS = ["Event", "Where", "Services-Addons", "Date", "Details", "Booked"];

export function BookingEngine({
  init,
  intro,
  demo = false,
  paused = false,
  onDemoProgress,
  onDemoRoundEnd,
}: {
  init: {
    event?: EventTypeId | undefined;
    where?: "home" | "venue" | undefined;
    step?: Step | undefined;
    reveal?: boolean | undefined;
  };
  intro: boolean;
  demo?: boolean;
  paused?: boolean;
  onDemoProgress?: (progress: number) => void;
  onDemoRoundEnd?: () => void;
}) {
  const state = useBookingState(init, demo);
  return (
    <BookingProvider value={state}>
      <Frame intro={intro} demo={demo} paused={paused} onDemoProgress={onDemoProgress} onDemoRoundEnd={onDemoRoundEnd} />
    </BookingProvider>
  );
}


const DEMO_NAMES = [
  "Amira & Jonah", "The Okafor Family", "Lena Vasquez", "Marcus Bell",
  "Priya & Sam", "Tolu Adeyemi", "Hannah Reid", "Northwind Studio",
];
const DEMO_SERVICES: CategoryId[] = ["catering", "decor", "dj", "photo", "lighting", "equipment", "staff", "cleaning"];

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T;
}

interface Scenario {
  event: EventTypeId;
  vibes: string[];
  where: "home" | "venue";
  venue: string | null;
  guests: number;
  services: CategoryId[];
  name: string;
  slot: Slot;
  ref: string;

}

function makeScenario(): Scenario {
  const event = pick(EVENT_TYPES).id as EventTypeId;
  const vibeList = VIBES_BY_EVENT[event] ?? [];
  const vibes = vibeList.filter(() => Math.random() < 0.45).slice(0, 3);
  if (!vibes.length && vibeList[0]) vibes.push(pick(vibeList));

  const options = VENUES.filter((v) => v.events === "all" || (v.events as readonly string[]).includes(event));
  const useVenue = options.length > 0 && Math.random() < 0.7;
  const venue = useVenue ? pick(options) : null;

  let guests = 20 + Math.floor(Math.random() * 25) * 5;
  if (venue) guests = Math.min(Math.max(guests, venue.min), venue.max);

  const services = DEMO_SERVICES.filter(() => Math.random() < 0.45);
  if (!services.length) services.push("catering");

  return {
    event,
    vibes,
    where: venue ? "venue" : "home",
    venue: venue?.id ?? null,
    guests,
    services,
    name: pick(DEMO_NAMES),
    slot: pick(SLOTS),
    ref: "BZ-" + event.slice(0, 2).toUpperCase() + "-" + String(1000 + Math.floor(Math.random() * 8999)),

  };
}

function DemoDirector({
  paused,
  canvas,
  onProgress,
  onRoundEnd,
}: {
  paused: boolean;
  canvas: React.RefObject<HTMLDivElement | null>;
  onProgress?: (progress: number) => void;
  onRoundEnd?: () => void;
}) {
  const b = useBooking();
  const current = useRef(b);
  current.current = b;
  const progress = useRef(onProgress);
  progress.current = onProgress;
  const roundEnd = useRef(onRoundEnd);
  roundEnd.current = onRoundEnd;
  const elapsed = useRef(0);
  const lastAction = useRef(-1);
  const scenario = useRef<Scenario>(makeScenario());

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const next = elapsed.current + 100;
      if (next >= 19200) {
        // Round complete: fresh randomised celebration for the next run.
        elapsed.current = 0;
        lastAction.current = -1;
        scenario.current = makeScenario();
        current.current.reset?.();
        roundEnd.current?.();
      } else {
        elapsed.current = next;
      }
      const sc = scenario.current;
      const step = (Math.floor(elapsed.current / 3200) + 1) as Step;
      const micro = Math.floor((elapsed.current % 3200) / 1000);
      progress.current?.((elapsed.current / 19200) * 100);
      const state = current.current;
      if (state.step !== step) {
        state.setStep(step);
        canvas.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
      const action = step * 10 + micro;
      if (action === lastAction.current) return;
      lastAction.current = action;
      if (step === 1) {
        state.setSel((s) => ({ ...s, event: sc.event }));
        state.setVibes(sc.vibes);
      } else if (step === 2) {
        state.setSel((s) => ({ ...s, where: sc.where, venue: sc.venue, guests: sc.guests }));
      } else if (step === 3) {
        state.setSel((s) => ({ ...s, services: micro === 0 ? sc.services.slice(0, 1) : sc.services.slice(0, micro + 1) }));
      } else if (step === 4) {
        const slotIndex = SLOTS.indexOf(sc.slot);
        const open = availableDays(state.sel).filter((day) => slotOpen(day, slotIndex));
        state.setDay(open[micro % Math.max(open.length, 1)] ?? null);
        state.setSlot(sc.slot);
      } else if (step === 5) {
        state.setDetails((d) => ({ ...d, name: sc.name, honor: sc.name }));
        state.setSignature("demo-signature");
      } else {
        state.setRef(sc.ref);
      }
      if (step === 1 || step === 3 || step === 5 || step === 6) {
        canvas.current?.scrollTo({ top: micro === 0 ? 0 : micro === 1 ? canvas.current.scrollHeight * 0.45 : canvas.current.scrollHeight, behavior: "smooth" });
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [paused, canvas]);
  return null;
}


function Frame({ intro, demo, paused, onDemoProgress, onDemoRoundEnd }: { intro: boolean; demo: boolean; paused: boolean; onDemoProgress?: (progress: number) => void; onDemoRoundEnd?: () => void }) {
  const b = useBooking();
  const { step, setStep, reveal, setReveal, sel, day, slot } = b;
  const [split, setSplit] = useState(intro);
  const scroller = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSoundState();

  useEffect(() => {
    if (!intro) return;
    const t = window.setTimeout(() => setSplit(false), 1100);
    return () => window.clearTimeout(t);
  }, [intro]);
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [step]);

  const withEstimate = step === 3 || step === 4;
  const canReveal = step >= 3 && step <= 5;
  const nextOk = step === 3 ? sel.where === "home" || !!sel.venue : step === 4 ? !!day && !!slot : true;
  const cta =
    step === 3 ? (
      <Primary
        disabled={!nextOk}
        onClick={() => {
          playTapSound();
          setStep(4);
        }}
        className="w-full"
      >
        {sel.where === "venue" ? "Find my dates →" : "See available dates →"}
      </Primary>
    ) : step === 4 ? (
      <Primary
        disabled={!nextOk}
        onClick={() => {
          playTapSound();
          setStep(5);
        }}
        className="w-full"
      >
        Continue to details →
      </Primary>
    ) : null;

  return (
    <div className="flex h-full flex-col max-w-full overflow-x-hidden">
      {demo && <DemoDirector paused={paused} canvas={scroller} onProgress={onDemoProgress} onRoundEnd={onDemoRoundEnd} />}
      {!demo && <header className="shrink-0 border-b hairline bg-canvas transition-colors duration-300">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-1.5 sm:gap-4 px-2.5 sm:px-6">
          {/* Brand Logo */}
          <Link
            to="/"
            aria-label="Back to Bondz Events home"
            onClick={playTapSound}
            className="shrink-0 transition-opacity hover:opacity-90"
          >
            <Lockup className="h-6 sm:h-8" />
          </Link>

          {/* Desktop Full Stepper (xl+) */}
          <ol className="hidden xl:flex items-center gap-2">
            {STEPS.map((s, i) => {
              const n = (i + 1) as Step;
              const done = n < step;
              const cur = n === step;
              const clickable = done && step < 6;
              return (
                <li key={s} className="flex shrink-0 items-center gap-2">
                  <button
                    disabled={!clickable}
                    onClick={() => {
                      playTapSound();
                      setStep(n);
                    }}
                    aria-current={cur ? "step" : undefined}
                    className={cn(
                      "flex items-baseline gap-1.5 rounded-full border px-3 py-1.5 font-display text-[0.76rem] font-extrabold uppercase tracking-tight transition active:scale-95 [font-variation-settings:'wdth'_85] cursor-pointer",
                      cur && "border-ink bg-ink text-canvas shadow-sm",
                      done && "hairline bg-surface-light text-ink hover:border-ink",
                      !cur && !done && "border-transparent text-ink/35 cursor-not-allowed",
                    )}
                  >
                    <span
                      className={cn(
                        "font-serif-i italic text-[0.82rem] font-normal leading-none",
                        cur ? "text-primary" : done ? "text-success" : "text-ink/40",
                      )}
                    >
                      {done ? "✓" : String(n).padStart(2, "0")}
                    </span>
                    <span>{s}</span>
                  </button>
                  {i < STEPS.length - 1 && <span className="h-px w-2.5 bg-ink/15" />}
                </li>
              );
            })}
          </ol>

          {/* Tablet Adaptive Stepper (md to xl) */}
          <ol className="hidden md:flex xl:hidden items-center gap-1.5">
            {STEPS.map((s, i) => {
              const n = (i + 1) as Step;
              const done = n < step;
              const cur = n === step;
              const clickable = done && step < 6;
              return (
                <li key={s} className="flex shrink-0 items-center gap-1">
                  <button
                    disabled={!clickable}
                    onClick={() => {
                      playTapSound();
                      setStep(n);
                    }}
                    aria-current={cur ? "step" : undefined}
                    className={cn(
                      "flex items-baseline gap-1 rounded-full border px-2.5 py-1 font-display text-[0.72rem] font-extrabold uppercase tracking-tight transition active:scale-95 [font-variation-settings:'wdth'_85] cursor-pointer",
                      cur && "border-ink bg-ink text-canvas shadow-sm",
                      done && "hairline bg-surface-light text-ink hover:border-ink",
                      !cur && !done && "border-transparent text-ink/35 cursor-not-allowed",
                    )}
                  >
                    <span
                      className={cn(
                        "font-serif-i italic text-[0.78rem] font-normal leading-none",
                        cur ? "text-primary" : done ? "text-success" : "text-ink/40",
                      )}
                    >
                      {done ? "✓" : String(n).padStart(2, "0")}
                    </span>
                    {cur && <span>{s}</span>}
                  </button>
                  {i < STEPS.length - 1 && <span className="h-px w-1.5 bg-ink/15" />}
                </li>
              );
            })}
          </ol>

          {/* Mobile Stepper Pill (< md) */}
          <div className="flex md:hidden items-center gap-1 min-w-0">
            <div className="flex items-baseline gap-1 rounded-full border hairline bg-surface-light px-2 py-0.5 text-[0.66rem] font-display font-extrabold uppercase tracking-tight [font-variation-settings:'wdth'_85] shrink-0">
              <span className="font-serif-i italic text-primary font-bold text-xs">0{step}</span>
              <span className="text-ink/40 text-[0.6rem]">/06</span>
              <span className="text-ink ml-0.5 truncate max-w-[4.2rem]">{STEPS[step - 1]}</span>
            </div>
          </div>

          {/* Right Controls: SFX + Theme + Exit */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* SFX Button */}
            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? "Mute realistic sound effects" : "Enable realistic sound effects"}
              title={soundEnabled ? "Sound ON" : "Sound MUTED"}
              className={cn(
                "flex size-7.5 sm:size-auto sm:h-8.5 items-center justify-center sm:justify-start gap-1.5 rounded-full border hairline px-0 sm:px-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs",
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
              <span className="hidden sm:inline font-mono text-[0.65rem] uppercase tracking-wider">
                {soundEnabled ? "SFX" : "MUTE"}
              </span>
            </button>

            {/* Theme Mood Toggle */}
            <button
              type="button"
              onClick={() => {
                playTapSound();
                toggleTheme();
              }}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Dark Mood active" : "Light Mood active"}
              className="flex size-7.5 sm:size-auto sm:h-8.5 items-center justify-center sm:justify-start gap-1.5 rounded-full border hairline bg-surface-light px-0 sm:px-2.5 text-xs font-bold text-ink transition-all hover:border-ink hover:bg-canvas active:scale-95 cursor-pointer shadow-xs border-ink/25"
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
              <span className="hidden sm:inline font-mono text-[0.65rem] uppercase tracking-wider">
                {theme === "dark" ? "DARK" : "LIGHT"}
              </span>
            </button>

            {/* Exit Link */}
            <Link
              to="/"
              onClick={playTapSound}
              className="eyebrow shrink-0 rounded-full border hairline bg-surface-light px-2 sm:px-3 py-1 font-bold hover:border-ink hover:bg-canvas transition active:scale-95 text-[0.68rem] sm:text-xs text-ink"
            >
              Exit
            </Link>
          </div>
        </div>

        {/* Sub-header status and filtered reality toggle */}
        <div className="flex h-8 items-center justify-between gap-2 border-t hairline px-2.5 sm:px-6 text-ink/70">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="live-dot size-1.5 rounded-full bg-success shrink-0" />
            <span className="eyebrow text-[0.60rem] sm:text-[0.68rem] tracking-wider uppercase font-semibold truncate">
              <span className="hidden sm:inline">Solo Event Organizer · 16 Years · 700+ Celebrations</span>
              <span className="sm:hidden">Solo Event Organizer</span>
            </span>
          </div>
          {canReveal && (
            <label className="flex cursor-pointer items-center gap-1 sm:gap-2 shrink-0">
              <span className="eyebrow text-ink text-[0.58rem] sm:text-[0.66rem] font-bold">
                <span className="hidden sm:inline">Preview sample dispatch</span>
                <span className="sm:hidden">Dispatch preview</span>
              </span>
              <button
                role="switch"
                aria-checked={reveal}
                onClick={() => {
                  playTapSound();
                  setReveal(!reveal);
                }}
                className={cn("relative h-4.5 w-8 rounded-full transition cursor-pointer", reveal ? "bg-primary" : "bg-ink/20")}
              >
                <span className={cn("absolute top-0.5 size-3.5 rounded-full bg-surface-light transition-all", reveal ? "left-4" : "left-0.5")} />
              </button>
            </label>
          )}
        </div>
      </header>}

      <div
        className={cn(
          "grid w-full max-w-full min-w-0 min-h-0 flex-1 gap-3 p-3 md:p-4 overflow-x-hidden",
          withEstimate && "lg:grid-cols-[1fr_19rem]",
          withEstimate && reveal && canReveal && "xl:grid-cols-[1fr_19rem_21rem]",
          !withEstimate && reveal && canReveal && "xl:grid-cols-[1fr_21rem]",
        )}
      >
        <div className="flex w-full max-w-full min-w-0 min-h-0 flex-col">
          <div ref={scroller} data-booking-canvas className={cn("scroll-quiet w-full max-w-full min-w-0 min-h-0 flex-1", demo ? "overflow-y-auto" : step <= 2 ? "overflow-y-auto md:overflow-hidden" : "overflow-y-auto pr-1")}>
            {step === 1 && <Step1 />}
            {step === 2 && <Step2 />}
            {step === 3 && (sel.where === "venue" ? <Step3B /> : <Step3A />)}
            {step === 4 && <Step4 />}
            {step === 5 && <Step5 />}
            {step === 6 && <Step6 />}
          </div>
          {withEstimate && (
            <div className="mt-3 hidden shrink-0 flex-wrap items-center justify-between gap-3 border-t hairline pl-20 pt-3 lg:flex">
              <Ghost onClick={() => setStep((step - 1) as Step)}>← Back</Ghost>
              {step === 4 && <SlotPicker />}
            </div>
          )}
          {withEstimate && (
            <div className="shrink-0 lg:hidden flex flex-col gap-2 pt-2 px-1 max-w-full">
              {step === 4 && <div className="w-full max-w-full overflow-hidden"><SlotPicker /></div>}
              <div className="flex items-center justify-between gap-2 py-1">
                <Ghost onClick={() => setStep((step - 1) as Step)}>← Back</Ghost>
              </div>
              <EstimateSheet cta={<div className="w-40 sm:w-44">{cta}</div>} />
            </div>
          )}
        </div>
        {withEstimate && (
          <aside className="hidden min-h-0 lg:block">
            <EstimatePanel cta={cta} />
          </aside>
        )}
        {reveal && canReveal && (
          <>
            <aside className="hidden min-h-0 xl:block">
              <RealityPanel />
            </aside>
            <div className="fixed inset-x-2 bottom-2 top-24 z-50 xl:hidden">
              <RealityPanel onClose={() => setReveal(false)} />
            </div>
          </>
        )}
      </div>

      {split && !demo && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] flex">
          <div className="split-left relative h-full w-1/2 bg-ink flex items-center justify-end pr-4 sm:pr-8">
            <span className="display text-[clamp(2.4rem,8vw,7.5rem)] text-canvas whitespace-nowrap">Let’s get</span>
          </div>
          <div className="split-right relative h-full w-1/2 bg-ink flex items-center justify-start pl-4 sm:pl-8">
            <span className="font-serif-i text-[clamp(2.4rem,8vw,7.5rem)] leading-none text-primary whitespace-nowrap">you booked.</span>
          </div>
        </div>
      )}
    </div>
  );
}
