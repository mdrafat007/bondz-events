import { useEffect, useState, useMemo, useRef } from "react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../design-system/lib/theme";
import {
  EVENT_TYPES,
  SLOTS,
  SLOT_TIMES,
  VENUES,
  type EventTypeId,
  type CategoryId,
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
import weddingImg from "../../assets/pf-wedding.jpg";
import birthdayImg from "../../assets/pf-birthday.jpg";
import bbqImg from "../../assets/pf-bbq.jpg";
import corporateImg from "../../assets/pf-corporate.jpg";
import dinnerImg from "../../assets/photography/celebration-dinner.jpg";

interface ActualBookingDemoProps {
  onLaunchBooking?: () => void;
  className?: string;
}

interface Scenario {
  event: EventTypeId;
  guests: number;
  where: "home" | "venue";
  venue: string | null;
  services: string[];
  vibes: string[];
  day: number;
  slot: Slot;
  details: {
    name: string;
    phone: string;
    email: string;
    honor: string;
    notes: string;
  };
  code: string;
  mediaImage: string;
  videoUrl: string;
  punchyTitle: string;
}

const cdnVideo = (path: string) => `https://id-preview--b05e6b12-3dde-49e9-ac29-9053c6b86cea.lovable.app${path}`;

const SCENARIOS: Scenario[] = [
  {
    event: "wedding",
    guests: 60,
    where: "venue",
    venue: "smokestack",
    services: ["catering", "dj"],
    vibes: ["Black Tie Glamour", "Romantic Garden"],
    day: 14,
    slot: "Evening",
    details: {
      name: "Amira & Jonah",
      phone: "+1 (555) 234-5678",
      email: "amira.k@example.com",
      honor: "Amira & Jonah",
      notes: "Golden hour sunset cocktails, outdoor candlelit dinner.",
    },
    code: "BZ-7492-OCT26",
    mediaImage: weddingImg,
    videoUrl: cdnVideo("/__l5e/assets-v1/c5b969d3-626e-4dc6-96ce-dd60f631062a/clip-wedding.mp4"),
    punchyTitle: "Your wedding day, locked without a single awkward phone call.",
  },
  {
    event: "birthday",
    guests: 40,
    where: "home",
    venue: null,
    services: ["dj", "photo", "bar"],
    vibes: ["High Energy Rave", "Sunset Rooftop"],
    day: 18,
    slot: "Evening",
    details: {
      name: "Jonah R.",
      phone: "+1 (555) 987-6543",
      email: "jonah.r@example.com",
      honor: "Jonah's 30th",
      notes: "High tempo soundscape, late night artisan pizza bar.",
    },
    code: "BZ-3184-NOV12",
    mediaImage: birthdayImg,
    videoUrl: cdnVideo("/__l5e/assets-v1/3f0e5ead-8854-4eb1-bbf6-d07d5928ed03/clip-birthday.mp4"),
    punchyTitle: "30th milestone locked in one sitting. Bass kicks at 8.",
  },
  {
    event: "bbq",
    guests: 85,
    where: "venue",
    venue: "smokestack",
    services: ["catering", "dj"],
    vibes: ["Open Fire Feast", "Rustic Garden"],
    day: 22,
    slot: "Evening",
    details: {
      name: "Marcus T.",
      phone: "+1 (555) 345-6789",
      email: "marcus.t@example.com",
      honor: "Summer Cookout",
      notes: "Live pitmaster demonstration, craft beer pairings.",
    },
    code: "BZ-5921-AUG04",
    mediaImage: bbqImg,
    videoUrl: cdnVideo("/__l5e/assets-v1/f41b5715-5a15-441b-998c-f7560e30acf0/clip-bbq.mp4"),
    punchyTitle: "Oak smoke, pitmaster feasts, and zero logistical stress.",
  },
  {
    event: "corporate",
    guests: 110,
    where: "venue",
    venue: "smokestack",
    services: ["production", "catering", "hybrid"],
    vibes: ["Executive Polish", "Modern Minimalist"],
    day: 27,
    slot: "Morning",
    details: {
      name: "Lena M.",
      phone: "+1 (555) 456-7890",
      email: "lena.m@company.com",
      honor: "Q4 Keynote & Gala",
      notes: "Low-latency broadcast for remote teams, barista lounge.",
    },
    code: "BZ-9042-DEC15",
    mediaImage: corporateImg,
    videoUrl: cdnVideo("/__l5e/assets-v1/8a82de65-f593-456c-89c3-cf9d2f4c5f1a/clip-corporate.mp4"),
    punchyTitle: "140-person keynote, high-speed stream & barista bar ready.",
  },
  {
    event: "anniversary",
    guests: 30,
    where: "home",
    venue: null,
    services: ["catering", "floral", "photo"],
    vibes: ["Intimate Candlelight", "Golden Hour Luxe"],
    day: 12,
    slot: "Evening",
    details: {
      name: "Priya & Dev",
      phone: "+1 (555) 567-8901",
      email: "priya.dev@example.com",
      honor: "25th Silver Jubilee",
      notes: "Chef tasting menu, acoustic strings accompaniment.",
    },
    code: "BZ-1839-SEP20",
    mediaImage: dinnerImg,
    videoUrl: cdnVideo("/__l5e/assets-v1/f55462d2-5f26-4200-9849-c14f590420d0/clip-anniversary.mp4"),
    punchyTitle: "Silver jubilee candlelit dinner, strings and fine dining set.",
  },
  {
    event: "family",
    guests: 50,
    where: "home",
    venue: null,
    services: ["catering", "photo"],
    vibes: ["Warm Generational", "Lawn Celebration"],
    day: 16,
    slot: "Afternoon",
    details: {
      name: "The Vance Family",
      phone: "+1 (555) 678-9012",
      email: "vance.family@example.com",
      honor: "Generations Gathering",
      notes: "Comfort-forward family dining, generational music curation.",
    },
    code: "BZ-4410-JUL18",
    mediaImage: dinnerImg,
    videoUrl: cdnVideo("/__l5e/assets-v1/1a71122a-6c80-4b17-a11b-c5e51f2ad5b5/clip-family.mp4"),
    punchyTitle: "Four generations under one roof. Every table sorted.",
  },
  {
    event: "hybrid",
    guests: 110,
    where: "venue",
    venue: "smokestack",
    services: ["hybrid", "production", "dj"],
    vibes: ["Broadcast Polish", "Interactive Digital"],
    day: 25,
    slot: "Morning",
    details: {
      name: "Tolu A.",
      phone: "+1 (555) 789-0123",
      email: "tolu.events@example.com",
      honor: "Global Product Summit",
      notes: "Studio broadcast link, low-latency live audience feeds.",
    },
    code: "BZ-8219-NOV03",
    mediaImage: corporateImg,
    videoUrl: cdnVideo("/__l5e/assets-v1/a18f63f2-32b0-42cd-ab04-d04ae0bd8093/clip-hybrid.mp4"),
    punchyTitle: "Zero lag, crystal sound: in-room & remote together.",
  },
  {
    event: "custom",
    guests: 75,
    where: "venue",
    venue: "smokestack",
    services: ["production", "catering", "dj"],
    vibes: ["Bespoke Gala", "Immersive Experience"],
    day: 30,
    slot: "Evening",
    details: {
      name: "Sara V.",
      phone: "+1 (555) 890-1234",
      email: "sara.v@example.com",
      honor: "Midsummer Midnight Ball",
      notes: "Custom floorplans, bespoke lighting, immersive soundscapes.",
    },
    code: "BZ-6194-OCT31",
    mediaImage: weddingImg,
    videoUrl: cdnVideo("/__l5e/assets-v1/70851ec0-c045-4a98-bd0c-051f5315f9c6/clip-custom.mp4"),
    punchyTitle: "Your own wild celebration concept, flawlessly brought to life.",
  },
];

export function ActualBookingDemo({ onLaunchBooking, className }: ActualBookingDemoProps) {
  const { theme } = useTheme();
  const demoIsDark = theme === "light";

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const currentScenario = SCENARIOS[scenarioIdx];

  const [step, setStep] = useState(1);
  const [subTick, setSubTick] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showingCelebrationVideo, setShowingCelebrationVideo] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const anchor = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [sel, setSel] = useState<Sel>({
    event: currentScenario.event,
    guests: currentScenario.guests,
    where: currentScenario.where,
    venue: currentScenario.venue,
    services: currentScenario.services as CategoryId[],
  });
  const [vibes, setVibes] = useState<string[]>(currentScenario.vibes);
  const [day, setDay] = useState<number | null>(currentScenario.day);
  const [slot, setSlot] = useState<Slot | null>(currentScenario.slot);
  const [details, setDetails] = useState(currentScenario.details);
  const [code, setCode] = useState(currentScenario.code);

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

  // Switch scenario smoothly on round completion
  const startNextRandomScenario = () => {
    setScenarioIdx((prev) => {
      const nextIdx = (prev + 1) % SCENARIOS.length;
      const nextScen = SCENARIOS[nextIdx];
      setSel({
        event: nextScen.event,
        guests: nextScen.guests,
        where: nextScen.where,
        venue: nextScen.venue,
        services: nextScen.services as CategoryId[],
      });
      setVibes(nextScen.vibes);
      setDay(nextScen.day);
      setSlot(nextScen.slot);
      setDetails(nextScen.details);
      setCode(nextScen.code);
      return nextIdx;
    });
    setShowingCelebrationVideo(false);
    setStep(1);
    setProgress(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // High-cadence human simulation loop
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

    let stepTimer: ReturnType<typeof setInterval> | null = null;
    let videoTimeout: ReturnType<typeof setTimeout> | null = null;

    if (!showingCelebrationVideo) {
      // 3.2s per step in fast time-lapse
      stepTimer = setInterval(() => {
        setStep((prev) => {
          if (prev >= 6) {
            // Reached Step 6! Trigger 6-second event-matched celebration video transition
            setShowingCelebrationVideo(true);
            setProgress(0);
            videoTimeout = setTimeout(() => {
              startNextRandomScenario();
            }, 6000);
            return 6;
          }
          const next = prev + 1;
          setProgress(0);
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }
          return next;
        });
      }, 3200);
    }

    return () => {
      clearInterval(subTimer);
      clearInterval(progressTimer);
      if (stepTimer) clearInterval(stepTimer);
      if (videoTimeout) clearTimeout(videoTimeout);
    };
  }, [isPaused, showingCelebrationVideo]);

  // Micro-actions simulation on subTick
  useEffect(() => {
    if (isPaused || showingCelebrationVideo) return;

    if (step === 1) {
      if (scrollContainerRef.current) {
        const scrollTargets = [0, 100, 200, 300];
        scrollContainerRef.current.scrollTo({ top: scrollTargets[subTick % scrollTargets.length], behavior: "smooth" });
      }
      if (subTick % 2 === 0) {
        setVibes(currentScenario.vibes);
      } else {
        setVibes([currentScenario.vibes[0]]);
      }
    } else if (step === 2) {
      const gCounts = [currentScenario.guests, Math.max(25, currentScenario.guests - 15), currentScenario.guests + 20];
      patch({ guests: gCounts[subTick % gCounts.length] });
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: (subTick % 2) * 90, behavior: "smooth" });
      }
    } else if (step === 3) {
      if (scrollContainerRef.current) {
        const serviceScrolls = [0, 140, 260, 380];
        scrollContainerRef.current.scrollTo({ top: serviceScrolls[subTick % serviceScrolls.length], behavior: "smooth" });
      }
    } else if (step === 4) {
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
  }, [subTick, step, isPaused, showingCelebrationVideo, currentScenario]);

  return (
    <figure
      onClick={onLaunchBooking}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-2xl border border-hairline shadow-raised h-full min-h-[360px] max-h-[460px] lg:max-h-full select-none group cursor-pointer transition-colors duration-300",
        demoIsDark
          ? "dark bg-[#110e14] text-[#f6f1e7] border-white/10 dark:border-transparent dark:shadow-[0_0_35px_rgba(241,69,59,0.14)]"
          : "light bg-[#faf7f2] text-[#161217] border-black/10",
        className
      )}
      aria-label="Booking Engine Demo Video Container"
    >
      {/* Dark mode ultra-luxury border shimmer blending white & prime accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 dark:opacity-100 transition-opacity z-30 [border:1.5px_solid_transparent] [background:linear-gradient(135deg,rgba(255,255,255,0.45)_0%,rgba(241,69,59,0.55)_35%,rgba(255,255,255,0.25)_70%,rgba(241,69,59,0.65)_100%)_border-box] [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]"
      />

      {/* Event-Matched 6-Second Celebration Video / Visual Transition Stage */}
      {showingCelebrationVideo ? (
        <div className="relative flex-1 flex flex-col items-center justify-center p-6 text-center overflow-hidden animate-in fade-in duration-500">
          <video
            autoPlay
            playsInline
            muted
            loop
            poster={currentScenario.mediaImage}
            src={currentScenario.videoUrl}
            className="absolute inset-0 size-full object-cover brightness-60 scale-105 transition-transform duration-6000 ease-out"
          />
          <img
            src={currentScenario.mediaImage}
            alt={currentScenario.details.honor}
            className="absolute inset-0 size-full object-cover brightness-60 scale-105 pointer-events-none -z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
          <div className="relative z-10 flex flex-col items-center max-w-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 font-sans text-[0.68rem] font-black uppercase tracking-wider text-white shadow-raised animate-pulse">
              ✓ Celebration Confirmed
            </span>
            <h3 className="mt-3 font-serif text-3xl sm:text-4xl text-white italic leading-tight">
              {currentScenario.details.honor}
            </h3>
            <p className="mt-1 font-sans text-xs uppercase tracking-wider text-white/80 font-bold">
              {currentScenario.guests} Guests · {currentScenario.slot} · {currentScenario.code}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {currentScenario.vibes.map((v) => (
                <span key={v} className="rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-[0.62rem] font-bold text-white">
                  {v}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[0.70rem] text-white/60">
              Next celebration scenario rotating in a moment...
            </p>
          </div>
        </div>
      ) : (
        /* Main Viewport: Scrollable Simulated Human Viewport */
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
      )}

      {/* Video-player style bottom overlay: Title (in fixed prime accent color), Progress bar (No kicker) */}
      <figcaption
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-4 sm:p-5 pt-8 bg-gradient-to-t transition-opacity duration-300",
          demoIsDark
            ? "from-[#110e14] via-[#110e14]/85 to-transparent text-white"
            : "from-[#faf7f2] via-[#faf7f2]/85 to-transparent text-ink"
        )}
      >
        <div className="mb-2.5">
          <p className="font-sans text-xs sm:text-sm md:text-base font-black uppercase tracking-tight leading-snug text-primary [font-variation-settings:'wdth'_85]">
            {currentScenario.punchyTitle}
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
