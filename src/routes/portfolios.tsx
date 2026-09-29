import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import wedding from "@/assets/pf-wedding.jpg";
import bbq from "@/assets/pf-bbq.jpg";
import corporate from "@/assets/pf-corporate.jpg";
import birthday from "@/assets/pf-birthday.jpg";
import { cn } from "@/lib/utils";
import { playTapSound, triggerTap } from "@/lib/haptics";

export const Route = createFileRoute("/portfolios")({
  head: () => ({
    meta: [
      { title: "Events Gallery - Bondz Events" },
      { name: "description", content: "Curated masonry bento gallery of verified celebrations booked and organized end-to-end by Bondz Events." },
      { property: "og:title", content: "Events Gallery - Bondz Events" },
      { property: "og:description", content: "Explore verified photography proofs from 700+ celebrations across all event categories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventsGallery,
});

export interface GalleryItem {
  id: string;
  cat: "Weddings" | "Anniversaries" | "Birthdays" | "BBQ Party" | "Family" | "Corporate" | "Hybrid" | "Custom";
  title: string;
  guests: number;
  venue: string;
  img: string;
  booked: string;
  vibe: string;
  outcome: string;
  aspect: "tall" | "wide" | "square";
  rating: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  // 1. Weddings (3 items)
  {
    id: "wed-1",
    cat: "Weddings",
    title: "The Courtyard Vows",
    guests: 90,
    venue: "Smokestack Yard",
    img: wedding,
    booked: "Ember & Oak · Petal Theory · DJ Nova · Hostline",
    vibe: "Terracotta linen, floating candles, 70ft banquet table",
    outcome: "Booked in 11 minutes. 7 partner calendars locked instantly.",
    aspect: "wide",
    rating: "★ 5.0",
  },
  {
    id: "wed-2",
    cat: "Weddings",
    title: "Glasshouse Conservatory Nuptials",
    guests: 160,
    venue: "The Glasshouse",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    booked: "Halal Feast Co. · Linen & Light · Static Bloom",
    vibe: "Tropical botanicals, string quartet into vinyl DJ set",
    outcome: "4 dates worked across all parties. Client locked date 1.",
    aspect: "square",
    rating: "★ 4.9",
  },
  {
    id: "wed-3",
    cat: "Weddings",
    title: "Harbor Terrace Sunset Reception",
    guests: 220,
    venue: "Harbor Hall",
    img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    booked: "Ember & Oak · DJ Nova · Hostline · Petal Theory",
    vibe: "Waterfront breeze, champagne tower, live acoustic horn",
    outcome: "Deposit and vendor contracts generated in one sitting.",
    aspect: "square",
    rating: "★ 5.0",
  },

  // 2. Anniversaries (3 items)
  {
    id: "ann-1",
    cat: "Anniversaries",
    title: "Silver Jubilee Candlelight Dinner",
    guests: 45,
    venue: "Cedar Mews Room",
    img: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=1200&q=80",
    booked: "Smoke & Cedar · Linen & Light Studio · DJ Nova",
    vibe: "Fireplace glow, custom vintage playlist, heirloom wine pairings",
    outcome: "Guest list expanded +6 two weeks prior without a phone call.",
    aspect: "square",
    rating: "★ 5.0",
  },
  {
    id: "ann-2",
    cat: "Anniversaries",
    title: "Four Decades of Grace",
    guests: 80,
    venue: "The Glasshouse",
    img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    booked: "Halal Feast Co. · Petal Theory · Static Bloom Sound",
    vibe: "White orchids, jazz trio, archival family projection gallery",
    outcome: "All 5 vendor invoices reconciled into one PDF receipt.",
    aspect: "square",
    rating: "★ 4.9",
  },
  {
    id: "ann-3",
    cat: "Anniversaries",
    title: "Golden 50th Estate Gala",
    guests: 110,
    venue: "Harbor Hall",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    booked: "Halal Feast Co. · Petal Theory · DJ Nova · Hostline",
    vibe: "Champagne flutes, gilded taper candles, 5-course plated service",
    outcome: "Golden anniversary milestone orchestrated with zero family stress.",
    aspect: "square",
    rating: "★ 5.0",
  },

  // 3. Birthdays (3 items)
  {
    id: "bday-1",
    cat: "Birthdays",
    title: "Thirty, Flirty & Catered",
    guests: 40,
    venue: "Backyard Studio Residence",
    img: birthday,
    booked: "Smoke & Cedar · Petal Theory · Tidy Morning Co.",
    vibe: "Coral balloon arches, living room vinyl lounge, cocktail bar",
    outcome: "Cleaners arrived at 8am. Host relaxed until brunch.",
    aspect: "square",
    rating: "★ 5.0",
  },
  {
    id: "bday-2",
    cat: "Birthdays",
    title: "Grandpa Turns Eighty",
    guests: 65,
    venue: "Cedar Mews Room",
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    booked: "Halal Feast Co. · DJ Nova · Hostline Staffing",
    vibe: "Grand piano, 3 generations, zero speech interruptions",
    outcome: "Full dietary accommodations logged and executed 100%.",
    aspect: "wide",
    rating: "★ 5.0",
  },
  {
    id: "bday-3",
    cat: "Birthdays",
    title: "Rooftop 21st Neon Soirée",
    guests: 95,
    venue: "Loft Nine",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    booked: "Ember & Oak · Static Bloom Sound · RentIt Pro",
    vibe: "Neon typography, craft mocktail bar, midnight snack cart",
    outcome: "24-hour setup-to-strike window executed with zero friction.",
    aspect: "square",
    rating: "★ 5.0",
  },

  // 4. BBQ Party (3 items)
  {
    id: "bbq-1",
    cat: "BBQ Party",
    title: "Smoke & Sun Saturday Feasting",
    guests: 75,
    venue: "Hillcrest Orchard",
    img: bbq,
    booked: "Smoke & Cedar · Canopy Works · RentIt Pro",
    vibe: "Smoked brisket, craft ale bar, festoon canopy lights",
    outcome: "Tent, live wood smoker, and seating setup in 2 hours flat.",
    aspect: "square",
    rating: "★ 4.9",
  },
  {
    id: "bbq-2",
    cat: "BBQ Party",
    title: "Riverside Live-Fire Cookout",
    guests: 110,
    venue: "Smokestack Courtyard",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    booked: "Smoke & Cedar Catering · DJ Nova · Tidy Morning",
    vibe: "Charcoal grills, long timber benches, sundown beats",
    outcome: "No grease, no cleanup for host. Cleaned overnight.",
    aspect: "wide",
    rating: "★ 5.0",
  },
  {
    id: "bbq-3",
    cat: "BBQ Party",
    title: "Smokehouse Heritage Cookout",
    guests: 120,
    venue: "Smokestack Yard",
    img: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80",
    booked: "Smoke & Cedar · Canopy Works · DJ Nova · Hostline",
    vibe: "Oak-smoked ribs, barrel tables, open-air acoustic groove",
    outcome: "Pitmasters arrived at 6am. 120 guests served in under 35 minutes.",
    aspect: "square",
    rating: "★ 5.0",
  },

  // 5. Family Celebrations (3 items)
  {
    id: "fam-1",
    cat: "Family",
    title: "Three-Generation Summer Gathering",
    guests: 55,
    venue: "Smokestack Garden",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    booked: "Halal Feast Co. · Canopy Works · Hostline",
    vibe: "Lawn games, family-style mezze platters, polaroid stations",
    outcome: "Zero stressful prep for the matriarch. She simply showed up.",
    aspect: "wide",
    rating: "★ 5.0",
  },
  {
    id: "fam-2",
    cat: "Family",
    title: "The Golden Lawn Feast",
    guests: 70,
    venue: "The Glasshouse",
    img: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    booked: "Ember & Oak · Petal Theory · RentIt Pro",
    vibe: "Pastoral chic, wildflower centerpieces, live acoustic cello",
    outcome: "Booked 6 months in advance with locked pricing guarantee.",
    aspect: "square",
    rating: "★ 4.9",
  },
  {
    id: "fam-3",
    cat: "Family",
    title: "Highland Family Reunion & Feast",
    guests: 85,
    venue: "Hillcrest Orchard",
    img: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80",
    booked: "Halal Feast Co. · Linen & Light Studio · RentIt Pro",
    vibe: "Orchard festoons, picnic blanket clusters, wood-fired pizzas",
    outcome: "Rain-contingency canopy deployed seamlessly with 3-hour notice.",
    aspect: "square",
    rating: "★ 4.9",
  },

  // 6. Corporate Events (3 items)
  {
    id: "corp-1",
    cat: "Corporate",
    title: "Series B Product Launch",
    guests: 140,
    venue: "Loft Nine",
    img: corporate,
    booked: "Ember & Oak · Static Bloom · Hostline · RentIt Pro",
    vibe: "Industrial concrete, scarlet wash lighting, keynote livestream",
    outcome: "Caterer, AV, and venue synced in a single screen.",
    aspect: "wide",
    rating: "★ 5.0",
  },
  {
    id: "corp-2",
    cat: "Corporate",
    title: "Executive Strategic Retreat & Banquet",
    guests: 85,
    venue: "Harbor Hall",
    img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    booked: "Halal Feast Co. · Linen & Light Studio · Hostline Staffing",
    vibe: "Daylight plenary sessions, seamless audio, plated dinner",
    outcome: "Finance department received itemized invoice instantly.",
    aspect: "square",
    rating: "★ 5.0",
  },
  {
    id: "corp-3",
    cat: "Corporate",
    title: "FinTech Global Summit & Afterparty",
    guests: 200,
    venue: "Smokestack Courtyard",
    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    booked: "Ember & Oak · Static Bloom · Hostline · DJ Nova",
    vibe: "Keynote plenary, dynamic ambient uplighting, interactive food stations",
    outcome: "Synchronized dual-room schedule adhered to within 60 seconds.",
    aspect: "square",
    rating: "★ 5.0",
  },

  // 7. Hybrid Events (3 items)
  {
    id: "hyb-1",
    cat: "Hybrid",
    title: "Global Keynote & Multi-City Dinner",
    guests: 130,
    venue: "Loft Nine",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    booked: "Ember & Oak · Static Bloom Sound · RentIt Pro",
    vibe: "Multi-camera 4K broadcast, live remote audience screens",
    outcome: "Zero latency audio, 3 worldwide offices synced seamlessly.",
    aspect: "wide",
    rating: "★ 5.0",
  },
  {
    id: "hyb-2",
    cat: "Hybrid",
    title: "Live Interactive Tasting Studio",
    guests: 60,
    venue: "Cedar Mews Room",
    img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    booked: "Smoke & Cedar · DJ Nova · Hostline Staffing",
    vibe: "Sommelier stream, synchronized gift box tasting on-screen",
    outcome: "Physical deliveries and live venue setup executed concurrently.",
    aspect: "square",
    rating: "★ 4.9",
  },
  {
    id: "hyb-3",
    cat: "Hybrid",
    title: "International Design Awards Broadcast",
    guests: 150,
    venue: "The Glasshouse",
    img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    booked: "Halal Feast Co. · Static Bloom Sound · Hostline",
    vibe: "Glasshouse ceiling projections, multi-angle livestream, ambient harp",
    outcome: "Over 4,000 remote viewers with low-latency voting feed.",
    aspect: "square",
    rating: "★ 5.0",
  },

  // 8. Custom Events (3 items)
  {
    id: "cust-1",
    cat: "Custom",
    title: "Midnight Gastronomy Pop-Up",
    guests: 50,
    venue: "Smokestack Courtyard",
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
    booked: "Ember & Oak Kitchen · Petal Theory · DJ Nova",
    vibe: "Secret password entry, 8-course surprise pairing, ambient smoke",
    outcome: "Concept to execution in 14 days without a single hitch.",
    aspect: "square",
    rating: "★ 5.0",
  },
  {
    id: "cust-2",
    cat: "Custom",
    title: "Art Gallery Vernissage & Gala",
    guests: 120,
    venue: "Loft Nine",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    booked: "Halal Feast Co. · Linen & Light Studio · Static Bloom",
    vibe: "Architectural spot lighting, natural wine bar, ambient soundscape",
    outcome: "Curator had zero logistics stress; attended purely as host.",
    aspect: "wide",
    rating: "★ 5.0",
  },
  {
    id: "cust-3",
    cat: "Custom",
    title: "Secret Cellar Speakeasy Immersion",
    guests: 65,
    venue: "Cedar Mews Room",
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    booked: "Smoke & Cedar · DJ Nova · Hostline Staffing · RentIt Pro",
    vibe: "Hidden bookshelf doorway, prohibition mixology, live brass band",
    outcome: "Custom sound baffles installed and certified zero-noise leak.",
    aspect: "square",
    rating: "★ 5.0",
  },
];

const CATS = [
  "All",
  "Weddings",
  "Anniversaries",
  "Birthdays",
  "BBQ Party",
  "Family",
  "Corporate",
  "Hybrid",
  "Custom",
] as const;

function EventsGallery() {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => selectedCat === "All" || item.cat === selectedCat
  );

  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-4 md:px-8">
      {/* Header Bar */}
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <p className="eyebrow text-primary font-bold tracking-widest uppercase">
            Proof of Execution · 100% Verified By Clients & Venues
          </p>
          <h1 className="display mt-1 text-4xl sm:text-5xl md:text-6xl tracking-tight">
            Events Gallery
          </h1>
        </div>

        {/* Category Tabs (Matches all 8 booking engine event types) */}
        <div role="tablist" className="scroll-quiet flex gap-1.5 overflow-x-auto max-w-full">
          {CATS.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={selectedCat === c}
              onClick={() => {
                playTapSound();
                setSelectedCat(c);
              }}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 font-display text-xs font-black uppercase tracking-wider transition [font-variation-settings:'wdth'_85]",
                selectedCat === c
                  ? "bg-ink text-canvas shadow-sm shadow-black/30"
                  : "hover:bg-muted text-ink/75"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Masonry Grid (100% Filled Responsive: Zero Blank Sides on Any Device) */}
      <div className="rise scroll-quiet min-h-0 flex-1 overflow-y-auto pt-5 pb-8 px-1.5">
        <div
          className={cn(
            "grid gap-4 sm:gap-5 auto-rows-[270px] sm:auto-rows-[290px] grid-flow-dense",
            selectedCat !== "All"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {filteredItems.map((item, idx) => {
            const isSingleCategory = selectedCat !== "All";
            // In "All" view (24 items), wide items (col-span-2) are paired with 1-col items to make every 3-col row exact
            const isLgWide = !isSingleCategory && [0, 6, 10, 16, 20, 23].includes(idx);
            // In single category (3 items), first item spans 2 cols on tablet so row 1 has 1 wide card and row 2 has 2 cards (0 blank slots)
            const isMdWide = isSingleCategory && idx === 0;

            return (
              <figure
                key={item.id}
                onClick={() => {
                  triggerTap();
                  playTapSound();
                  setActiveItem(item);
                }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-black/15 dark:border-white/[0.08] bg-surface-dark cursor-pointer transition-all duration-300 flex flex-col justify-end",
                  "[box-shadow:0_10px_28px_rgba(0,0,0,0.65)] hover:[box-shadow:0_20px_48px_rgba(0,0,0,0.9)] hover:border-primary/50 hover:ring-2 hover:ring-primary/20",
                  isLgWide
                    ? "col-span-1 md:col-span-1 lg:col-span-2 row-span-1"
                    : isMdWide
                    ? "col-span-1 md:col-span-2 lg:col-span-1 row-span-1"
                    : "col-span-1 row-span-1"
                )}
              >
                {/* Background Photography */}
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Ambient Dark Gradient for Contrast (always deep black in both modes) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Top Overlay Badges */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 font-display text-[0.68rem] font-bold tracking-wider text-white uppercase backdrop-blur-md border border-white/10 [font-variation-settings:'wdth'_85]">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {item.cat} · {item.guests} Guests
                  </span>

                  <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 font-display text-[0.65rem] font-bold text-white uppercase backdrop-blur-md">
                    {item.rating}
                  </span>
                </div>

                {/* Bottom Content Card */}
                <div className="relative z-10 p-5 sm:p-6 text-white transition-transform duration-300 group-hover:-translate-y-1">
                  <p className="font-serif-i italic text-white/90 text-xs sm:text-sm drop-shadow-xs">
                    {item.venue}
                  </p>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white mt-1 leading-snug [font-variation-settings:'wdth'_85]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/80 font-medium line-clamp-1">
                    {item.vibe}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2 text-[0.72rem] text-white/70">
                    <span className="truncate pr-2">{item.booked}</span>
                    <span className="font-bold text-primary shrink-0 group-hover:translate-x-1 transition-transform">
                      Inspect →
                    </span>
                  </div>
                </div>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Expanded Detail Dialog */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/20 dark:border-white/[0.08] bg-surface-light text-ink [box-shadow:0_25px_60px_rgba(0,0,0,0.95)] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72 sm:h-80 overflow-hidden bg-black">
              <img
                src={activeItem.img}
                alt={activeItem.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white hover:text-ink transition-colors font-bold text-lg cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="font-serif-i italic text-white/90 text-sm drop-shadow-xs">
                  {activeItem.cat} · {activeItem.guests} Guests · {activeItem.venue}
                </span>
                <h2 className="display text-3xl sm:text-4xl text-white font-black uppercase mt-1">
                  {activeItem.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl border hairline bg-canvas p-4">
                  <p className="eyebrow text-primary font-bold">Vibe & Styling</p>
                  <p className="mt-1 font-medium text-ink/85">{activeItem.vibe}</p>
                </div>
                <div className="rounded-2xl border hairline bg-canvas p-4">
                  <p className="eyebrow text-primary font-bold">Booked Partners</p>
                  <p className="mt-1 font-medium text-ink/85">{activeItem.booked}</p>
                </div>
              </div>

              <div className="rounded-2xl border hairline bg-canvas p-4 text-ink flex items-center justify-between shadow-xs">
                <div>
                  <p className="eyebrow text-primary font-bold">Verified Outcome</p>
                  <p className="text-sm font-semibold text-ink mt-0.5">{activeItem.outcome}</p>
                </div>
                <span className="font-display font-black text-primary text-xl">
                  {activeItem.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
