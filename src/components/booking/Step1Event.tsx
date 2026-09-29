import { Badge, Card, cn, triggerTap } from "@/index";
import { EVENT_NARRATIVES, EVENT_TYPES, VIBES_BY_EVENT, type EventTypeId } from "@/lib/bondz-data";
import { EVENT_SVGS } from "./EventEditorialSvgs";
import { Chip, StepHead, type BookingCtx } from "./shared";

export function Step1Event({ ctx }: { ctx: BookingCtx }) {
  const { sel, patch, vibes, setVibes } = ctx;
  const narrative = sel.event ? EVENT_NARRATIVES[sel.event] : null;
  const vibeList = sel.event ? VIBES_BY_EVENT[sel.event] : [];

  return (
    <>
      <StepHead no="01" kicker="Celebration" title="What are we" accent="celebrating?">
        Pick the occasion. Everything after this — partners, venues, dates — is filtered to fit it.
      </StepHead>

      <div role="radiogroup" aria-label="Event type" className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {EVENT_TYPES.map((e) => {
          const id = e.id as EventTypeId;
          const on = sel.event === id;
          const Svg = EVENT_SVGS[id];
          const big = id === "wedding";
          const wide = id === "custom";
          return (
            <button key={id} type="button" role="radio" aria-checked={on}
              onClick={() => { triggerTap(); patch({ event: id }); setVibes([]); }}
              className={cn(
                "group relative overflow-hidden rounded-card border p-4 text-left transition-all sm:p-5",
                big && "col-span-2 row-span-2 min-h-56",
                wide && "col-span-2",
                !big && "min-h-40",
                on ? "border-primary bg-surface-light shadow-[var(--bondz-shadow-raised)]" : "border-hairline bg-surface hover:border-ink",
              )}>
              <Svg aria-hidden className={cn(
                "pointer-events-none absolute transition-all duration-300",
                big ? "right-6 top-8 size-40" : "right-3 top-1/2 size-18 -translate-y-1/2",
                on ? "scale-105 text-primary opacity-65" : "text-ink/70 opacity-25 group-hover:text-primary/70 group-hover:opacity-45",
              )} />
              <span className="relative flex h-full flex-col justify-between gap-6">
                <span className="text-xs font-bold tabular-nums text-subtle">{e.no}</span>
                <span className="max-w-[70%]">
                  <span className={cn("block font-serif leading-tight text-ink", big ? "text-3xl sm:text-4xl" : "text-xl")}>{e.title}</span>
                  <span className="mt-1 block text-xs text-subtle">{e.line}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {narrative && (
        <Card variant="elevated" className="rise mt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-subtle">Why people book this with Mr. Bondz</p>
          <p className="mt-3 font-serif text-2xl leading-snug text-ink sm:text-3xl">
            {narrative.kicker} <em className="text-primary">{narrative.highlight}</em>
          </p>
          <p className="mt-3 max-w-3xl text-sm text-subtle">{narrative.body}</p>
        </Card>
      )}

      {sel.event && (
        <Card variant="elevated" className="rise mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase text-subtle">Celebration vibe · pick any</p>
            <Badge variant="accent" size="sm">Tailored to {EVENT_TYPES.find((e) => e.id === sel.event)?.title}</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {vibeList.map((v) => (
              <Chip key={v} on={vibes.includes(v)} onClick={() => setVibes(vibes.includes(v) ? vibes.filter((x) => x !== v) : [...vibes, v])}>{v}</Chip>
            ))}
          </div>
          <p className="mt-4 text-xs text-subtle">Your vibe steers the styling brief every partner receives — it does not change your price.</p>
        </Card>
      )}
    </>
  );
}
