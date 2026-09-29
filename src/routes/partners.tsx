import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticker } from "@/components/site/Brand";
import { PARTNER_GROUPS, PARTNERS, VENUES } from "@/lib/bondz-data";
import { cn } from "@/lib/utils";
import { playTapSound, triggerTap } from "@/lib/haptics";
import { triggerBookingTransition } from "@/lib/booking-transition";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners - Bondz Events" },
      {
        name: "description",
        content:
          "Explore sample venues, caterers, decorators, DJs, equipment, staffing and cleaning partners in the Bondz Events planning preview.",
      },
      { property: "og:title", content: "Partners - Bondz Events" },
      { property: "og:description", content: "Explore the venues and service partners in the Bondz Events planning preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Partners,
});

interface PartnerMeta {
  name: string;
  category: string;
  group: string;
  rating: string;
  eventsCount: string;
  image: string;
  headline: string;
  details: string;
  pricing: string;
  capacity?: string;
  tags: string[];
}

const PARTNER_METAS: Record<string, PartnerMeta> = {
  "Smokestack Yard": {
    name: "Smokestack Yard",
    category: "Venue",
    group: "Venues",
    rating: "4.96",
    eventsCount: "128",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    headline: "Riverside Arts District courtyard with open fire pits.",
    details:
      "A raw industrial brick haven with festoon lighting, loading bay access, and open-air fire pits. Ideal for lively BBQ feasts and dusk-to-dawn celebrations.",
    pricing: "$2,400 flat venue hire",
    capacity: "20-120 guests",
    tags: ["Open-air courtyard", "Fire pits", "String lights", "Loading bay"],
  },
  "The Glasshouse": {
    name: "The Glasshouse",
    category: "Venue",
    group: "Venues",
    rating: "4.98",
    eventsCount: "184",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    headline: "Botanic Quarter architectural conservatory dome.",
    details:
      "Floor-to-ceiling iron-framed glass conservatory surrounded by botanical flora. Includes dedicated private bridal suite and integrated spatial acoustics.",
    pricing: "$4,200 flat venue hire",
    capacity: "40-220 guests",
    tags: ["Garden conservatory", "Bridal suite", "In-house AV", "Step-free"],
  },
  "Loft Nine": {
    name: "Loft Nine",
    category: "Venue",
    group: "Venues",
    rating: "4.94",
    eventsCount: "152",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
    headline: "Old Mill Row broadcast-ready studio warehouse.",
    details:
      "Polished concrete, exposed timber beams, stage lighting truss, green room, freight elevator, and custom zinc cocktail bar.",
    pricing: "$3,600 flat venue hire",
    capacity: "30-300 guests",
    tags: ["Stream-ready stage", "Green room", "Freight lift", "Custom bar"],
  },
  "Harbor Hall": {
    name: "Harbor Hall",
    category: "Venue",
    group: "Venues",
    rating: "4.99",
    eventsCount: "210",
    image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
    headline: "Waterfront grand ballroom with sweeping ocean terrace.",
    details:
      "Panoramic harbor views, private arrival jetty, valet parking, and marble architectural details. Built for premier gala dinners and high-guest count weddings.",
    pricing: "$6,800 flat venue hire",
    capacity: "150-400 guests",
    tags: ["Grand ballroom", "Harbor terrace", "Valet arrivals", "Waterfront"],
  },
  "Cedar Mews Room": {
    name: "Cedar Mews Room",
    category: "Venue",
    group: "Venues",
    rating: "4.92",
    eventsCount: "95",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    headline: "Hillcrest intimate private dining room with wood fireplace.",
    details:
      "Secluded cobblestone mews hideaway featuring a working limestone fireplace, vintage Steinway parlor piano, and private sommelier cellar.",
    pricing: "$900 flat venue hire",
    capacity: "10-45 guests",
    tags: ["Private dining", "Fireplace", "Parlor piano", "Intimate lounge"],
  },
  "Halal Feast Co.": {
    name: "Halal Feast Co.",
    category: "Catering",
    group: "Catering",
    rating: "4.97",
    eventsCount: "230",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    headline: "Slow-roasted heritage lamb, saffron rice & fresh za’atar.",
    details:
      "100% certified halal artisanal culinary experiences. Family-style sharing banquets crafted with heirloom spices and hand-pulled breads.",
    pricing: "$38 / guest",
    capacity: "20-250 guests",
    tags: ["Certified Halal", "Family-style banquets", "Live woodfire", "Dietary custom"],
  },
  "Smoke & Cedar Catering": {
    name: "Smoke & Cedar Catering",
    category: "Catering",
    group: "Catering",
    rating: "4.95",
    eventsCount: "175",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    headline: "Slow-smoked oak brisket and applewood pit-fire feasts.",
    details:
      "Authentic pitmaster barbecue with charred sweet corn, house-brined pickles, skillet cornbread, and smoked caramelized brisket cuts.",
    pricing: "$32 / guest",
    capacity: "15-150 guests",
    tags: ["Oak smoked", "Outdoor pitmaster", "Craft sides", "Informal luxury"],
  },
  "Ember & Oak Kitchen": {
    name: "Ember & Oak Kitchen",
    category: "Catering",
    group: "Catering",
    rating: "4.98",
    eventsCount: "190",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    headline: "Five-course seasonal plated tasting menus & natural wines.",
    details:
      "Elevated contemporary gastronomy emphasizing hyper-local produce, delicate sauces, and precise culinary plate compositions.",
    pricing: "$46 / guest",
    capacity: "40-300 guests",
    tags: ["Plated 5-course", "Farm-to-table", "Wine pairing", "Sommelier service"],
  },
  "Petal Theory": {
    name: "Petal Theory",
    category: "Decor",
    group: "Decor",
    rating: "4.99",
    eventsCount: "220",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
    headline: "Architectural botanical installations & floating floral clouds.",
    details:
      "Sculptural garden roses, untamed branches, wild seasonal foliage, and bespoke ceramic tablescapes installed and struck seamlessly.",
    pricing: "$1,200 flat design package",
    capacity: "10-300 guests",
    tags: ["Suspended florals", "Garden roses", "Zero plastic foam", "Complete strike"],
  },
  "Linen & Light Studio": {
    name: "Linen & Light Studio",
    category: "Decor",
    group: "Decor",
    rating: "4.93",
    eventsCount: "140",
    image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80",
    headline: "Belgian stone-washed linen runners and beeswax taper candles.",
    details:
      "Understated tactile minimalism: natural earthy textures, warm ambient candlelight, and custom stationery integration.",
    pricing: "$950 flat design package",
    capacity: "10-180 guests",
    tags: ["Natural linen", "Beeswax candles", "Minimalist tableware", "Warm palette"],
  },
  "DJ Nova": {
    name: "DJ Nova",
    category: "DJ / Music",
    group: "DJ / Music",
    rating: "4.96",
    eventsCount: "280",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    headline: "Vinyl-centric groove curator with flawless crowd-reading.",
    details:
      "Seamless transitions from warm sunset funk and soul into high-energy midnight house. Includes wireless speech mic and pristine monitors.",
    pricing: "$850 flat session",
    capacity: "10-300 guests",
    tags: ["Vinyl & digital", "Zero cheese", "Wireless mic included", "Room-reading"],
  },
  "Static Bloom Sound": {
    name: "Static Bloom Sound",
    category: "DJ / Music",
    group: "DJ / Music",
    rating: "4.97",
    eventsCount: "160",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    headline: "Live electronic ensemble and high-definition acoustic audio.",
    details:
      "Bespoke sound engineers delivering punchy warm sub-bass, club-grade audio clarity, and hybrid live percussion integration.",
    pricing: "$1,100 flat session",
    capacity: "30-300 guests",
    tags: ["Club-grade PA", "Live hybrid elements", "Acoustic calibration", "Sound engineer"],
  },
  "RentIt Pro": {
    name: "RentIt Pro",
    category: "Equipment",
    group: "Equipment",
    rating: "4.92",
    eventsCount: "310",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    headline: "Bentwood chairs, oak harvest trestles & gas patio heaters.",
    details:
      "Reliable delivery, setup, and strike for all core event infrastructure. Spotless furniture delivered in custom protective flight cases.",
    pricing: "$9 / guest",
    capacity: "10-300 guests",
    tags: ["Bentwood seating", "Solid oak trestles", "Patio heaters", "Same-night strike"],
  },
  "Canopy Works": {
    name: "Canopy Works",
    category: "Equipment",
    group: "Equipment",
    rating: "4.95",
    eventsCount: "195",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    headline: "Clear-span sailcloth pavilions and architectural marquees.",
    details:
      "Weather-rated luxury sailcloth marquees with wooden center poles, panoramic transparent side-walls, and integrated guttering systems.",
    pricing: "$11 / guest",
    capacity: "10-200 guests",
    tags: ["Sailcloth marquees", "Clear-span weather seal", "Rigging safety certified", "Turnkey setup"],
  },
  "Hostline Staffing": {
    name: "Hostline Staffing",
    category: "Staffing",
    group: "Staffing",
    rating: "4.97",
    eventsCount: "250",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    headline: "Impeccably tailored floor captains and silver-service team.",
    details:
      "Professional hospitality crew in crisp monochrome uniform. Trained in synchronized plating, discreet clearing, and warm hospitality.",
    pricing: "$14 / guest",
    capacity: "20-300 guests",
    tags: ["Floor captain lead", "Black-tie uniform", "RSA certified", "Zero sitting down"],
  },
  "Tidy Morning Co.": {
    name: "Tidy Morning Co.",
    category: "Cleaning",
    group: "Cleaning",
    rating: "4.99",
    eventsCount: "340",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    headline: "Zero-trace morning sweep before the venue manager arrives.",
    details:
      "Complete post-event venue restoration: bottle disposal, commercial floor scrubbing, trash removal, and verified venue sign-off checklist.",
    pricing: "$420 flat sweep",
    capacity: "10-300 guests",
    tags: ["Eco-detergents", "Full waste removal", "Morning handover ready", "Venue bond guarantee"],
  },
  "Afterglow Cleaners": {
    name: "Afterglow Cleaners",
    category: "Cleaning",
    group: "Cleaning",
    rating: "4.94",
    eventsCount: "180",
    image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=800&q=80",
    headline: "Discreet midnight post-party restoration service.",
    details:
      "Arrives immediately upon event conclusion for discreet midnight strikes so clients wake up to spotless living spaces or venues.",
    pricing: "$360 flat sweep",
    capacity: "10-150 guests",
    tags: ["Discreet midnight strike", "Home & venue ready", "Recycling sorted", "Bond protection"],
  },
};

function Partners() {
  const [hoveredPartner, setHoveredPartner] = useState<PartnerMeta | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<PartnerMeta | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handlePartnerClick = (name: string) => {
    triggerTap();
    const meta = PARTNER_METAS[name];
    if (meta) {
      setSelectedPartner(meta);
    }
  };

  const handleBookWithPartner = () => {
    triggerTap();
    setSelectedPartner(null);
    triggerBookingTransition(() => navigate({ to: "/book", search: { intro: 1 } }));
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPartner(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex h-full flex-col px-4 pb-4 pt-4 md:px-8 relative">
      {/* Header Bar */}
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <p className="eyebrow text-primary font-bold tracking-widest uppercase">
            Nº 04 - Partner Collective · Planning Preview
          </p>
          <h1 className="display mt-1 text-4xl sm:text-5xl md:text-6xl tracking-tight">
            The people behind the curtain.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border hairline bg-surface-light px-3.5 py-1.5 text-xs font-bold text-ink/75">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Hover or tap to inspect specs
          </span>
          <p className="max-w-xs text-xs text-ink/65 leading-relaxed">
            Sample availability is calculated together for Mr. Bondz, the venue and each selected partner. No real calendars are connected yet.
          </p>
        </div>
      </div>

      {/* Marquee Ticker Rows */}
      <div className="scroll-quiet flex min-h-0 flex-1 flex-col justify-between overflow-y-auto py-2">
        {PARTNER_GROUPS.map((g, i) => (
          <div
            key={g.g}
            className="grid grid-cols-[6.5rem_1fr] items-center gap-3 border-b hairline py-2.5 md:grid-cols-[10.5rem_1fr] group/row transition-colors hover:bg-surface-light/40"
          >
            {/* Category Label */}
            <p className="flex items-baseline gap-2 pl-1">
              <span className="text-[0.72rem] font-bold text-primary font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-extrabold uppercase tracking-tight text-ink font-display [font-variation-settings:'wdth'_85]">
                {g.g}
              </span>
              <span className="text-[0.70rem] font-mono text-ink/40">
                ({g.names.length})
              </span>
            </p>

            {/* Infinite Ticker with interactive hover/click items */}
            <Ticker dir={i % 2 ? "right" : "left"}>
              {[...g.names, ...g.names].map((n, k) => {
                const meta = PARTNER_METAS[n];
                const isHovered = hoveredPartner?.name === n;
                return (
                  <button
                    key={n + k}
                    type="button"
                    onClick={() => handlePartnerClick(n)}
                    onMouseEnter={(e) => {
                      playTapSound();
                      if (meta) {
                        setHoveredPartner(meta);
                        setMousePos({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    onMouseMove={(e) => {
                      setMousePos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setHoveredPartner(null)}
                    className={cn(
                      "display group/item inline-flex items-center whitespace-nowrap px-3 text-[clamp(1.4rem,3.2vh,2.3rem)] transition-all duration-200 cursor-pointer text-left outline-none",
                      isHovered
                        ? "text-primary scale-[1.03]"
                        : "text-ink/80 hover:text-primary",
                    )}
                  >
                    <span>{n}</span>
                    <span className="ml-3 text-xs font-mono font-bold text-primary/60 group-hover/item:text-primary">
                      ★ {meta?.rating || "4.9"}
                    </span>
                    <span className="ml-4 text-primary font-normal select-none">/</span>
                  </button>
                );
              })}
            </Ticker>
          </div>
        ))}
      </div>

      {/* Floating Preview Card on Hover (Desktop) */}
      <AnimatePresence>
        {hoveredPartner && !selectedPartner && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: Math.min(Math.max(mousePos.x - 160, 20), window.innerWidth - 340),
              top: mousePos.y > window.innerHeight - 280 ? mousePos.y - 250 : mousePos.y + 24,
              pointerEvents: "none",
              zIndex: 60,
            }}
            className="w-80 overflow-hidden rounded-2xl border hairline bg-surface-dark text-white shadow-2xl backdrop-blur-xl"
          >
            {/* Image Thumbnail */}
            <div className="relative h-28 w-full overflow-hidden bg-muted">
              <img
                src={hoveredPartner.image}
                alt={hoveredPartner.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-black/20" />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {hoveredPartner.category}
              </div>
              <div className="absolute top-2.5 right-2.5 rounded-full bg-primary/90 px-2 py-0.5 text-[0.68rem] font-black text-white">
                ★ {hoveredPartner.rating}
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-3.5">
              <h4 className="font-display text-base font-black tracking-tight text-white [font-variation-settings:'wdth'_85]">
                {hoveredPartner.name}
              </h4>
              <p className="mt-1 text-xs text-white/80 leading-snug">
                {hoveredPartner.headline}
              </p>

              <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2 text-[0.70rem] font-mono text-white/60">
                <span>{hoveredPartner.pricing}</span>
                <span className="text-primary font-bold">Click to inspect →</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Inspector Modal on Click / Tap */}
      <AnimatePresence>
        {selectedPartner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPartner(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border hairline bg-surface-dark text-white shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="absolute top-4 right-4 z-20 flex size-9 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-md transition hover:bg-black hover:text-white"
              >
                ✕
              </button>

              {/* Banner Image */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-900">
                <img
                  src={selectedPartner.image}
                  alt={selectedPartner.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                      <span className="size-2 rounded-full bg-primary animate-pulse" />
                      {selectedPartner.group}
                    </span>
                    <h3 className="display mt-2 text-2xl sm:text-3xl font-black text-white">
                      {selectedPartner.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-primary">
                      ★ {selectedPartner.rating}
                    </span>
                    <span className="text-[0.70rem] font-mono text-white/60">
                      {selectedPartner.eventsCount} celebrations
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-sm sm:text-base leading-relaxed text-white/85">
                  {selectedPartner.details}
                </p>

                {/* Key Spec Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedPartner.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-medium text-white/80"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>

                {/* Pricing & Sync Status Grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs font-mono">
                  <div className="rounded-xl bg-white/5 p-3">
                    <span className="block text-white/50 uppercase tracking-widest text-[0.65rem]">
                      Base Investment
                    </span>
                    <span className="mt-1 block font-bold text-white text-sm">
                      {selectedPartner.pricing}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <span className="block text-white/50 uppercase tracking-widest text-[0.65rem]">
                      Capacity Range
                    </span>
                    <span className="mt-1 block font-bold text-white text-sm">
                      {selectedPartner.capacity || "All sizes"}
                    </span>
                  </div>
                </div>

                {/* Live Sync Confirmation */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-2.5 text-xs text-emerald-300">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                    Sample calendar match
                  </span>
                  <span className="font-mono text-[0.70rem] opacity-80">Preview only</span>
                </div>

                {/* Action CTA Button */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPartner(null)}
                    className="text-xs font-semibold text-white/60 hover:text-white"
                  >
                    Back to Collective
                  </button>
                  <button
                    type="button"
                    onClick={handleBookWithPartner}
                    className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-sm font-black uppercase tracking-wider text-primary-foreground shadow-xl hover:brightness-110 active:scale-95 transition-all [font-variation-settings:'wdth'_85]"
                  >
                    <span>Book with {selectedPartner.name.split(" ")[0]}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

