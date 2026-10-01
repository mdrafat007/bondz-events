import { Badge, cn, triggerTap } from "@/index";
import { HomeEditorialSvg, VenueEditorialSvg } from "./EventEditorialSvgs";
import { GuestSlider, StepHead, type BookingCtx } from "./shared";

const HOME_TAGS = ["1 calendar dimension", "Mr. Bondz + partners", "Add-ons live-synced", "Fastest to confirm"];
const VENUE_TAGS = ["2 calendar dimensions", "Venue + vendors + Mr. Bondz", "Catalog pre-filtered by size", "Three-way confirmation"];

export function Step2Where({ ctx }: { ctx: BookingCtx }) {
  const { sel, patch } = ctx;
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <StepHead no="02" kicker="Location" title="Where's the" accent="party?">
          Your guest count decides which venues and partners can even appear.
        </StepHead>
        <GuestSlider compact value={sel.guests} onChange={(n) => patch({ guests: n, venue: null })} />
      </div>

      <div role="radiogroup" aria-label="Location" className="mt-8 grid gap-4 md:grid-cols-2">
        <button type="button" role="radio" aria-checked={sel.where === "home"}
          onClick={() => { triggerTap(); patch({ where: "home", venue: null }); }}
          className={cn("flex min-h-[300px] flex-col justify-between rounded-card border bg-surface-light p-6 text-left text-ink transition-all sm:p-8",
            sel.where === "home" ? "border-primary shadow-[var(--bondz-shadow-raised)]" : "border-hairline hover:border-ink")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant={sel.where === "home" ? "accent" : "outline"} size="sm">Private property</Badge>
              <p className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">At My Place</p>
              <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-subtle">Your home, garden, private estate or office. Mr. Bondz + partners scout your grounds.</p>
            </div>
            <HomeEditorialSvg aria-hidden className={cn("size-20 shrink-0 transition-opacity sm:size-28", sel.where === "home" ? "text-primary opacity-70" : "opacity-30")} />
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {HOME_TAGS.map((t) => <li key={t} className="rounded-full border border-hairline px-3 py-1 text-xs text-subtle">{t}</li>)}
          </ul>
        </button>

        <button type="button" role="radio" aria-checked={sel.where === "venue"}
          onClick={() => { triggerTap(); patch({ where: "venue" }); }}
          className={cn("flex min-h-[300px] flex-col justify-between rounded-card border bg-ink p-6 text-left text-canvas transition-all sm:p-8",
            sel.where === "venue" ? "border-primary shadow-[var(--bondz-shadow-raised)]" : "border-review-hairline hover:border-primary/60")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant={sel.where === "venue" ? "accent" : "outline"} size="sm">Curated venues</Badge>
              <p className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">At a Venue</p>
              <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-canvas/75">We match you to premier verified venues + partners that fit your exact guest count.</p>
            </div>
            <VenueEditorialSvg aria-hidden className={cn("size-20 shrink-0 transition-opacity sm:size-28", sel.where === "venue" ? "text-primary opacity-80" : "text-canvas opacity-30")} />
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {VENUE_TAGS.map((t) => <li key={t} className="rounded-full border border-review-hairline px-3 py-1 text-xs text-canvas/75">{t}</li>)}
          </ul>
        </button>
      </div>
    </>
  );
}
