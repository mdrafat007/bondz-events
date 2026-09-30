import { useMemo } from "react";
import { Card, cn, triggerTap } from "@/index";
import {
  HORIZON, SLOTS, SLOT_TIMES, VENUES, availableDays, cheapest, dayToDate, freeDayCount, slotOpen,
  type Slot,
} from "@/lib/bondz-data";
import { StepHead, type BookingCtx } from "./shared";

export function Step4Date({ ctx }: { ctx: BookingCtx }) {
  const { sel, day, setDay, slot, setSlot, anchor } = ctx;
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  const open = useMemo(() => new Set(availableDays(sel)), [sel]);

  const chips: { label: string; n: number }[] = [
    { label: "Mr. Bondz", n: freeDayCount(7, 0.22) },
    ...(venue ? [{ label: venue.name, n: freeDayCount(venue.seed, venue.busyRate) }] : []),
    ...sel.services.map((c) => {
      const p = cheapest(c, sel.guests, sel.event, venue);
      return { label: p?.name ?? c, n: p ? freeDayCount(p.seed, p.busyRate) : 0 };
    }),
  ];

  return (
    <>
      <StepHead no="04" kicker="Date & time" title="Only the dates that" accent="all work.">
        Nothing here needs a phone call. If you can click it, everyone is free.
      </StepHead>

      <Card variant="elevated" className="mt-8">
        <p className="text-xs font-bold uppercase text-subtle">The Rule</p>
        <div className="scroll-quiet mt-3 flex flex-wrap items-center gap-2 overflow-x-auto">
          {chips.map((c, i) => (
            <span key={c.label} className="flex items-center gap-2">
              {i > 0 && <span className="text-primary" aria-hidden>∩</span>}
              <span className="rounded-full border border-hairline px-3 py-1 text-xs text-ink">{c.label} <span className="text-subtle">({c.n} free)</span></span>
            </span>
          ))}
          <span className="text-primary" aria-hidden>=</span>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-surface-light">{open.size} dates that all work</span>
        </div>
      </Card>

      <Card variant="elevated" className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase text-subtle">Next {HORIZON} days</p>
          <p className="text-xs text-subtle">Greyed dates have a conflict somewhere in the chain.</p>
        </div>
        {anchor === null ? (
          <div className="mt-5 h-64 animate-pulse rounded-card bg-surface-light" />
        ) : (
          <div className="mt-5 grid grid-cols-5 gap-1.5 sm:grid-cols-10 xl:grid-cols-15">
            {Array.from({ length: HORIZON }, (_, i) => i + 1).map((d) => {
              const ok = open.has(d);
              const dt = dayToDate(anchor, d);
              const on = d === day;
              return (
                <button key={d} type="button" disabled={!ok} aria-pressed={on}
                  aria-label={dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + (ok ? " - available" : " - unavailable")}
                  onClick={() => { triggerTap(); setDay(d); }}
                  className={cn("flex aspect-square min-h-11 flex-col items-center justify-center rounded-control border text-center transition-colors",
                    on ? "border-primary bg-primary text-surface-light ring-2 ring-primary/40"
                      : ok ? "border-white/10 bg-[#151118] text-[#fbf8f2] dark:bg-[#f6f1e7] dark:text-[#151118] dark:border-[#151118]/15 hover:border-primary/60"
                        : "cursor-not-allowed border-transparent bg-ink/5 text-subtle line-through opacity-30")}>
                  <span className="text-xs font-bold uppercase opacity-70">{dt.toLocaleDateString("en-US", { month: "short" })}</span>
                  <span className="font-serif text-lg leading-none">{dt.getDate()}</span>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {day !== null && anchor && (
        <Card variant="elevated" className="rise mt-5">
          <p className="text-xs font-bold uppercase text-subtle">Pick your shift on {dayToDate(anchor, day).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          <div role="radiogroup" aria-label="Time slot" className="mt-4 grid gap-3 sm:grid-cols-3">
            {SLOTS.map((s, i) => {
              const ok = slotOpen(day, i);
              const on = slot === s;
              return (
                <button key={s} type="button" role="radio" aria-checked={on} disabled={!ok}
                  onClick={() => { triggerTap(); setSlot(s as Slot); }}
                  className={cn("rounded-card border p-4 text-left transition-colors",
                    !ok ? "cursor-not-allowed border-hairline opacity-40" : on ? "border-primary bg-ink text-canvas" : "border-hairline bg-surface-light text-ink hover:border-ink")}>
                  <span className="block font-serif text-2xl leading-tight">{s}</span>
                  <span className={cn("mt-1 block text-xs", on ? "text-canvas/60" : "text-subtle")}>{ok ? SLOT_TIMES[s] : "Taken on this date"}</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </>
  );
}
