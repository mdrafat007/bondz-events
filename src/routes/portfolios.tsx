import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "../index";
import { MarketingNav } from "../components/layout/MarketingNav";
import { SiteFooter } from "../components/layout/SiteFooter";
import pfWedding from "../assets/photography/pf-wedding.jpg";
import pfBbq from "../assets/photography/pf-bbq.jpg";
import pfCorporate from "../assets/photography/pf-corporate.jpg";
import pfBirthday from "../assets/photography/pf-birthday.jpg";

export const Route = createFileRoute("/portfolios")({
  head: () => ({ meta: [
    { title: "Events Gallery — Bondz Events" },
    { name: "description", content: "Weddings, anniversaries, birthdays, BBQs, family tables, corporate launches and hybrid rooms — celebrations Mr. Bondz ran in person." },
    { property: "og:title", content: "Events Gallery — Bondz Events" },
    { property: "og:description", content: "A gallery of celebrations Mr. Bondz ran in person, with guest counts, venues and outcomes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PortfoliosPage,
});

const FILTERS = ["All", "Weddings", "Anniversaries", "Birthdays", "BBQ Party", "Family", "Corporate", "Hybrid", "Custom"] as const;
type Filter = (typeof FILTERS)[number];

type Aspect = "tall" | "wide" | "square";
interface GalleryItem {
  id: string;
  aspect: Aspect;
  cat: Exclude<Filter, "All">;
  title: string;
  guests: number;
  venue: string;
  booked: string;
  vibe: string;
  outcome: string;
  rating: string;
  image: string;
  alt: string;
}

const ITEMS: GalleryItem[] = [
  { id: "g1", aspect: "tall", cat: "Weddings", title: "The Terrace Vows", guests: 120, venue: "The Glasshouse", booked: "Booked in 19 minutes", vibe: "Golden hour", outcome: "Every partner confirmed in one sitting", rating: "5.0", image: pfWedding, alt: "Long banquet table at a golden-hour wedding reception" },
  { id: "g2", aspect: "wide", cat: "BBQ Party", title: "Smokestack Sunday", guests: 60, venue: "Smokestack Yard", booked: "Booked in 11 minutes", vibe: "Smoke and sun", outcome: "Grill crew and cleaners locked same day", rating: "4.9", image: pfBbq, alt: "Backyard barbecue with a smoking grill and guests at a long table" },
  { id: "g3", aspect: "square", cat: "Corporate", title: "Platform Launch", guests: 140, venue: "Loft Nine", booked: "Booked in 24 minutes", vibe: "Clean and loud", outcome: "AV, catering and venue confirmed together", rating: "4.9", image: pfCorporate, alt: "Audience seated facing a lit stage at a corporate launch" },
  { id: "g4", aspect: "tall", cat: "Birthdays", title: "Forty Candles", guests: 40, venue: "Cedar Mews Room", booked: "Booked in 8 minutes", vibe: "Candlelit", outcome: "DJ texted the host before checkout closed", rating: "5.0", image: pfBirthday, alt: "Birthday cake with lit candles surrounded by friends" },
  { id: "g5", aspect: "wide", cat: "Anniversaries", title: "Twenty-Five Years", guests: 24, venue: "Cedar Mews Room", booked: "Booked in 9 minutes", vibe: "Quiet and warm", outcome: "Florals and piano booked in the same pass", rating: "5.0", image: pfWedding, alt: "Intimate anniversary dinner table set with florals" },
  { id: "g6", aspect: "square", cat: "Family", title: "Three Generations", guests: 35, venue: "At home", booked: "Booked in 12 minutes", vibe: "Long table", outcome: "Cleaners arrived at 8am unprompted", rating: "4.8", image: pfBbq, alt: "Family gathered around a long outdoor table" },
  { id: "g7", aspect: "tall", cat: "Hybrid", title: "Lagos & Loft Nine", guests: 110, venue: "Loft Nine", booked: "Booked in 27 minutes", vibe: "Two rooms, one night", outcome: "Remote guests stayed the whole evening", rating: "4.9", image: pfCorporate, alt: "Hybrid event stage with cameras and a seated audience" },
  { id: "g8", aspect: "square", cat: "Custom", title: "The Rooftop Brief", guests: 30, venue: "Smokestack Yard", booked: "Booked in 14 minutes", vibe: "Made to order", outcome: "Bespoke run-of-show built on the spot", rating: "4.9", image: pfBirthday, alt: "Candlelit rooftop celebration with a small group" },
  { id: "g9", aspect: "wide", cat: "Weddings", title: "Harbor Hall Evening", guests: 220, venue: "Harbor Hall", booked: "Booked in 31 minutes", vibe: "Black tie", outcome: "Nine partners, one confirmation second", rating: "5.0", image: pfWedding, alt: "Grand ballroom wedding reception with guests dining" },
];

const ASPECT_CLASS: Record<Aspect, string> = {
  tall: "row-span-2 aspect-[3/4] sm:aspect-auto sm:h-[30rem]",
  wide: "aspect-[4/3] sm:h-[14.5rem]",
  square: "aspect-square sm:h-[14.5rem]",
};

function PortfoliosPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = ITEMS.filter((item) => filter === "All" || item.cat === filter);

  return <AppShell header={<MarketingNav active="/portfolios" />} footer={<SiteFooter />}>
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 md:px-8">
      <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-widest text-primary">700+ celebrations</span>
      <h1 className="mt-3 max-w-3xl font-sans text-[clamp(2.1rem,5.4vw,4rem)] font-black uppercase leading-[0.95] tracking-tight text-ink [font-variation-settings:'wdth'_85]">
        Events gallery<span className="font-serif font-normal italic tracking-normal text-primary">, in person</span>
      </h1>
      <div role="tablist" aria-label="Filter celebrations" className="scroll-quiet sticky top-0 z-10 -mx-4 mt-8 flex gap-2 overflow-x-auto bg-canvas/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        {FILTERS.map((item) => <button
          key={item}
          type="button"
          role="tab"
          aria-selected={filter === item}
          onClick={() => setFilter(item)}
          className={`shrink-0 rounded-full border px-4 py-2 font-sans text-[0.68rem] font-extrabold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${filter === item ? "border-primary bg-primary text-surface-light" : "border-hairline bg-surface-light text-subtle hover:text-ink"}`}
        >{item}</button>)}
      </div>
      <div className="mt-6 grid auto-rows-min grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((item) => <article key={item.id} className={`group relative isolate overflow-hidden rounded-2xl border border-hairline bg-surface shadow-soft ${ASPECT_CLASS[item.aspect]}`}>
          <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/25 to-transparent" aria-hidden="true" />
          <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-night/70 px-2.5 py-1 font-sans text-[0.6rem] font-black uppercase tracking-widest text-white backdrop-blur">{item.cat}</span>
          <span className="absolute right-3 top-3 rounded-full border border-primary/40 bg-primary/25 px-2 py-1 font-sans text-[0.6rem] font-black uppercase tracking-widest text-white backdrop-blur">★ {item.rating}</span>
          <div className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-4">
            <h2 className="font-serif text-xl italic leading-tight sm:text-2xl">{item.title}</h2>
            <p className="mt-1 font-sans text-[0.6rem] font-extrabold uppercase tracking-widest text-white/80">{item.guests} guests · {item.venue}</p>
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="pt-2 text-xs leading-relaxed text-white/90">{item.outcome}</p>
                <p className="mt-1.5 font-sans text-[0.6rem] font-extrabold uppercase tracking-widest text-primary">{item.vibe} · {item.booked}</p>
              </div>
            </div>
          </div>
        </article>)}
      </div>
      {visible.length === 0 && <p className="mt-10 text-sm text-subtle">No celebrations in this category yet.</p>}
    </div>
  </AppShell>;
}
