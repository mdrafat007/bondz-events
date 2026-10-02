import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BookingEngine, type DemoScenario } from "@/components/booking/BookingEngine";
import { EVENT_TYPES, VENUES, type EventTypeId } from "@/lib/bondz-data";
import { playTapSound, triggerHaptic } from "@/lib/haptics";
import type { Step } from "@/components/booking/store";
import weddingImg from "@/assets/pf-wedding.jpg";
import birthdayImg from "@/assets/pf-birthday.jpg";
import bbqImg from "@/assets/pf-bbq.jpg";
import corporateImg from "@/assets/pf-corporate.jpg";
import dinnerImg from "@/assets/photography/celebration-dinner.jpg";
import clipWedding from "@/assets/demo/clip-wedding.mp4.asset.json";
import clipBirthday from "@/assets/demo/clip-birthday.mp4.asset.json";
import clipBbq from "@/assets/demo/clip-bbq.mp4.asset.json";
import clipCorporate from "@/assets/demo/clip-corporate.mp4.asset.json";
import clipAnniversary from "@/assets/demo/clip-anniversary.mp4.asset.json";
import clipFamily from "@/assets/demo/clip-family.mp4.asset.json";
import clipHybrid from "@/assets/demo/clip-hybrid.mp4.asset.json";
import clipCustom from "@/assets/demo/clip-custom.mp4.asset.json";

interface ActualBookingDemoProps {
  onLaunchBooking?: () => void;
  className?: string;
}

const assetUrl = (path: string) => `https://id-preview--b05e6b12-3dde-49e9-ac29-9053c6b86cea.lovable.app${path}`;

/** Celebration clip and human-toned headline for each of the eight event types. */
const EVENT_MEDIA: Record<EventTypeId, { title: string; video: string; poster: string }> = {
  wedding: {
    title: "Your wedding day, locked without a single awkward phone call.",
    video: assetUrl(clipWedding.url),
    poster: weddingImg,
  },
  birthday: {
    title: "Milestone birthday locked in one sitting. Bass kicks at 8.",
    video: assetUrl(clipBirthday.url),
    poster: birthdayImg,
  },
  bbq: {
    title: "Oak smoke, pitmaster feasts, and zero logistical stress.",
    video: assetUrl(clipBbq.url),
    poster: bbqImg,
  },
  corporate: {
    title: "Keynote, high-speed stream and barista bar, all ready.",
    video: assetUrl(clipCorporate.url),
    poster: corporateImg,
  },
  anniversary: {
    title: "Candlelit dinner, strings and fine dining, all set.",
    video: assetUrl(clipAnniversary.url),
    poster: dinnerImg,
  },
  family: {
    title: "Four generations under one roof. Every table sorted.",
    video: assetUrl(clipFamily.url),
    poster: dinnerImg,
  },
  hybrid: {
    title: "Zero lag, crystal sound: in-room and remote together.",
    video: assetUrl(clipHybrid.url),
    poster: corporateImg,
  },
  custom: {
    title: "Your own wild celebration concept, flawlessly brought to life.",
    video: assetUrl(clipCustom.url),
    poster: weddingImg,
  },
};

const eventTitle = (id: EventTypeId) => EVENT_TYPES.find((e) => e.id === id)?.title ?? "Celebration";

/** Width of the virtual desktop the engine renders into before being scaled to fit. */
const STAGE_W = 1040;

/** Exact booking flow step names matching BookingEngine STEPS */
const BOOKING_FLOW_STEPS: { step: Step; name: string }[] = [
  { step: 1, name: "Event" },
  { step: 2, name: "Where" },
  { step: 3, name: "Services-Addons" },
  { step: 4, name: "Date" },
  { step: 5, name: "Details" },
  { step: 6, name: "Booked" },
];

export function ActualBookingDemo({ onLaunchBooking, className }: ActualBookingDemoProps) {
  const [scenario, setScenario] = useState<DemoScenario | null>(null);
  const [progress, setProgress] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [activeStep, setActiveStep] = useState<Step>(1);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const boxRef = useRef<HTMLDivElement | null>(null);
  const celebrationTimer = useRef<number | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry!.contentRect;
      setBox({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleRoundEnd = useCallback(() => {
    setCelebrating(true);
    if (celebrationTimer.current) window.clearTimeout(celebrationTimer.current);
    celebrationTimer.current = window.setTimeout(() => {
      setCelebrating(false);
      setProgress(0);
      setActiveStep(1);
    }, 6000);
  }, []);

  useEffect(
    () => () => {
      if (celebrationTimer.current) window.clearTimeout(celebrationTimer.current);
    },
    [],
  );

  // Derive current step from continuous progress (0 to 100 over 6 segments)
  const currentStep = celebrating ? 6 : (Math.min(6, Math.max(1, Math.floor(progress / (100 / 6)) + 1)) as Step);
  const currentStepName = BOOKING_FLOW_STEPS[currentStep - 1]?.name ?? "Event";

  // Jump to specific story state
  const jumpToStep = useCallback((step: Step) => {
    playTapSound();
    triggerHaptic(14);
    if (celebrating) setCelebrating(false);
    setActiveStep(step);
    const targetProgress = ((step - 1) / 6) * 100;
    setProgress(targetProgress);
  }, [celebrating]);

  // Tap navigation: left side goes back, right side goes next
  const handleCardClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("[data-story-nav]")) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRightHalf = x > rect.width * 0.45;

    if (isRightHalf) {
      if (currentStep < 6) {
        jumpToStep((currentStep + 1) as Step);
      } else {
        handleRoundEnd();
      }
    } else {
      if (currentStep > 1) {
        jumpToStep((currentStep - 1) as Step);
      }
    }
  };

  const media = EVENT_MEDIA[scenario?.event ?? "wedding"];
  const venue = VENUES.find((v) => v.id === scenario?.venue) ?? null;

  return (
    <figure
      onClick={handleCardClick}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      className={cn(
        "group relative flex aspect-[4/5] select-none flex-col overflow-hidden rounded-3xl border border-hairline bg-paper shadow-raised transition-colors duration-300 sm:aspect-[3/4] md:aspect-[4/5] dark:border-primary/45 dark:shadow-[0_0_30px_rgba(241,69,59,0.16)] ring-1 ring-primary/20 h-full min-h-[360px] max-h-[460px] lg:max-h-[92%] my-auto cursor-pointer",
        "dark:bg-canvas",
        className,
      )}
      aria-label="Self-playing booking engine showcase. Tap left/right to browse story states, hover to pause."
    >
      {/* Top subtle badge overlay (tap hint / pause state) */}
      {hovering && (
        <div className="pointer-events-none absolute right-3 top-3 z-30 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[0.62rem] font-bold text-primary backdrop-blur-xs">
          <span>❚❚ Paused</span>
        </div>
      )}

      {/* The real booking engine, running itself inside a scaled desktop viewport */}
      <div ref={boxRef} className="absolute inset-0 overflow-hidden">
        <div
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{
            width: STAGE_W,
            height: box.h ? box.h / (box.w / STAGE_W || 1) : STAGE_W * 1.25,
            transform: `scale(${box.w ? box.w / STAGE_W : 0.5})`,
          }}
        >
          <BookingEngine
            init={{}}
            intro={false}
            demo
            paused={hovering || celebrating}
            demoStep={activeStep}
            onDemoProgress={setProgress}
            onDemoRoundEnd={handleRoundEnd}
            onDemoScenario={setScenario}
          />
        </div>
      </div>

      {/* Matched celebration clip closing every round */}
      {celebrating && (
        <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden p-6 text-center animate-in fade-in duration-500">
          <img
            src={media.poster}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover brightness-50"
          />
          <video
            key={media.video}
            src={media.video}
            poster={media.poster}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 size-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/40 to-night/60" />
          <div className="relative z-10 flex max-w-sm flex-col items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-black uppercase tracking-wider text-paper shadow-raised">
              ✓ Celebration Confirmed
            </span>
            <h3 className="mt-3 font-serif-i text-3xl italic leading-tight text-paper sm:text-4xl">
              {scenario?.name ?? "Your celebration"}
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-paper/80">
              {eventTitle(scenario?.event ?? "wedding")}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {[
                `${scenario?.guests ?? 60} guests`,
                scenario?.slot ?? "Evening",
                venue ? venue.name : "Their own place",
                scenario?.ref ?? "BZ-0000",
              ].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full bg-paper/20 px-3 py-1 text-xs font-bold text-paper backdrop-blur-xs"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom overlay: 1. Live + Steps name kicker -> 2. Title -> 3. Lightweight segmented progress bars */}
      <figcaption className="absolute inset-x-0 bottom-0 z-30 flex flex-col justify-end bg-gradient-to-t from-paper via-paper/95 to-transparent p-3.5 pt-12 dark:from-canvas dark:via-canvas/95 sm:p-5 sm:pt-14">
        {/* 1. Kicker: Live + Exact booking flow step name */}
        <div className="flex items-center gap-1.5 text-[0.62rem] sm:text-[0.68rem] font-bold uppercase tracking-wider text-ink/75 dark:text-white/80">
          <span className="live-dot size-1.5 rounded-full bg-primary animate-pulse shrink-0" />
          <span className="font-extrabold text-primary">Live</span>
          <span className="text-ink/30 dark:text-white/30">·</span>
          <span className="text-ink dark:text-white font-mono font-bold">
            Step {currentStep} of 6: {currentStepName}
          </span>
        </div>

        {/* 2. Main Title */}
        <p className="mt-1 text-xs font-black uppercase leading-snug tracking-tight text-ink dark:text-white sm:text-sm md:text-base">
          {media.title}
        </p>

        {/* 3. Lightweight Segmented Instagram Story Bars (reduced weight: h-1 sm:h-1.25) */}
        <div className="mt-2.5 flex items-center gap-1.5 w-full">
          {BOOKING_FLOW_STEPS.map((s, idx) => {
            const stepNum = s.step;
            const segmentSize = 100 / 6;
            const segmentStart = idx * segmentSize;
            const segmentEnd = (idx + 1) * segmentSize;

            let fillPercent = 0;
            if (celebrating) {
              fillPercent = 100;
            } else if (progress >= segmentEnd) {
              fillPercent = 100;
            } else if (progress <= segmentStart) {
              fillPercent = 0;
            } else {
              fillPercent = ((progress - segmentStart) / segmentSize) * 100;
            }

            const isActive = currentStep === stepNum;

            return (
              <button
                key={s.step}
                type="button"
                data-story-nav
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToStep(stepNum);
                }}
                title={`Jump to Step ${stepNum}: ${s.name}`}
                className="relative h-1 sm:h-1.25 flex-1 overflow-hidden rounded-full bg-ink/15 dark:bg-white/20 transition-all hover:h-1.5 focus:outline-none cursor-pointer"
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-100 ease-linear",
                    isActive ? "bg-primary" : "bg-primary/80 dark:bg-white/90"
                  )}
                  style={{ width: `${fillPercent}%` }}
                />
              </button>
            );
          })}
        </div>
      </figcaption>
    </figure>
  );
}
