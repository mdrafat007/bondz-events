import { useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  EVENT_TYPES,
  HORIZON,
  PARTNERS,
  VENUES,
  bondzBusy,
  dayToDate,
  eligiblePartners,
  estimate,
  isBusy,
  money,
} from "@/lib/bondz-data";
import { cn } from "@/lib/utils";
import { playTapSound, playTickSound } from "@/lib/haptics";
import { useBooking } from "./store";

export function Check({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full border text-[0.7rem] font-black transition-all",
        on ? "border-primary bg-primary text-primary-foreground scale-100" : "border-ink/20 text-transparent",
        className,
      )}
    >
      ✓
    </span>
  );
}

export function StepHead({ no, title, sub }: { no: string; title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rise shrink-0 min-w-0 w-full">
      <div className="flex items-center gap-3 text-ink/50">
        <span className="eyebrow text-primary">Step {no}</span>
        <span className="h-px w-10 bg-ink/20" />
      </div>
      <h1 className="display mt-2 text-[clamp(1.75rem,min(5.2vw,8vh),5rem)] break-words">{title}</h1>
      {sub && <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-snug text-ink/70">{sub}</p>}
    </div>
  );
}

export function GuestSlider({ compact }: { compact?: boolean }) {
  const { sel, setGuests } = useBooking();
  const [v, setV] = useState(sel.guests);
  const lastTick = useRef(sel.guests);
  useEffect(() => setV(sel.guests), [sel.guests]);
  return (
    <label className={cn("block min-w-0", compact ? "" : "rounded-2xl border hairline bg-surface-light p-4")}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-ink/60">Expected guests</span>
        <span className="display text-2xl tabular-nums sm:text-3xl">{v}</span>
      </span>
      <input
        type="range"
        min={10}
        max={300}
        step={5}
        value={v}
        onChange={(e) => {
          const next = +e.target.value;
          if (next !== lastTick.current) {
            lastTick.current = next;
            playTickSound(Math.min(next / 300, 1));
          }
          setV(next);
          setGuests(next);
        }}
        onPointerUp={(e) => {
          playTapSound();
          setGuests(+(e.target as HTMLInputElement).value, true);
        }}
        onKeyUp={(e) => {
          setGuests(+(e.target as HTMLInputElement).value, true);
        }}
        className="mt-2 w-full accent-primary"
        aria-label="Expected guests"
      />
      <span className="eyebrow flex justify-between text-ink/40">
        <span>10</span>
        <span>300</span>
      </span>
    </label>
  );
}

export function EstimatePanel({ cta }: { cta?: React.ReactNode }) {
  const { sel, days, day, slot, anchor } = useBooking();
  const est = estimate(sel);
  const ev = EVENT_TYPES.find((e) => e.id === sel.event);
  const date = day ? dayToDate(anchor, day) : null;
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border hairline bg-surface-light">
      <div className="border-b hairline p-4">
        <p className="eyebrow flex items-center justify-between text-ink/55">
          <span>Live estimate</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" />
            sample
          </span>
        </p>
        <p className="display mt-2 text-5xl tabular-nums">{money(est.total)}</p>
        <p className="mt-1 text-xs text-ink/60">
          {ev?.title ?? "Event"} · {sel.guests} guests · {sel.where === "venue" ? "at a venue" : "at your place"}
        </p>
      </div>
      <ul className="scroll-quiet min-h-0 flex-1 overflow-y-auto px-4 py-2 text-sm">
        {est.lines.map((l) => (
          <li key={l.label} className="flex items-baseline justify-between gap-3 border-b hairline py-2 last:border-0">
            <span className="min-w-0">
              <span className="block truncate font-medium">{l.label}</span>
              <span className="eyebrow text-ink/40">{l.note}</span>
            </span>
            <span className="font-semibold tabular-nums">{money(l.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t hairline p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-ink/60">Sample deposit (25%)</span>
          <span className="font-bold text-primary tabular-nums">{money(est.deposit)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink/60">Bookable dates · next {HORIZON} days</span>
          <span className="font-bold tabular-nums">{days.length}</span>
        </div>
        {date && (
          <div className="flex justify-between">
            <span className="text-ink/60">Selected</span>
            <span className="font-bold">
              {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              {slot ? ` · ${slot}` : ""}
            </span>
          </div>
        )}
        {cta && <div className="pt-2">{cta}</div>}
      </div>
    </div>
  );
}

/** Mobile bottom sheet version of the estimate */
export function EstimateSheet({ cta }: { cta?: React.ReactNode }) {
  const { sel } = useBooking();
  const [open, setOpen] = useState(false);
  const est = estimate(sel);
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between gap-3 border-t hairline bg-surface-light px-4 py-2.5">
        <button onClick={() => setOpen(true)} className="text-left">
          <span className="eyebrow block text-ink/50">Sample estimate · tap</span>
          <span className="display text-2xl tabular-nums">{money(est.total)}</span>
        </button>
        {cta}
      </div>
      {open && (
        <div className="fixed inset-0 z-[55] flex flex-col justify-end bg-ink/40" onClick={() => setOpen(false)}>
          <div className="rise h-[75dvh] p-2" onClick={(e) => e.stopPropagation()}>
            <EstimatePanel
              cta={
                <button
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full border hairline py-2.5 text-sm font-bold"
                >
                  Close
                </button>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function RealityPanel({ onClose }: { onClose?: () => void }) {
  const { sel, day, slot, anchor } = useBooking();
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  const date = day ? dayToDate(anchor, day) : null;
  const dateStr = date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Selected Date";

  type NotifiedParty = {
    who: string;
    role: string;
    detail: string;
  };

  const list: NotifiedParty[] = [
    {
      who: "You (Host)",
      role: "Client",
      detail: "Receipt, formal agreement & invite card",
    },
  ];

  if (venue) {
    list.push({
      who: venue.name,
      role: "Venue",
      detail: `Suggested for ${dateStr}${slot ? ` (${slot})` : ""}`,
    });
  } else if (sel.where === "home") {
    list.push({
      who: "Private Location",
      role: "Host Residence",
      detail: `Proposed site window for ${dateStr}${slot ? ` (${slot})` : ""}`,
    });
  }

  for (const c of sel.services) {
    const ps = eligiblePartners(c, sel.guests, sel.event, venue);
    const p = ps[0];
    const cat = CATEGORIES.find((x) => x.id === c);
    const name = p ? p.name : (cat?.label ?? "Partner");

    let detail = "Sample service order and calendar hold";
    if (c === "catering") {
      detail = `${sel.guests} Plate kitchen work order & dietary sheet`;
    } else if (c === "dj") {
      detail = "Audio rider, speech mics & room cue list";
    } else if (c === "photo") {
      detail = "Shot list, coverage schedule & 4K highlight packet";
    } else if (c === "lighting") {
      detail = "Acoustic room layout, warm wash & PA technical rider";
    } else if (c === "hybrid") {
      detail = "Multi-cam broadcast feed & remote guest links";
    } else if (c === "decor") {
      detail = "Tablescape specs, floral palette & load-in floorplan";
    } else if (c === "equipment") {
      detail = `${sel.guests}-guest staging, seating & canopy dispatch`;
    } else if (c === "staff") {
      detail = "Floor captain, server roster & service timetable";
    } else if (c === "cleaning") {
      detail = "Post-event strike & morning-after restoration sweep";
    }

    list.push({
      who: name,
      role: cat?.label ?? "Service Partner",
      detail,
    });
  }

  list.push({
    who: "Mr. Bondz",
    role: "Event Organizer",
    detail: "Master on-site production brief & timeline command",
  });

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border hairline bg-surface-light text-ink shadow-sm">
      <div className="flex items-start justify-between border-b hairline p-4 bg-surface-light/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="live-dot size-2 rounded-full bg-success" />
            <p className="eyebrow text-primary">Preview Confirmations</p>
          </div>
          <p className="mt-1 text-sm font-extrabold text-ink tracking-tight">See Who Gets Confirmations:</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="eyebrow text-ink/60 hover:text-ink transition-colors px-2 py-1 rounded-md hover:bg-canvas"
          >
            Hide
          </button>
        )}
      </div>

      <ul className="scroll-quiet min-h-0 flex-1 overflow-y-auto p-4 space-y-2.5">
        {list.map((item) => (
          <li
            key={item.who}
            className="flex items-start gap-2.5 rounded-xl border hairline bg-canvas p-3 transition-all hover:border-primary/40 shadow-2xs"
          >
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black">
              ✓
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-bold text-ink truncate">{item.who}</span>
                <span className="eyebrow text-[0.62rem] text-ink/45 shrink-0">{item.role}</span>
              </div>
              <p className="mt-0.5 text-[0.75rem] font-medium leading-snug text-ink/75">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Mr. Bondz Guarantee Card */}
      <div className="p-4 pt-2 border-t hairline bg-surface-light/60">
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-3.5 shadow-2xs">
          <p className="font-display text-[0.72rem] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <span>★</span> Mr. Bondz Guarantee
          </p>
          <p className="mt-1 text-[0.78rem] font-medium leading-snug text-ink/90 italic font-serif-i">
            “Every event includes my physical presence on-site. Once you lock in, all subcontractors are blocked with
            zero double-booking risk.”
          </p>
        </div>
      </div>
    </div>
  );
}

export const allPartnerCount = PARTNERS.length;
