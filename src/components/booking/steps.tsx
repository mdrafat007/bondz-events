import { useMemo, useState } from "react";
import {
  CATEGORIES,
  EVENT_TYPES,
  HORIZON,
  SLOTS,
  VENUES,
  VIBES_BY_EVENT,
  availableDays,
  bondzBusy,
  dayToDate,
  eligiblePartners,
  estimate,
  isBusy,
  money,
  priceOf,
  slotOpen,
  venueReason,
  type CategoryId,
  type EventTypeId,
  type Slot,
} from "@/lib/bondz-data";
import { signalBot } from "@/lib/bot-bus";
import { cn } from "@/lib/utils";
import { triggerTap, playTapSound } from "@/lib/haptics";
import { Check, GuestSlider, StepHead } from "./panels";
import { useBooking } from "./store";
import { EventEditorialSvg } from "./EventEditorialSvgs";

export function Primary({ children, disabled, onClick, className }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void; className?: string }) {
  return (
    <button
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          triggerTap();
          playTapSound();
        }
        onClick?.();
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold tracking-tight text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40 active:scale-95 cursor-pointer",
        className,
      )}
    >
      {children}
    </button>
  );
}
export function Ghost({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={() => {
        triggerTap();
        playTapSound();
        onClick?.();
      }}
      className="rounded-full border border-ink/20 px-5 py-3 text-sm font-bold transition hover:border-ink active:scale-95 cursor-pointer"
    >
      {children}
    </button>
  );
}

/* ───────────────── STEP 1 ───────────────── */
const SPANS: Record<string, string> = {
  wedding: "md:col-span-2 md:row-span-2",
  custom: "md:col-span-2",
};

const EVENT_NARRATIVES: Record<EventTypeId, { kicker: string; highlight: string; desc: string }> = {
  wedding: {
    kicker: "Flawless production.",
    highlight: "Zero wedding day stress.",
    desc: "From morning load-in and acoustic ceremony cues to the final sparkler send-off, Mr. Bondz personally captains every timeline, vendor sync, and table seating with calm mastery.",
  },
  anniversary: {
    kicker: "Milestone celebrations.",
    highlight: "Crafted with intimacy.",
    desc: "Curated chef tasting menus, atmospheric ambient lighting, and bespoke musical narratives honoring your journey together - whether an intimate dining room or an outdoor terrace.",
  },
  birthday: {
    kicker: "Unapologetic celebration.",
    highlight: "Zero planning fatigue.",
    desc: "Boutique cocktail bars, high-vibe soundscapes, and immersive decor so you and your guests can simply walk in, celebrate, and dance until 2 AM without chasing a single vendor.",
  },
  bbq: {
    kicker: "Smoky feast, sun & style.",
    highlight: "Handled end-to-end.",
    desc: "Live pitmaster grilling, artisanal craft drink stations, lawn setups, and weather-proof canopies - delivering elevated open-air hospitality with zero host cleanup.",
  },
  family: {
    kicker: "Multi-generational warmth.",
    highlight: "One unified table.",
    desc: "Comfort-forward family dining, generational music curation, and seamless seating setups so you spend the entire day catching up, not running around.",
  },
  corporate: {
    kicker: "Precision brand hospitality.",
    highlight: "Executive polish.",
    desc: "Keynote-ready staging, seamless audiovisuals, VIP hospitality lounges, and culinary excellence designed to leave partners, investors, and clients thoroughly impressed.",
  },
  hybrid: {
    kicker: "It’s not just live.",
    highlight: "It’s live + digital.",
    desc: "Hybrid events blend in-person energy with virtual participation through broadcasting and digital tools - so people can join from anywhere. Creative stage design, AV integration and a smart streaming platform, all coordinated by Mr. Bondz.",
  },
  custom: {
    kicker: "Bespoke architecture.",
    highlight: "You dream it, we execute it.",
    desc: "Have a unique concept, themed gala, or unusual venue? Mr. Bondz engineers custom floorplans, bespoke lighting, and custom vendor orchestration from scratch.",
  },
};

export function Step1() {
  const { sel, setSel, setStep, vibes, setVibes } = useBooking();
  const narrative = sel.event ? EVENT_NARRATIVES[sel.event] : null;

  return (
    <div className="flex w-full max-w-full min-w-0 h-full min-h-0 flex-col gap-3 sm:gap-4">
      <StepHead no="01" title={<>What are we <span className="font-serif-i text-primary">celebrating?</span></>} sub="Pick the shape of the event. Let us make your moment real." />
      <div className="scroll-quiet grid w-full max-w-full min-h-0 flex-1 auto-rows-[minmax(6.5rem,1fr)] grid-cols-2 gap-2 sm:gap-2.5 overflow-x-hidden overflow-y-auto md:grid-cols-4 md:grid-rows-3 md:overflow-visible">
        {EVENT_TYPES.map((e) => {
          const on = sel.event === e.id;
          return (
            <button
              key={e.id}
              onClick={() => {
                playTapSound();
                setSel((s) => ({ ...s, event: e.id }));
                signalBot({ mood: "happy", tip: `${e.title}. Great choice - next, where?` });
              }}
              aria-pressed={on}
              className={cn(
                "group relative flex min-w-0 w-full flex-col justify-between overflow-hidden rounded-2xl border p-3 sm:p-4 text-left transition-all",
                on ? "border-primary bg-surface-light ring-2 ring-primary shadow-sm" : "hairline bg-surface-light/60 hover:border-ink/40 hover:bg-surface-light",
                SPANS[e.id],
              )}
            >
              <span className="relative z-10 flex w-full items-start justify-between min-w-0">
                <span className="text-xs font-bold text-ink/40">{e.no}</span>
                <Check on={on} />
              </span>
              <div
                className={cn(
                  "pointer-events-none absolute transition-all duration-500",
                  e.id === "wedding"
                    ? "right-2 sm:right-6 top-6 sm:top-8 size-24 sm:size-32 md:size-40 group-hover:scale-105"
                    : "right-1.5 sm:right-3 top-1/2 -translate-y-1/2 size-12 sm:size-14 md:size-18 group-hover:scale-105",
                  on
                    ? "opacity-65 text-primary scale-105"
                    : "opacity-25 text-ink/70 group-hover:opacity-45 group-hover:text-primary/70",
                )}
              >
                <EventEditorialSvg id={e.id} className="size-full" />
              </div>
              <span className="relative z-10 min-w-0 w-full">
                <span className={cn("display block leading-tight", e.id === "wedding" ? "text-3xl sm:text-5xl md:text-6xl" : "text-base sm:text-xl md:text-2xl")}>{e.title}</span>
                <span className="mt-1 block text-[0.70rem] sm:text-xs leading-snug text-ink/60 line-clamp-2">{e.line}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Relevant Editorial Guidance Banner for Every Selected Event */}
      {narrative && (
        <div className="rise shrink-0 rounded-2xl bg-surface-light p-5 md:p-6 text-ink border hairline shadow-sm">
          <p className="eyebrow text-ink/60 font-bold uppercase tracking-widest text-[0.68rem]">Why people book this with Mr. Bondz</p>
          <p className="font-serif text-2xl sm:text-3xl leading-snug mt-2 text-ink">
            {narrative.kicker} <span className="text-primary italic font-normal">{narrative.highlight}</span>
          </p>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/70 font-medium max-w-3xl">
            {narrative.desc}
          </p>
        </div>
      )}

      {/* Celebration Vibe Chips (from screenshot 1) */}
      {sel.event && (
        <div className="rise shrink-0 rounded-2xl border hairline bg-surface-light p-5 md:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow text-ink/60 font-bold uppercase tracking-wider text-[0.68rem]">
              Celebration vibe · pick any
            </span>
            <span className="rounded-full bg-primary px-3 py-1 font-display text-[0.68rem] font-black uppercase tracking-wider text-white shadow-xs">
              Tailored to {EVENT_TYPES.find((e) => e.id === sel.event)?.title}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-2.5">
            {((VIBES_BY_EVENT as any)[sel.event] ?? []).map((v: string) => {
              const on = vibes.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    playTapSound();
                    setVibes(on ? vibes.filter((x) => x !== v) : [...vibes, v]);
                  }}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-all cursor-pointer",
                    on
                      ? "border-ink bg-ink text-canvas font-bold shadow-xs"
                      : "hairline bg-surface-light/80 text-ink/80 hover:border-ink hover:text-ink"
                  )}
                >
                  {on ? "✓ " : ""}{v}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-ink/50">
            Your vibe steers the styling brief every partner receives - it does not change your price.
          </p>
        </div>
      )}

      <div className="flex shrink-0 justify-end">
        <Primary disabled={!sel.event} onClick={() => setStep(2)}>Continue →</Primary>
      </div>
    </div>
  );
}

/* ───────────────── STEP 2 ───────────────── */
function HomeEditorialSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="80" cy="80" r="64" fill="currentColor" fillOpacity="0.05" />
      <line x1="16" y1="138" x2="144" y2="138" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="28" y1="144" x2="132" y2="144" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />
      <path d="M40 138V66L80 34L120 66V138H40Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M34 69L80 32L126 69" stroke="#f1453b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="52" r="7" stroke="currentColor" strokeWidth="1.8" />
      <line x1="80" y1="45" x2="80" y2="59" stroke="currentColor" strokeWidth="1.2" />
      <line x1="73" y1="52" x2="87" y2="52" stroke="currentColor" strokeWidth="1.2" />
      <rect x="52" y="74" width="16" height="24" rx="8" stroke="currentColor" strokeWidth="1.8" />
      <line x1="52" y1="84" x2="68" y2="84" stroke="currentColor" strokeWidth="1.2" />
      <line x1="60" y1="74" x2="60" y2="98" stroke="currentColor" strokeWidth="1.2" />
      <rect x="92" y="74" width="16" height="24" rx="8" stroke="currentColor" strokeWidth="1.8" />
      <line x1="92" y1="84" x2="108" y2="84" stroke="currentColor" strokeWidth="1.2" />
      <line x1="100" y1="74" x2="100" y2="98" stroke="currentColor" strokeWidth="1.2" />
      <path d="M70 138V110C70 105.5 73.5 102 78 102H82C86.5 102 90 105.5 90 110V138H70Z" stroke="currentColor" strokeWidth="2" />
      <path d="M66 102H94" stroke="#f1453b" strokeWidth="2" strokeLinecap="round" />
      <circle cx="76" cy="122" r="1.5" fill="#f1453b" />
      <rect x="49" y="112" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="99" y="112" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="95" r="2" fill="#f1453b" />
      <path d="M26 44L28 38L34 36L28 34L26 28L24 34L18 36L24 38L26 44Z" fill="#f1453b" opacity="0.8" />
      <path d="M136 50L137.5 45L142 43.5L137.5 42L136 37L134.5 42L130 43.5L134.5 45L136 50Z" fill="#f1453b" opacity="0.6" />
    </svg>
  );
}

function VenueEditorialSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="80" cy="80" r="64" fill="currentColor" fillOpacity="0.05" />
      <line x1="14" y1="138" x2="146" y2="138" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
      <line x1="22" y1="143" x2="138" y2="143" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.3" />
      <line x1="32" y1="148" x2="128" y2="148" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.15" />
      <path d="M30 68C30 40 52 24 80 24C108 24 130 40 130 68" stroke="#f1453b" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 68C42 46 59 34 80 34C101 34 118 46 118 68" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
      <rect x="24" y="68" width="112" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
      <line x1="20" y1="68" x2="140" y2="68" stroke="#f1453b" strokeWidth="2" strokeLinecap="round" />
      <rect x="34" y="76" width="10" height="62" stroke="currentColor" strokeWidth="1.8" />
      <line x1="39" y1="78" x2="39" y2="136" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="58" y="76" width="10" height="62" stroke="currentColor" strokeWidth="1.8" />
      <line x1="63" y1="78" x2="63" y2="136" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="92" y="76" width="10" height="62" stroke="currentColor" strokeWidth="1.8" />
      <line x1="97" y1="78" x2="97" y2="136" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="116" y="76" width="10" height="62" stroke="currentColor" strokeWidth="1.8" />
      <line x1="121" y1="78" x2="121" y2="136" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M72 138V98C72 93 75.5 89 80 89C84.5 89 88 93 88 98V138" stroke="#f1453b" strokeWidth="2" />
      <line x1="80" y1="68" x2="80" y2="82" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="80" cy="84" r="2.5" fill="#f1453b" />
      <line x1="80" y1="24" x2="80" y2="68" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <line x1="56" y1="31" x2="68" y2="68" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <line x1="104" y1="31" x2="92" y2="68" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <path d="M142 34L144 28L150 26L144 24L142 18L140 24L134 26L140 28L142 34Z" fill="#f1453b" opacity="0.8" />
    </svg>
  );
}

export function Step2() {
  const { sel, setSel, setStep } = useBooking();
  const branches = [
    {
      id: "home" as const,
      t: "At My Place",
      badge: "Private Property",
      d: "Your home, garden, private estate or office. Mr. Bondz commands on-site production and coordinates vetted partners on demand.",
      tags: ["1 calendar dimension", "Bondz + partners", "Add-ons live-synced", "Fastest to confirm"],
    },
    {
      id: "venue" as const,
      t: "At a Venue",
      badge: "Curated Venues",
      d: "We match you to premier verified venues that fit your exact crowd count and are confirmed free on the same date as our partners.",
      tags: ["2 calendar dimensions", "Venue + vendors + Bondz", "Catalog pre-filtered by size", "Three-way confirmation"],
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="grid shrink-0 gap-4 md:grid-cols-[1fr_22rem] md:items-end">
        <StepHead no="02" title="Where’s the party?" sub="Two routes. Both end at “You’re Booked” - one just has more calendars to reconcile." />
        <GuestSlider />
      </div>
      <div className="scroll-quiet grid min-h-0 flex-1 gap-3 overflow-y-auto md:grid-cols-2">
        {branches.map((b) => (
          <div
            key={b.id}
            className={cn(
              "group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5 transition md:p-7 shadow-sm",
              b.id === "venue" ? "border-ink bg-ink text-canvas" : "hairline bg-surface-light text-ink"
            )}
          >
            {/* Top Row: Editorial Badge & Big Editorial Architecture SVG */}
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "eyebrow inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold text-xs uppercase",
                  b.id === "venue"
                    ? "border border-white/20 bg-white/10 text-canvas"
                    : "border hairline bg-canvas/80 text-ink"
                )}
              >
                <span className="size-1.5 rounded-full bg-primary" />
                {b.badge}
              </span>

              {/* Editorial High-End Illustration */}
              <div className="size-24 sm:size-28 md:size-32 transition-transform duration-500 group-hover:scale-105">
                {b.id === "home" ? (
                  <HomeEditorialSvg className="size-full object-contain" />
                ) : (
                  <VenueEditorialSvg className="size-full object-contain" />
                )}
              </div>
            </div>

            <div>
              <h2 className="display text-4xl md:text-5xl lg:text-6xl">{b.t}</h2>
              <p className="mt-3 max-w-md text-sm leading-snug opacity-75">{b.d}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {b.tags.map((t) => (
                  <li key={t} className={cn("eyebrow rounded-full border px-2.5 py-1", b.id === "venue" ? "border-canvas/25" : "hairline")}>{t}</li>
                ))}
              </ul>
              <button
                onClick={() => {
                  playTapSound();
                  setSel((s) => ({ ...s, where: b.id, venue: b.id === "home" ? null : s.venue }));
                  setStep(3);
                  signalBot({ mood: "happy", tip: b.id === "home" ? "Add partners - only ones free together are offered." : "Only venues that fit your crowd made it onto this screen." });
                }}
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground transition hover:brightness-110 active:scale-95 shadow-md cursor-pointer"
              >
                Choose →
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="shrink-0 pl-20"><Ghost onClick={() => setStep(1)}>← Back</Ghost></div>
    </div>
  );
}

/* ───────────────── SERVICE GRID (3A + 3B) ───────────────── */
function ServiceGrid() {
  const { sel, toggleService } = useBooking();
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  // Quiet filtering: categories with zero eligible partners are simply not rendered.
  const live = CATEGORIES.map((c) => ({ ...c, ps: eligiblePartners(c.id, sel.guests, sel.event, venue) })).filter((c) => c.ps.length > 0);
  return (
    <>
      <p className="eyebrow text-ink/55">
        Catalog at {sel.guests} guests → <span className="text-ink">{live.length} services live</span>
      </p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {live.map((c) => {
          const on = sel.services.includes(c.id);
          const p = c.ps.reduce((a, b) => (priceOf(a, sel.guests) <= priceOf(b, sel.guests) ? a : b));
          return (
            <button
              key={c.id}
              onClick={() => {
                playTapSound();
                toggleService(c.id as CategoryId);
              }}
              aria-pressed={on}
              className={cn(
                "flex gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer",
                on ? "border-primary bg-surface-light ring-2 ring-primary" : "hairline bg-surface-light/60 hover:border-ink/40 hover:bg-surface-light",
              )}
            >
              <Check on={on} className="mt-0.5" />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-bold tracking-tight">{c.label}</span>
                  <span className="text-right">
                    <span className="block text-lg font-extrabold tabular-nums text-primary">{money(priceOf(p, sel.guests))}</span>
                    <span className="eyebrow text-ink/45">{p.flat ? "flat rate" : `$${p.perGuest} / guest`}</span>
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-snug text-ink/65">{c.desc}</span>
                <span className="mt-2 block text-[0.72rem] leading-snug text-ink/55">
                  System will assign: <span className="font-semibold text-ink">{c.ps.map((x) => x.name).join(" or ")}</span> · {c.ps.length} partner{c.ps.length > 1 ? "s" : ""} eligible for {sel.guests} guests
                </span>
                {on && <span className="eyebrow mt-2 inline-block text-primary">✓ Added</span>}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export function Step3A() {
  return (
    <div className="flex flex-col gap-4">
      <StepHead no="03" title="Build your at-home event." sub="Mr. Bondz handles planning and on-site coordination. Add partners - each is live-synced, so only ones that can actually show up together are offered." />
      <GuestSlider />
      <ServiceGrid />
      <p className="text-xs text-ink/55">You can skip add-ons entirely - Bondz delivers solo events too.</p>
    </div>
  );
}

export function Step3B() {
  const { sel, chooseVenue } = useBooking();
  const [showHidden, setShowHidden] = useState(false);
  const ev = EVENT_TYPES.find((e) => e.id === sel.event);
  const evaluated = VENUES.map((v) => {
    const est = estimate({ ...sel, venue: v.id }).total;
    let reason = venueReason(v, sel.guests, sel.event, est);
    const open = reason ? 0 : availableDays({ ...sel, services: [] }, [], v.id).length;
    if (!reason && open === 0) reason = "No shared open dates with Mr. Bondz";
    return { v, reason, open };
  });
  const shown = evaluated.filter((x) => !x.reason);
  const hidden = evaluated.filter((x) => x.reason);
  return (
    <div className="flex flex-col gap-4">
      <StepHead
        no="03"
        title="Venues that fit."
        sub={<>Showing only venues that host a <b>{ev?.title.toLowerCase() ?? "event"}</b>, hold <b>{sel.guests} guests</b>, and share open dates with Mr. Bondz.</>}
      />
      <GuestSlider />
      <div className="flex flex-wrap items-center justify-between gap-3 border-y hairline py-2.5">
        <p className="text-xs text-ink/70">
          You are looking at <b className="text-ink">{shown.length} of {VENUES.length}</b> venues. The rest were removed before this screen was drawn - wrong event type, wrong capacity, or minimum spend you don't meet.
        </p>
        <button onClick={() => setShowHidden((s) => !s)} className="eyebrow shrink-0 rounded-full border hairline px-3 py-1.5 hover:border-ink">
          {showHidden ? "Hide them again" : "Reveal the hidden ones"}
        </button>
      </div>
      {showHidden && (
        <ul className="rise grid gap-2 sm:grid-cols-2">
          {hidden.map(({ v, reason }) => (
            <li key={v.id} className="flex items-center justify-between gap-3 rounded-xl border border-dashed hairline px-3 py-2 text-xs">
              <span className="font-semibold text-ink/60 line-through decoration-primary">{v.name}</span>
              <span className="eyebrow text-primary">{reason}</span>
            </li>
          ))}
          {hidden.length === 0 && <li className="text-xs text-ink/50">Nothing hidden - every venue fits.</li>}
        </ul>
      )}
      <div className="grid gap-2.5 md:grid-cols-3">
        {shown.map(({ v, open }) => {
          const on = sel.venue === v.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                playTapSound();
                chooseVenue(v.id);
              }}
              aria-pressed={on}
              className={cn("flex flex-col rounded-2xl border p-4 text-left transition-all", on ? "border-primary bg-surface-light ring-2 ring-primary" : "hairline bg-surface-light/60 hover:border-ink/40")}
            >
              <span className="flex items-start justify-between gap-2">
                <span>
                  <span className="display block text-2xl">{v.name}</span>
                  <span className="eyebrow text-ink/50">{v.area}</span>
                </span>
                <Check on={on} />
              </span>
              <span className="mt-3 flex items-baseline gap-3">
                <span className="text-xl font-extrabold text-primary">{money(v.price)}</span>
                <span className="eyebrow text-ink/50">{v.min}-{v.max} guests</span>
              </span>
              <span className="mt-2 flex flex-wrap gap-1">
                {v.amenities.map((a) => (
                  <span key={a} className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium">{a}</span>
                ))}
              </span>
              <span className="mt-3 text-[0.72rem] text-ink/65">Right-sized for {sel.guests} guests (capacity {v.max}, minimum {v.min})</span>
              <span className="eyebrow mt-1 text-success">✓ {open} open dates with Bondz</span>
            </button>
          );
        })}
      </div>
      {!sel.venue && <p className="eyebrow text-primary">Select a venue to continue</p>}
      {sel.venue && (
        <div className="rise flex flex-col gap-3 border-t hairline pt-4">
          <h3 className="display text-3xl">Add the vendors.</h3>
          <ServiceGrid />
        </div>
      )}
    </div>
  );
}

/* ───────────────── STEP 4 ───────────────── */
export const SHIFT_DETAILS: Record<Slot, { label: string; time: string; shortTime: string }> = {
  Morning: { label: "Morning", time: "9:00 AM - 2:00 PM", shortTime: "9 AM - 2 PM" },
  Afternoon: { label: "Afternoon", time: "2:00 PM - 6:00 PM", shortTime: "2 PM - 6 PM" },
  Evening: { label: "Evening", time: "5:00 PM - 10:00 PM", shortTime: "5 PM - 10 PM" },
};

export function Step4() {
  const { sel, days, day, setDay, slot, setSlot, anchor } = useBooking();
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;

  const sources = useMemo(() => {
    const all = Array.from({ length: HORIZON }, (_, i) => i + 1);
    const s: { n: string; free: number }[] = [{ n: "Mr. Bondz", free: all.filter((d) => !bondzBusy(d)).length }];
    if (venue) s.push({ n: venue.name, free: all.filter((d) => !isBusy(venue.seed, venue.busyRate, d)).length });
    for (const c of sel.services) {
      const ps = eligiblePartners(c, sel.guests, sel.event, venue);
      s.push({ n: CATEGORIES.find((x) => x.id === c)!.label, free: all.filter((d) => ps.some((p) => !isBusy(p.seed, p.busyRate, d))).length });
    }
    return s;
  }, [sel, venue]);
  const calCount = 1 + (venue ? 1 : 0) + sel.services.reduce((a, c) => a + eligiblePartners(c, sel.guests, sel.event, venue).length, 0);

  const months = useMemo(() => {
    const m = new Map<string, number[]>();
    for (const d of days) {
      const k = dayToDate(anchor, d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      m.set(k, [...(m.get(k) ?? []), d]);
    }
    return [...m.entries()];
  }, [days, anchor]);

  return (
    <div className="flex flex-col gap-4">
      <StepHead no="04" title={<>Pick a date. <span className="font-serif-i text-primary">Every one works.</span></>} sub={`We intersected ${calCount} live calendars. Days where anyone is booked aren't shown at all.`} />
      <div className="scroll-quiet flex items-stretch gap-1.5 overflow-x-auto pb-1">
        {sources.map((s, i) => (
          <div key={s.n} className="flex shrink-0 items-center gap-1.5">
            <div className="rounded-xl border hairline bg-surface-light px-3 py-2">
              <p className="eyebrow text-ink/50">{s.n}</p>
              <p className="text-lg font-extrabold tabular-nums">{s.free}<span className="text-xs font-medium text-ink/40"> free</span></p>
            </div>
            <span className="text-ink/30">{i < sources.length - 1 ? "∩" : "="}</span>
          </div>
        ))}
        <div className="flex shrink-0 items-center rounded-xl bg-ink px-4 py-2 text-canvas">
          <p className="text-lg font-extrabold tabular-nums">{days.length} <span className="text-xs font-medium opacity-70">dates that all work</span></p>
        </div>
      </div>

      {months.map(([m, ds]) => (
        <section key={m}>
          <p className="eyebrow mb-2.5 flex items-center gap-3 text-ink/55">
            <span className="font-bold text-xs uppercase tracking-wider">{m}</span>
            <span className="h-px flex-1 bg-ink/10" />
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {ds.map((d) => {
              const date = dayToDate(anchor, d);
              const openSlots = SLOTS.filter((_, s) => slotOpen(d, s));
              const on = day === d;
              return (
                <button
                  key={d}
                  onClick={() => {
                    playTapSound();
                    setDay(d);
                    setSlot(null);
                    signalBot({ mood: "happy", tip: "That date works for everyone. Pick a time." });
                  }}
                  aria-pressed={on}
                  className={cn(
                    "flex flex-col justify-between rounded-xl p-3 text-left transition-all border shadow-2xs group cursor-pointer",
                    on
                      ? "border-primary bg-primary text-white shadow-md ring-2 ring-primary/30 -translate-y-0.5"
                      : "border-[#e2ded6] bg-white text-[#151118] hover:border-primary/60 hover:shadow-sm hover:-translate-y-0.5"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={cn("text-[0.68rem] font-bold uppercase tracking-wider", on ? "text-white/80" : "text-[#151118]/60")}>
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span
                      className={cn(
                        "text-[0.62rem] font-semibold px-1.5 py-0.5 rounded-md",
                        on ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                      )}
                    >
                      {on ? "✓ Selected" : `${openSlots.length} shift${openSlots.length > 1 ? "s" : ""}`}
                    </span>
                  </div>
                  <div className="my-1.5">
                    <span className="display block text-3xl font-black leading-none">{date.getDate()}</span>
                  </div>
                  <div
                    className={cn(
                      "mt-1 flex flex-col gap-1 border-t pt-1.5 text-[0.63rem] leading-tight w-full",
                      on ? "border-white/20 text-white/90" : "border-black/10 text-[#151118]/80"
                    )}
                  >
                    {openSlots.map((s) => (
                      <div key={s} className="flex items-center justify-between gap-1 truncate">
                        <span className="font-bold">{s}</span>
                        <span className="opacity-75 tabular-nums text-[0.58rem]">{SHIFT_DETAILS[s].shortTime}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
      {days.length === 0 && (
        <p className="rounded-2xl border hairline bg-surface-light p-4 text-sm">
          No single day works for every partner you picked. Go back and drop one service - we'll show you the dates that come back.
        </p>
      )}
    </div>
  );
}

export function SlotPicker() {
  const { day, slot, setSlot, anchor } = useBooking();
  if (!day) return null;
  const date = dayToDate(anchor, day);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return (
    <div className="rise flex flex-col gap-1.5 rounded-2xl border border-primary/20 bg-primary/5 p-2.5 sm:p-3.5 max-w-full overflow-hidden">
      <div className="flex items-center justify-between flex-wrap gap-1">
        <span className="eyebrow text-ink/75 font-bold uppercase tracking-wider text-[0.65rem] sm:text-xs">
          Available Shifts · {dateStr}
        </span>
        <span className="text-[0.62rem] sm:text-xs text-primary font-semibold">Select shift to lock</span>
      </div>
      <div className="scroll-quiet flex items-center gap-2 pt-1 overflow-x-auto max-w-full pb-0.5">
        {SLOTS.map((s, i) =>
          slotOpen(day, i) ? (
            <button
              key={s}
              onClick={() => {
                playTapSound();
                setSlot(s);
              }}
              aria-pressed={slot === s}
              className={cn(
                "group shrink-0 flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition shadow-xs cursor-pointer whitespace-nowrap",
                slot === s
                  ? "border-primary bg-primary text-white shadow-md ring-2 ring-primary/30"
                  : "bg-white text-[#151118] border-[#e2ded6] hover:border-primary/60 hover:shadow"
              )}
            >
              <span className={cn("inline-block size-1.5 rounded-full", slot === s ? "bg-white" : "bg-emerald-500")} />
              <span>{s}</span>
              <span className={cn("text-[0.62rem] font-medium opacity-85", slot === s ? "text-white/90" : "text-[#151118]/70")}>
                ({SHIFT_DETAILS[s].shortTime})
              </span>
              {slot === s && <span className="text-xs">✓</span>}
            </button>
          ) : null,
        )}
      </div>
    </div>
  );
}

