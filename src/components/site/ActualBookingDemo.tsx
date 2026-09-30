import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BookingEngine, type DemoScenario } from "@/components/booking/BookingEngine";
import { EVENT_TYPES, VENUES, type EventTypeId } from "@/lib/bondz-data";
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
  wedding: { title: "Your wedding day, locked without a single awkward phone call.", video: assetUrl(clipWedding.url), poster: weddingImg },
  birthday: { title: "Milestone birthday locked in one sitting. Bass kicks at 8.", video: assetUrl(clipBirthday.url), poster: birthdayImg },
  bbq: { title: "Oak smoke, pitmaster feasts, and zero logistical stress.", video: assetUrl(clipBbq.url), poster: bbqImg },
  corporate: { title: "Keynote, high-speed stream and barista bar, all ready.", video: assetUrl(clipCorporate.url), poster: corporateImg },
  anniversary: { title: "Candlelit dinner, strings and fine dining, all set.", video: assetUrl(clipAnniversary.url), poster: dinnerImg },
  family: { title: "Four generations under one roof. Every table sorted.", video: assetUrl(clipFamily.url), poster: dinnerImg },
  hybrid: { title: "Zero lag, crystal sound: in-room and remote together.", video: assetUrl(clipHybrid.url), poster: corporateImg },
  custom: { title: "Your own wild celebration concept, flawlessly brought to life.", video: assetUrl(clipCustom.url), poster: weddingImg },
};

const eventTitle = (id: EventTypeId) => EVENT_TYPES.find((e) => e.id === id)?.title ?? "Celebration";

/** Width of the virtual desktop the engine renders into before being scaled to fit. */
const STAGE_W = 1040;

export function ActualBookingDemo({ onLaunchBooking, className }: ActualBookingDemoProps) {
  const [scenario, setScenario] = useState<DemoScenario | null>(null);
  const [progress, setProgress] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
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
    }, 6000);
  }, []);

  useEffect(() => () => {
    if (celebrationTimer.current) window.clearTimeout(celebrationTimer.current);
  }, []);

  const media = EVENT_MEDIA[scenario?.event ?? "wedding"];
  const venue = VENUES.find((v) => v.id === scenario?.venue) ?? null;

  return (
    <figure
      onClick={onLaunchBooking}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      className={cn(
        "group relative flex aspect-[4/5] cursor-pointer select-none flex-col overflow-hidden rounded-3xl border border-hairline bg-[#faf7f2] shadow-raised transition-colors duration-300 sm:aspect-[3/4] md:aspect-[4/5]",
        "dark:border-transparent dark:bg-[#110e14] dark:shadow-[0_0_35px_rgba(241,69,59,0.14)]",
        className,
      )}
      aria-label="Self-playing booking engine showcase. Select to start your own booking."
    >
      {/* Dark-mode shimmer edge blending crisp white with the prime accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 rounded-3xl opacity-0 transition-opacity dark:opacity-100 [background:linear-gradient(135deg,rgba(255,255,255,0.45)_0%,rgba(241,69,59,0.55)_35%,rgba(255,255,255,0.25)_70%,rgba(241,69,59,0.65)_100%)_border-box] [border:1.5px_solid_transparent] [mask-composite:exclude] [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)]"
      />

      {/* The real booking engine, running itself inside a scaled desktop viewport */}
      <div ref={boxRef} className="absolute inset-0 overflow-hidden">
        <div
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: STAGE_W, height: box.h ? box.h / (box.w / STAGE_W || 1) : STAGE_W * 1.25, transform: `scale(${box.w ? box.w / STAGE_W : 0.5})` }}
        >
          <BookingEngine
            init={{}}
            intro={false}
            demo
            paused={hovering || celebrating}
            onDemoProgress={setProgress}
            onDemoRoundEnd={handleRoundEnd}
            onDemoScenario={setScenario}
          />
        </div>
      </div>

      {/* Matched celebration clip closing every round */}
      {celebrating && (
        <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden p-6 text-center animate-in fade-in duration-500">
          <img src={media.poster} alt="" aria-hidden className="absolute inset-0 size-full object-cover brightness-50" />
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
                <span key={pill} className="rounded-full bg-paper/20 px-3 py-1 text-xs font-bold text-paper backdrop-blur-xs">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Headline and scrubber */}
      <figcaption className="absolute inset-x-0 bottom-0 z-30 flex flex-col justify-end bg-gradient-to-t from-paper via-paper/85 to-transparent p-4 pt-10 dark:from-canvas dark:via-canvas/85 sm:p-5 sm:pt-12">
        <p className="text-xs font-black uppercase leading-snug tracking-tight text-primary sm:text-sm md:text-base">
          {media.title}
        </p>
        <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-ink/15">
          <div className="h-full rounded-full bg-primary transition-all duration-100 ease-linear" style={{ width: `${celebrating ? 100 : progress}%` }} />
        </div>
      </figcaption>
    </figure>
  );
}
