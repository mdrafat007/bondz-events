import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Button, Badge } from "../index";
import { MarketingNav } from "../components/layout/MarketingNav";
import { SiteFooter } from "../components/layout/SiteFooter";
import { useBookingLaunch } from "../lib/use-booking-launch";
import { PARTNERS, VENUES, CATEGORIES, HORIZON, categoryLabel, priceLabel, openDayCount, nextOpenDay, dayLabel, type Partner, type Venue } from "../lib/bondz-data";

export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [
    { title: "Partners — Bondz Events" },
    { name: "description", content: "Seventeen vetted partners and five venues, each with live availability across the next 75 days. Only simultaneously free dates ever reach your screen." },
    { property: "og:title", content: "Verified Partner Network — Bondz Events" },
    { property: "og:description", content: "Seventeen vetted partners and five venues with live availability across the next 75 days." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PartnersPage,
});

const TICKER = [...VENUES.map((venue) => ({ category: "Venue", name: venue.name })), ...PARTNERS.map((partner) => ({ category: categoryLabel(partner.category), name: partner.name }))];

type Selected = { kind: "partner"; data: Partner } | { kind: "venue"; data: Venue };

function AvailabilityLine({ seed, busyRate }: { seed: number; busyRate: number }) {
  const open = openDayCount(seed, busyRate);
  const next = nextOpenDay(seed, busyRate);
  return <div className="flex flex-wrap items-center gap-2">
    <span className="size-1.5 shrink-0 rounded-full bg-status" aria-hidden="true" />
    <span className="font-sans text-[0.62rem] font-extrabold uppercase tracking-widest text-ink">{open} of {HORIZON} days open</span>
    {next !== null && <span className="font-sans text-[0.62rem] font-bold uppercase tracking-widest text-subtle">Next: {dayLabel(next)}</span>}
  </div>;
}

function Drawer({ selection, onClose, onBook }: { selection: Selected; onClose: () => void; onBook: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isVenue = selection.kind === "venue";
  const data = selection.data;
  const events = data.events === "all" ? "All event types" : data.events.map((event) => event[0].toUpperCase() + event.slice(1)).join(", ");

  return <div className="fixed inset-0 z-50 flex justify-end">
    <button type="button" aria-label="Close partner details" onClick={onClose} className="absolute inset-0 cursor-default bg-night/60 backdrop-blur-sm" />
    <aside role="dialog" aria-modal="true" aria-label={`${data.name} details`} className="scroll-quiet relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-hairline bg-canvas p-6 shadow-popover sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="font-sans text-[0.62rem] font-extrabold uppercase tracking-widest text-primary">{isVenue ? "Venue" : categoryLabel((data as Partner).category)}</span>
          <h2 className="mt-1 font-serif text-3xl italic leading-tight text-ink">{data.name}</h2>
          {isVenue && <p className="mt-1 font-sans text-[0.65rem] font-bold uppercase tracking-widest text-subtle">{(data as Venue).area}</p>}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">✕</Button>
      </div>
      <div className="mt-5 rounded-card border border-hairline bg-surface-light p-4">
        <AvailabilityLine seed={data.seed} busyRate={data.busyRate} />
        <p className="mt-2 text-xs text-subtle">Availability is recalculated across the next {HORIZON} days every time this page loads.</p>
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-hairline pb-3"><dt className="font-sans text-[0.65rem] font-extrabold uppercase tracking-widest text-subtle">Price</dt><dd className="font-sans font-bold text-ink">{isVenue ? `$${(data as Venue).price.toLocaleString()}` : priceLabel(data as Partner)}</dd></div>
        {isVenue && (data as Venue).minSpend > 0 && <div className="flex justify-between gap-4 border-b border-hairline pb-3"><dt className="font-sans text-[0.65rem] font-extrabold uppercase tracking-widest text-subtle">Minimum spend</dt><dd className="font-sans font-bold text-ink">${(data as Venue).minSpend.toLocaleString()}</dd></div>}
        <div className="flex justify-between gap-4 border-b border-hairline pb-3"><dt className="font-sans text-[0.65rem] font-extrabold uppercase tracking-widest text-subtle">Guest range</dt><dd className="font-sans font-bold text-ink">{data.min}–{data.max}</dd></div>
        <div className="flex justify-between gap-4 border-b border-hairline pb-3"><dt className="font-sans text-[0.65rem] font-extrabold uppercase tracking-widest text-subtle">Rating</dt><dd className="font-sans font-bold text-ink">4.9 / 5.0</dd></div>
        <div className="border-b border-hairline pb-3"><dt className="font-sans text-[0.65rem] font-extrabold uppercase tracking-widest text-subtle">Serves</dt><dd className="mt-1 text-ink">{events}</dd></div>
        {isVenue && <div><dt className="font-sans text-[0.65rem] font-extrabold uppercase tracking-widest text-subtle">Amenities</dt><dd className="mt-2 flex flex-wrap gap-2">{(data as Venue).amenities.map((item) => <Badge key={item} variant="neutral" size="sm">{item}</Badge>)}</dd></div>}
      </dl>
      <Button variant="primary" size="lg" className="mt-7 w-full rounded-full" onClick={onBook}>Book with this partner →</Button>
    </aside>
  </div>;
}

function PartnersPage() {
  const [selection, setSelection] = useState<Selected | null>(null);
  const [category, setCategory] = useState<string>("all");
  const { launchBooking, curtain } = useBookingLaunch();
  const visible = PARTNERS.filter((partner) => category === "all" || partner.category === category);

  return <AppShell header={<MarketingNav active="/partners" />} footer={<SiteFooter className="hidden sm:block" />}>
    <div className="w-full">
      <div className="overflow-x-hidden border-b border-hairline bg-surface py-3" aria-label="Partner network">
        <div className="ticker-marquee-left">
          {[0, 1].map((copy) => <div key={copy} className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={copy === 1 ? true : undefined}>
            {TICKER.map((entry) => <div key={entry.name} className="flex shrink-0 items-center gap-2 rounded-full border border-hairline bg-surface-light px-4 py-1.5 shadow-soft">
              <span className="font-serif text-xs italic text-primary">{entry.category}</span>
              <span className="font-sans text-xs font-extrabold uppercase tracking-tight text-ink">{entry.name}</span>
              <span className="size-1.5 shrink-0 rounded-full bg-status" aria-hidden="true" />
            </div>)}
          </div>)}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 md:px-8">
        <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-widest text-primary">Verified network</span>
        <h1 className="mt-3 max-w-3xl font-sans text-[clamp(2.1rem,5.4vw,4rem)] font-black uppercase leading-[0.95] tracking-tight text-ink [font-variation-settings:'wdth'_85]">
          {PARTNERS.length} partners<span className="font-serif font-normal italic tracking-normal text-primary"> and </span>{VENUES.length} venues
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-subtle">Every partner below shares a live calendar with Mr. Bondz. A date only reaches your screen when all of them are simultaneously free.</p>

        <h2 className="mt-12 font-sans text-xs font-black uppercase tracking-widest text-ink">Venues</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {VENUES.map((venue) => <article key={venue.id} className="flex flex-col rounded-2xl border border-hairline bg-surface-light p-5 shadow-soft">
            <h3 className="font-serif text-2xl italic leading-tight text-ink">{venue.name}</h3>
            <p className="mt-1 font-sans text-[0.65rem] font-bold uppercase tracking-widest text-subtle">{venue.area}</p>
            <p className="mt-3 text-sm text-subtle">{venue.min}–{venue.max} guests · ${venue.price.toLocaleString()}</p>
            <div className="mt-3"><AvailabilityLine seed={venue.seed} busyRate={venue.busyRate} /></div>
            <Button variant="outline" size="sm" className="mt-5 w-fit rounded-full" onClick={() => setSelection({ kind: "venue", data: venue })}>View details →</Button>
          </article>)}
        </div>

        <h2 className="mt-14 font-sans text-xs font-black uppercase tracking-widest text-ink">Partner vendors</h2>
        <div role="tablist" aria-label="Filter partners by category" className="scroll-quiet mt-4 flex gap-2 overflow-x-auto pb-1">
          {[{ id: "all", label: "All" }, ...CATEGORIES].map((item) => <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={category === item.id}
            onClick={() => setCategory(item.id)}
            className={`shrink-0 rounded-full border px-4 py-2 font-sans text-[0.65rem] font-extrabold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${category === item.id ? "border-primary bg-primary text-surface-light" : "border-hairline bg-surface-light text-subtle hover:text-ink"}`}
          >{item.label}</button>)}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((partner) => <article key={partner.id} className="flex flex-col rounded-2xl border border-hairline bg-surface-light p-5 shadow-soft">
            <span className="font-serif text-xs italic text-primary">{categoryLabel(partner.category)}</span>
            <h3 className="mt-1 font-sans text-base font-black uppercase leading-tight tracking-tight text-ink">{partner.name}</h3>
            <p className="mt-2 text-sm text-subtle">{priceLabel(partner)} · {partner.min}–{partner.max} guests</p>
            <div className="mt-3"><AvailabilityLine seed={partner.seed} busyRate={partner.busyRate} /></div>
            <Button variant="outline" size="sm" className="mt-5 w-fit rounded-full" onClick={() => setSelection({ kind: "partner", data: partner })}>View details →</Button>
          </article>)}
        </div>
      </div>
    </div>
    {selection && <Drawer selection={selection} onClose={() => setSelection(null)} onBook={() => { setSelection(null); launchBooking(); }} />}
    {curtain}
  </AppShell>;
}
