import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, SiteFooter, Badge } from "../index";
import { MarketingNav } from "../components/layout/MarketingNav";
import { CATEGORIES, VENUES } from "../lib/bondz-data";
import mascotWhite from "../design-system/assets/icons/BONDZ_LOGO_ICON_DARK.png";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [
    { title: "Who is Mr. Bondz — Solo Event Organizer & The Rule" },
    { name: "description", content: "Sixteen years, 700+ celebrations, one organizer on-site at every single one. Meet Mr. Bondz and the rule that makes every offered date real." },
    { property: "og:title", content: "Who is Mr. Bondz — Solo Event Organizer" },
    { property: "og:description", content: "One organizer, present at every celebration. Here is the rule behind every date we show you." },
    { property: "og:type", content: "profile" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HowItWorksPage,
});

const TABS = ["Mr. Bondz", "The Rule", "Before / After", "Clients & Partners"] as const;
type Tab = (typeof TABS)[number];

const CREDENTIALS = ["16 Years", "700+", "Solo", "On-site"];

const NOTIFIED = [
  { who: "You (Host)", what: "Receipt, formal agreement & invite card" },
  { who: "Smokestack Yard", what: "Locked for Oct 17" },
  { who: "Smoke & Cedar Kitchen", what: "70 plate work order" },
  { who: "Mr. Bondz", what: "Master on-site production brief" },
  { who: "DJ Nova", what: "Set time, venue access & load-in specs" },
  { who: "Petal Theory", what: "Floral install brief & setup window" },
];

const BEFORE = [
  "Client calls, texts, emails — often all three",
  "Mr. Bondz rings the venue to check the date",
  "Then the caterer. Then decor. Then the DJ",
  "One says no — start again from scratch",
  "Deposit chased by message, tracked in memory",
  "Vendors hear about the job days later",
  "No written confirmation anyone can point to",
];

const AFTER = [
  "One guided session, on the client's schedule",
  "Every calendar polled at render time, live",
  "Impossible dates never appear on screen",
  "Price and breakdown updates on every choice",
  "Signed terms + 25% deposit locked in one sitting",
  "Every party notified at the exact same second",
  "Receipt and contract generated instantly on file",
];

function TabMrBondz() {
  return <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
    <div className="space-y-6">
      <figure className="rounded-2xl bg-ink p-7 text-canvas shadow-raised sm:p-10">
        <figcaption className="font-sans text-[0.68rem] font-extrabold uppercase tracking-widest text-primary">16 Years · 700+ Celebrations</figcaption>
        <blockquote className="mt-5 font-serif text-2xl italic leading-tight sm:text-4xl">
          “I've been the person between every party and the panic. Every event I've ever done, I've been there in person. I always will be.”
        </blockquote>
        <p className="mt-6 font-sans text-xs font-bold uppercase tracking-widest text-canvas/70">— Mr. Bondz, Solo Event Organizer</p>
      </figure>
      <div className="flex flex-wrap gap-2">
        {CREDENTIALS.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}
      </div>
      <div className="rounded-2xl bg-night p-7 text-white shadow-raised sm:p-9">
        <h3 className="font-sans text-sm font-black uppercase tracking-widest text-primary">Mr. Bondz Guarantee</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
          Every event includes my physical presence on-site. Once you lock in, all subcontractors are blocked with zero double-booking risk.
        </p>
      </div>
    </div>
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border border-hairline bg-ink p-6 shadow-raised">
      <img src={mascotWhite} alt="Illustrated portrait of Mr. Bondz" loading="lazy" className="mx-auto w-full max-w-[16rem] object-contain" />
      <p className="mt-4 text-center font-serif text-xl italic text-canvas">Mr. Bondz<span className="text-primary">.</span></p>
    </div>
  </div>;
}

function TabRule() {
  return <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
    <article className="rounded-2xl border border-hairline bg-surface-light p-7 shadow-soft sm:p-10">
      <h3 className="font-serif text-4xl italic text-ink sm:text-6xl">The Rule</h3>
      <p className="mt-5 text-base leading-relaxed text-subtle sm:text-lg">
        Every event is staffed by Mr. Bondz in person. Only dates where Mr. Bondz and every chosen partner are simultaneously free can ever be locked in.
      </p>
      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {["Mr. Bondz free", "Venue free", "Every partner free"].map((label, index) => <div key={label} className="rounded-card border border-hairline bg-surface p-4">
          <span className="font-serif text-xl italic text-primary">0{index + 1}</span>
          <p className="mt-1 font-sans text-xs font-black uppercase tracking-tight text-ink">{label}</p>
        </div>)}
      </div>
      <p className="mt-5 font-sans text-xs font-bold uppercase tracking-widest text-primary">All three, or the date never appears</p>
    </article>
    <div className="rounded-2xl border border-hairline bg-surface p-7 sm:p-9">
      <h3 className="font-sans text-sm font-black uppercase tracking-widest text-ink">Who gets notified instantly</h3>
      <ul className="mt-5 space-y-3">
        {NOTIFIED.map((row, index) => <li key={row.who} className="rise flex items-start gap-3 rounded-card border border-hairline bg-surface-light p-3.5" style={{ animationDelay: `${index * 70}ms` }}>
          <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-status text-[0.6rem] font-black text-white">✓</span>
          <span className="min-w-0"><strong className="block font-sans text-xs font-extrabold uppercase tracking-tight text-ink">{row.who}</strong><span className="text-sm text-subtle">{row.what}</span></span>
        </li>)}
      </ul>
    </div>
  </div>;
}

function TabBeforeAfter() {
  return <div className="grid gap-6 lg:grid-cols-2">
    <section aria-labelledby="before-heading" className="rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
      <h3 id="before-heading" className="font-sans text-xs font-black uppercase tracking-widest text-subtle">Before</h3>
      <ol className="mt-5 space-y-3">
        {BEFORE.map((line, index) => <li key={line} className="flex gap-3 text-sm leading-relaxed text-subtle">
          <span className="w-6 shrink-0 font-serif italic text-subtle">{String(index + 1).padStart(2, "0")}</span>{line}
        </li>)}
      </ol>
    </section>
    <section aria-labelledby="after-heading" className="rounded-2xl border border-primary/40 bg-surface-light p-6 shadow-soft sm:p-8">
      <h3 id="after-heading" className="font-sans text-xs font-black uppercase tracking-widest text-primary">After</h3>
      <ol className="mt-5 space-y-3">
        {AFTER.map((line, index) => <li key={line} className="flex gap-3 text-sm font-medium leading-relaxed text-ink">
          <span className="w-6 shrink-0 font-serif italic text-primary">{String(index + 1).padStart(2, "0")}</span>{line}
        </li>)}
      </ol>
    </section>
  </div>;
}

function TabClients() {
  return <div className="space-y-8">
    <div>
      <h3 className="font-sans text-xs font-black uppercase tracking-widest text-ink">Partner categories</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => <Badge key={category.id} variant="neutral">{category.label}</Badge>)}
      </div>
    </div>
    <div>
      <h3 className="font-sans text-xs font-black uppercase tracking-widest text-ink">Venues</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {VENUES.map((venue) => <article key={venue.id} className="rounded-2xl border border-hairline bg-surface-light p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-serif text-2xl italic text-ink">{venue.name}</h4>
            <Badge variant="outline" size="sm">4.9 / 5.0</Badge>
          </div>
          <p className="mt-1 font-sans text-[0.68rem] font-bold uppercase tracking-widest text-subtle">{venue.area}</p>
          <p className="mt-3 text-sm text-subtle">{venue.min}–{venue.max} guests</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-status" aria-hidden="true" />
            <span className="font-sans text-[0.65rem] font-extrabold uppercase tracking-widest text-ink">Verified partner</span>
          </div>
        </article>)}
      </div>
    </div>
  </div>;
}

function HowItWorksPage() {
  const [tab, setTab] = useState<Tab>("Mr. Bondz");

  return <AppShell header={<MarketingNav active="/how-it-works" />} footer={<SiteFooter className="hidden sm:block" />}>
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:px-8 sm:pt-12">
      <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-widest text-primary">Solo Event Organizer</span>
      <h1 className="mt-3 font-serif text-[clamp(2.4rem,7vw,5rem)] italic leading-[0.95] text-ink">Who is Mr. Bondz<span className="text-primary">?</span></h1>
      <div role="tablist" aria-label="Mr. Bondz sections" className="scroll-quiet mt-8 flex gap-6 overflow-x-auto border-b border-hairline">
        {TABS.map((item) => <button
          key={item}
          role="tab"
          type="button"
          aria-selected={tab === item}
          onClick={() => setTab(item)}
          className={`-mb-px shrink-0 border-b-2 pb-3 font-sans text-xs font-extrabold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${tab === item ? "border-primary text-ink" : "border-transparent text-subtle hover:text-ink"}`}
        >{item}</button>)}
      </div>
      <div className="mt-8">
        {tab === "Mr. Bondz" && <TabMrBondz />}
        {tab === "The Rule" && <TabRule />}
        {tab === "Before / After" && <TabBeforeAfter />}
        {tab === "Clients & Partners" && <TabClients />}
      </div>
    </div>
  </AppShell>;
}
