import { useState } from "react";
import { Badge, Card, cn, triggerTap } from "@/index";
import {
  CATEGORIES, VENUES, availableDays, cheapest, estimate, priceOf, usd, venueReason,
  type CategoryId, type LogLine,
} from "@/lib/bondz-data";
import { GuestSlider, StepHead, type BookingCtx } from "./shared";

export function Step3Services({ ctx }: { ctx: BookingCtx }) {
  const { sel, patch } = ctx;
  const [log, setLog] = useState<LogLine[]>([]);
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  const budget = estimate(sel).total;
  const openNow = availableDays(sel).length;

  const record = (text: string, before: number, after: number) => {
    setLog((l) => [{ id: Date.now() + Math.round(before + after), text, before, after, at: new Date().toLocaleTimeString("en-US", { hour12: false }) }, ...l].slice(0, 6));
  };

  const toggleService = (c: CategoryId) => {
    triggerTap();
    const before = openNow;
    const next = sel.services.includes(c) ? sel.services.filter((x) => x !== c) : [...sel.services, c];
    patch({ services: next });
    const after = availableDays({ ...sel, services: next }).length;
    record(`${sel.services.includes(c) ? "Removed" : "Added"} ${CATEGORIES.find((x) => x.id === c)!.label}`, before, after);
  };

  const pickVenue = (id: string) => {
    triggerTap();
    const before = openNow;
    const next = sel.venue === id ? null : id;
    patch({ venue: next });
    const after = availableDays(sel, sel.services, next).length;
    record(next ? `Locked ${VENUES.find((v) => v.id === next)!.name}` : "Venue cleared", before, after);
  };

  return (
    <>
      <StepHead no="03" kicker="Services & partners" title="Who else is" accent="coming?">
        Every partner you add is another calendar that must line up. Watch the open dates change live.
      </StepHead>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="grid gap-5 lg:col-span-2">
          {/* Guest Count Live Tuner */}
          <Card variant="elevated">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="font-mono text-[0.66rem] font-bold uppercase tracking-wider text-primary">Headcount Tuner</span>
              <span className="text-xs font-bold text-ink">
                {sel.guests} <span className="text-subtle font-normal">Guests ({sel.guests <= 40 ? "Intimate" : sel.guests <= 100 ? "Dinner" : sel.guests <= 200 ? "Grand" : "Gala"} Tier)</span>
              </span>
            </div>
            <GuestSlider value={sel.guests} onChange={(n) => patch({ guests: n })} />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[25, 60, 120, 200, 250].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => { triggerTap(); patch({ guests: preset }); }}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-full border transition-colors",
                    sel.guests === preset ? "border-primary bg-primary text-white font-bold" : "border-hairline bg-surface hover:border-ink text-ink"
                  )}
                >
                  {preset} Guests
                </button>
              ))}
            </div>
          </Card>

          {sel.where === "venue" && (
            <Card variant="elevated">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase text-subtle">Pick your venue</p>
                <Badge variant="outline" size="sm">{sel.guests} guests</Badge>
              </div>
              <div role="radiogroup" aria-label="Venue" className="mt-4 grid gap-3 sm:grid-cols-2">
                {VENUES.map((v) => {
                  const reason = venueReason(v, sel.guests, sel.event, budget);
                  const on = sel.venue === v.id;
                  return (
                    <button key={v.id} type="button" role="radio" aria-checked={on} disabled={!!reason}
                      onClick={() => pickVenue(v.id)}
                      className={cn("rounded-card border p-4 text-left transition-colors",
                        reason ? "cursor-not-allowed border-hairline opacity-40" : on ? "border-primary bg-ink text-canvas" : "border-hairline bg-surface-light text-ink hover:border-ink")}>
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block font-serif text-xl leading-tight">{v.name}</span>
                          <span className={cn("mt-0.5 block text-xs", on ? "text-canvas/60" : "text-subtle")}>{v.area} · {v.min}–{v.max} guests</span>
                        </span>
                        <span className={cn("shrink-0 text-sm font-bold", on ? "text-primary" : "text-ink")}>{usd(v.price)}</span>
                      </span>
                      <span className={cn("mt-3 block text-xs", reason ? "font-bold text-primary" : on ? "text-canvas/60" : "text-subtle")}>
                        {reason ?? v.amenities.slice(0, 3).join(" · ")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          <Card variant="elevated">
            <p className="text-xs font-bold uppercase text-subtle">Add the services you want</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((c) => {
                const on = sel.services.includes(c.id);
                const p = cheapest(c.id, sel.guests, sel.event, venue);
                return (
                  <button key={c.id} type="button" aria-pressed={on} disabled={!p} onClick={() => toggleService(c.id)}
                    className={cn("flex items-start justify-between gap-3 rounded-card border p-4 text-left transition-colors",
                      !p ? "cursor-not-allowed border-hairline opacity-40" : on ? "border-primary bg-ink text-canvas" : "border-hairline bg-surface-light text-ink hover:border-ink")}>
                    <span>
                      <span className="block font-serif text-lg leading-tight">{c.label}</span>
                      <span className={cn("mt-1 block text-xs", on ? "text-canvas/60" : "text-subtle")}>{p ? c.desc : "No partner fits this guest count"}</span>
                    </span>
                    <span className={cn("shrink-0 text-sm font-bold", on ? "text-primary" : "text-ink")}>{p ? `from ${usd(priceOf(p, sel.guests))}` : "—"}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <aside className="grid content-start gap-5">
          <div className="rounded-card bg-ink p-6 text-canvas shadow-[var(--bondz-shadow-raised)]">
            <p className="text-xs font-bold uppercase text-canvas/60">Who gets notified instantly</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex justify-between gap-3"><span className="text-canvas/70">Mr. Bondz</span><span className="text-primary">on-site</span></li>
              {venue && <li className="flex justify-between gap-3"><span className="text-canvas/70">{venue.name}</span><span className="text-primary">venue hold</span></li>}
              {sel.services.map((c) => {
                const p = cheapest(c, sel.guests, sel.event, venue);
                return <li key={c} className="flex justify-between gap-3"><span className="text-canvas/70">{p?.name ?? c}</span><span className="text-primary">work order</span></li>;
              })}
            </ul>
            <p className="mt-5 border-t border-review-hairline pt-4 font-serif text-4xl tabular-nums">{openNow}<span className="ml-2 font-sans text-xs uppercase text-canvas/60">dates still work</span></p>
          </div>

          {log.length > 0 && (
            <Card variant="outlined">
              <p className="text-xs font-bold uppercase text-subtle">Availability log</p>
              <ul className="mt-3 space-y-2 text-xs" aria-live="polite">
                {log.map((l) => (
                  <li key={l.id} className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2 last:border-0">
                    <span className="text-ink">{l.text}</span>
                    <span className="shrink-0 tabular-nums text-subtle">{l.before} → <strong className={l.after < l.before ? "text-primary" : "text-ink"}>{l.after}</strong></span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}
