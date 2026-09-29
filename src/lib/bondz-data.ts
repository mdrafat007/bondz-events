export type EventTypeId = "wedding" | "anniversary" | "birthday" | "bbq" | "family" | "corporate" | "hybrid" | "custom";
export type CategoryId = "catering" | "decor" | "dj" | "equipment" | "staff" | "cleaning" | "photo" | "lighting" | "hybrid";
export type Slot = "Morning" | "Afternoon" | "Evening";

export interface Partner {
  id: string;
  name: string;
  category: CategoryId;
  min: number;
  max: number;
  events: EventTypeId[] | "all";
  flat?: number;
  perGuest?: number;
  seed: number;
  busyRate: number;
}

export interface Venue {
  id: string;
  name: string;
  area: string;
  min: number;
  max: number;
  price: number;
  minSpend: number;
  events: EventTypeId[] | "all";
  amenities: string[];
  excludes: string[];
  seed: number;
  busyRate: number;
}

export const HORIZON = 75;
export const SLOTS: readonly Slot[] = ["Morning", "Afternoon", "Evening"] as const;
export const BONDZ_FEE = { home: 450, venue: 650 };

export const EVENT_TYPES = [
  { id: "wedding", no: "01", title: "Wedding", line: "Vows, a long table and one very good first dance" },
  { id: "anniversary", no: "02", title: "Anniversary", line: "Another lap around the sun - together" },
  { id: "birthday", no: "03", title: "Birthday", line: "Cake, candles, chaos (the good kind)" },
  { id: "bbq", no: "04", title: "BBQ Party", line: "Smoke, sun and a long table" },
  { id: "family", no: "05", title: "Family Get-together", line: "Three generations, one playlist argument" },
  { id: "corporate", no: "06", title: "Corporate Events", line: "Launches, offsites, and speeches people finish" },
  { id: "hybrid", no: "07", title: "Hybrid Events", line: "In the room and on every screen" },
  { id: "custom", no: "08", title: "Custom Events", line: "You describe it. We make it exist" },
] as const;

export const CATEGORIES: { id: CategoryId; label: string; desc: string }[] = [
  { id: "catering", label: "Catering", desc: "Plated, family-style or live grill - food people talk about." },
  { id: "decor", label: "Decorations", desc: "Florals, draping, tablescapes and a photo wall that earns its place." },
  { id: "dj", label: "DJ / Music", desc: "A set that reads the room, plus mic for speeches." },
  { id: "photo", label: "Photo & Video", desc: "Candids, portraits, and same-week 4K highlight reel." },
  { id: "lighting", label: "Lights & Audio", desc: "Warm washes, clean audio PA, zero feedback squeal." },
  { id: "hybrid", label: "Live Streaming", desc: "Multi-cam live broadcast with remote guest interactivity." },
  { id: "equipment", label: "Equipment Rental", desc: "Tables, chairs, tents, heaters - delivered and struck." },
  { id: "staff", label: "Event Staff", desc: "Servers, hosts and a floor captain who never sits down." },
  { id: "cleaning", label: "Cleaning Service", desc: "The morning after, handled before you wake up." },
];

export const PARTNERS: Partner[] = [
  { id: "halal", name: "Halal Feast Co.", category: "catering", min: 20, max: 250, events: "all", perGuest: 38, seed: 11, busyRate: 0.22 },
  { id: "smoke", name: "Smoke & Cedar Catering", category: "catering", min: 15, max: 150, events: ["bbq", "birthday", "family", "custom", "anniversary", "wedding"], perGuest: 32, seed: 12, busyRate: 0.26 },
  { id: "ember", name: "Ember & Oak Kitchen", category: "catering", min: 40, max: 300, events: ["wedding", "corporate", "hybrid", "anniversary"], perGuest: 46, seed: 13, busyRate: 0.3 },
  { id: "petal", name: "Petal Theory", category: "decor", min: 10, max: 300, events: "all", flat: 1200, seed: 21, busyRate: 0.28 },
  { id: "linen", name: "Linen & Light Studio", category: "decor", min: 10, max: 180, events: ["wedding", "anniversary", "birthday", "family", "custom"], flat: 950, seed: 22, busyRate: 0.24 },
  { id: "nova", name: "DJ Nova", category: "dj", min: 10, max: 300, events: "all", flat: 850, seed: 31, busyRate: 0.34 },
  { id: "static", name: "Static Bloom Sound", category: "dj", min: 30, max: 300, events: ["wedding", "corporate", "hybrid", "birthday"], flat: 1100, seed: 32, busyRate: 0.2 },
  { id: "lens", name: "Lens & Frame Studio", category: "photo", min: 10, max: 300, events: "all", flat: 1200, seed: 81, busyRate: 0.22 },
  { id: "lumina", name: "Lumina Cinematics", category: "photo", min: 15, max: 350, events: ["wedding", "anniversary", "corporate", "hybrid", "custom"], flat: 1450, seed: 84, busyRate: 0.26 },
  { id: "aura", name: "Aura Sound & Lighting", category: "lighting", min: 10, max: 300, events: "all", flat: 750, seed: 82, busyRate: 0.25 },
  { id: "prism", name: "Prism Stagecraft", category: "lighting", min: 20, max: 400, events: ["wedding", "corporate", "hybrid", "birthday"], flat: 890, seed: 85, busyRate: 0.2 },
  { id: "streamsync", name: "StreamSync Studio", category: "hybrid", min: 10, max: 300, events: "all", flat: 850, seed: 83, busyRate: 0.18 },
  { id: "rentit", name: "RentIt Pro", category: "equipment", min: 10, max: 300, events: "all", perGuest: 9, seed: 41, busyRate: 0.15 },
  { id: "canopy", name: "Canopy Works", category: "equipment", min: 10, max: 200, events: ["bbq", "family", "wedding", "birthday", "custom"], perGuest: 11, seed: 42, busyRate: 0.18 },
  { id: "hostline", name: "Hostline Staffing", category: "staff", min: 20, max: 300, events: "all", perGuest: 14, seed: 51, busyRate: 0.25 },
  { id: "tidy", name: "Tidy Morning Co.", category: "cleaning", min: 10, max: 300, events: "all", flat: 420, seed: 61, busyRate: 0.12 },
  { id: "sparkle", name: "Afterglow Cleaners", category: "cleaning", min: 10, max: 150, events: "all", flat: 360, seed: 62, busyRate: 0.2 },
];

export const VENUES: Venue[] = [
  { id: "smokestack", name: "Smokestack Yard", area: "Riverside Arts District", min: 20, max: 120, price: 2400, minSpend: 0, events: "all", amenities: ["Open-air courtyard", "Fire pits", "String lights", "Loading bay"], excludes: ["canopy"], seed: 71, busyRate: 0.3 },
  { id: "glasshouse", name: "The Glasshouse", area: "Botanic Quarter", min: 40, max: 220, price: 4200, minSpend: 0, events: ["wedding", "anniversary", "corporate", "hybrid", "custom"], amenities: ["Garden conservatory", "Bridal suite", "In-house AV", "Step-free"], excludes: ["smoke"], seed: 72, busyRate: 0.36 },
  { id: "loft9", name: "Loft Nine", area: "Old Mill Row", min: 30, max: 300, price: 3600, minSpend: 0, events: ["corporate", "hybrid", "birthday", "custom", "wedding"], amenities: ["Stream-ready stage", "Green room", "Freight lift", "Bar"], excludes: [], seed: 73, busyRate: 0.28 },
  { id: "harbor", name: "Harbor Hall", area: "Waterfront", min: 150, max: 400, price: 6800, minSpend: 12000, events: ["wedding", "corporate"], amenities: ["Ballroom", "Harbor terrace", "Valet"], excludes: [], seed: 74, busyRate: 0.25 },
  { id: "mews", name: "Cedar Mews Room", area: "Hillcrest", min: 10, max: 45, price: 900, minSpend: 0, events: ["birthday", "anniversary", "family", "custom"], amenities: ["Private dining", "Fireplace", "Piano"], excludes: [], seed: 75, busyRate: 0.2 },
];

export type ServiceTab = "Plan" | "Host" | "Produce";
export const SERVICES_11: { no: string; title: string; tagline: string; tab: ServiceTab; t: string; d: string }[] = [
  { no: "01", title: "Events Production", tagline: "Run-of-show, cues and one person holding every thread.", tab: "Plan", t: "Events Production", d: "Run-of-show, cues and one person holding every thread." },
  { no: "02", title: "Design Support", tagline: "Mood, palette and floor plan before anyone buys a napkin.", tab: "Plan", t: "Design Support", d: "Mood, palette and floor plan before anyone buys a napkin." },
  { no: "03", title: "Media & PR", tagline: "Announcements, press lists and a story worth telling.", tab: "Plan", t: "Media & PR", d: "Announcements, press lists and a story worth telling." },
  { no: "04", title: "Catering", tagline: "Menus built around your guests, not a set list.", tab: "Host", t: "Catering", d: "Menus built around your guests, not a set list." },
  { no: "05", title: "Decorations", tagline: "Florals, draping, tablescapes - styled, installed, struck.", tab: "Host", t: "Decorations", d: "Florals, draping, tablescapes - styled, installed, struck." },
  { no: "06", title: "Music & DJ", tagline: "A set that reads the room, mic for the speeches.", tab: "Host", t: "Music & DJ", d: "A set that reads the room, mic for the speeches." },
  { no: "07", title: "Post-Event Cleaning Support", tagline: "The morning after, handled before you wake.", tab: "Host", t: "Post-Event Cleaning", d: "The morning after, handled before you wake." },
  { no: "08", title: "Photo & Videography", tagline: "Candids, portraits and a same-week highlight reel.", tab: "Produce", t: "Photo & Videography", d: "Candids, portraits and a same-week highlight reel." },
  { no: "09", title: "Equipment Support", tagline: "Tables, tents, heaters, power - delivered and cleared.", tab: "Produce", t: "Equipment Support", d: "Tables, tents, heaters, power - delivered and cleared." },
  { no: "10", title: "Lights & Sound", tagline: "Warm washes, clean audio, zero feedback squeal.", tab: "Produce", t: "Lights & Sound", d: "Warm washes, clean audio, zero feedback squeal." },
  { no: "11", title: "Hybrid Events", tagline: "Live + digital. Stage, cameras and a platform that just works.", tab: "Produce", t: "Hybrid Events", d: "Live + digital. Stage, cameras and a platform that just works." },
];

/** Deterministic pseudo-random in [0, 1). Same seed + index always returns the same value. */
function rand(seed: number, i: number): number {
  let t = (seed * 9301 + i * 49297 + 233280) | 0;
  t = Math.imul(t ^ (t >>> 15), 2246822507);
  t = Math.imul(t ^ (t >>> 13), 3266489909);
  return ((t ^ (t >>> 16)) >>> 0) / 4294967296;
}

export const isBusy = (seed: number, rate: number, day: number): boolean => rand(seed, day) < rate;
export const bondzBusy = (day: number): boolean => isBusy(7, 0.22, day);
export const slotOpen = (day: number, slotIndex: number): boolean => rand(99 + slotIndex, day) > 0.3;

/** How many of the next `horizon` days this entity is free - used for live availability badges. */
export function openDayCount(seed: number, rate: number, horizon = HORIZON): number {
  let open = 0;
  for (let day = 0; day < horizon; day += 1) if (!isBusy(seed, rate, day)) open += 1;
  return open;
}

/** The first day index in the window where this entity and Mr. Bondz are both free. */
export function nextOpenDay(seed: number, rate: number, horizon = HORIZON): number | null {
  for (let day = 0; day < horizon; day += 1) if (!isBusy(seed, rate, day) && !bondzBusy(day)) return day;
  return null;
}

export function dayLabel(day: number): string {
  const date = new Date();
  date.setDate(date.getDate() + day);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const priceLabel = (entry: { flat?: number; perGuest?: number }): string =>
  entry.perGuest ? `$${entry.perGuest}/guest` : entry.flat ? `$${entry.flat.toLocaleString()} flat` : "On request";

export const categoryLabel = (id: CategoryId): string => CATEGORIES.find((category) => category.id === id)?.label ?? id;

/* ── /book engine: 6-step booking data ─────────────────────────── */

export interface Sel {
  event: EventTypeId | null;
  guests: number;
  where: "home" | "venue" | null;
  venue: string | null;
  services: CategoryId[];
}

export interface Details {
  name: string;
  phone: string;
  email: string;
  honor: string;
  notes: string;
}

export interface LogLine {
  id: number;
  text: string;
  before: number;
  after: number;
  at: string;
}

export const GUEST_MIN = 10;
export const GUEST_MAX = 300;

/** Narrative banner shown once an event type is chosen. */
export const EVENT_NARRATIVES: Record<EventTypeId, { kicker: string; highlight: string; body: string }> = {
  wedding: { kicker: "Flawless production.", highlight: "Zero wedding day stress.", body: "From morning load-in and acoustic ceremony cues to the final sparkler send-off, Mr. Bondz personally captains every timeline, vendor sync, and table seating with calm mastery." },
  anniversary: { kicker: "Milestone celebrations.", highlight: "Crafted with intimacy.", body: "Curated chef tasting menus, atmospheric ambient lighting, and bespoke musical narratives honoring your journey together - whether an intimate dining room or an outdoor terrace." },
  birthday: { kicker: "Unapologetic celebration.", highlight: "Zero planning fatigue.", body: "Boutique cocktail bars, high-vibe soundscapes, and immersive decor so you and your guests can simply walk in, celebrate, and dance until 2 AM without chasing a single vendor." },
  bbq: { kicker: "Smoky feast, sun & style.", highlight: "Handled end-to-end.", body: "Live pitmaster grilling, artisanal craft drink stations, lawn setups, and weather-proof canopies - delivering elevated open-air hospitality with zero host cleanup." },
  family: { kicker: "Multi-generational warmth.", highlight: "One unified table.", body: "Comfort-forward family dining, generational music curation, and seamless seating setups so you spend the entire day catching up, not running around." },
  corporate: { kicker: "Precision brand hospitality.", highlight: "Executive polish.", body: "Keynote-ready staging, seamless audiovisuals, VIP hospitality lounges, and culinary excellence designed to leave partners, investors, and clients thoroughly impressed." },
  hybrid: { kicker: "It's not just live.", highlight: "It's live + digital.", body: "Hybrid events blend in-person energy with virtual participation through broadcasting and digital tools - so people can join from anywhere. Creative stage design, AV integration and a smart streaming platform, all coordinated by Mr. Bondz." },
  custom: { kicker: "Bespoke architecture.", highlight: "You dream it, we execute it.", body: "Have a unique concept, themed gala, or unusual venue? Mr. Bondz engineers custom floorplans, bespoke lighting, and custom vendor orchestration from scratch." },
};

/** Celebration vibes, curated per event category. */
export const VIBES_BY_EVENT: Record<EventTypeId, string[]> = {
  wedding: ["Black Tie Glamour", "Romantic Garden", "Modern Minimalist", "Fairy Tale Luxe", "Coastal Chic", "Intimate Candlelight"],
  anniversary: ["Heirloom Romance", "Candlelight & Vinyl", "Speakeasy Soirée", "Sunset Terrace", "Vintage Grandeur"],
  birthday: ["High Energy Rave", "Underground Speakeasy", "Neon Disco", "Rooftop Sunset", "Bohemian Lounge", "Festival Field"],
  bbq: ["Smoky Pitmaster", "Backyard Fiesta", "Sun-Drenched Lawn", "Craft Beer & Beats", "Campfire Acoustic"],
  family: ["Generational Warmth", "Cozy Heritage", "Sunday Picnic", "Fireside Stories", "Festive Feast"],
  corporate: ["Executive Polish", "Tech Summit Luxe", "Innovation Showcase", "Cocktail Networking", "Black Tie Gala"],
  hybrid: ["Broadcast Studio", "Global Stage", "Immersive Neon", "Silicon Sleek", "Split-Screen Social"],
  custom: ["Avant-Garde Fantasy", "Celestial Night", "Art Gallery Noir", "Bespoke Masquerade", "Futuristic Chic"],
};

export const SLOT_TIMES: Record<Slot, string> = {
  Morning: "10:00 AM - 2:00 PM",
  Afternoon: "2:00 PM - 6:00 PM",
  Evening: "5:00 PM - 10:00 PM",
};

function fitsEvent(list: EventTypeId[] | "all", e: EventTypeId | null): boolean {
  return list === "all" || (e ? list.includes(e) : true);
}

export function eligiblePartners(cat: CategoryId, guests: number, event: EventTypeId | null, venue?: Venue | null): Partner[] {
  return PARTNERS.filter(
    (p) => p.category === cat && guests >= p.min && guests <= p.max && fitsEvent(p.events, event) && !(venue && venue.excludes.includes(p.id)),
  );
}

export const priceOf = (p: Partner, guests: number): number => p.flat ?? (p.perGuest ?? 0) * guests;

export function cheapest(cat: CategoryId, guests: number, event: EventTypeId | null, venue?: Venue | null): Partner | null {
  const ps = eligiblePartners(cat, guests, event, venue);
  if (!ps.length) return null;
  return ps.reduce((a, b) => (priceOf(a, guests) <= priceOf(b, guests) ? a : b));
}

export function assignPartner(cat: CategoryId, sel: Sel, day: number): Partner | undefined {
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  return eligiblePartners(cat, sel.guests, sel.event, venue)
    .filter((p) => !isBusy(p.seed, p.busyRate, day))
    .sort((a, b) => priceOf(a, sel.guests) - priceOf(b, sel.guests))[0];
}

/** The Smart Intersection engine: days where Mr. Bondz, the venue and every chosen partner are free. */
export function availableDays(sel: Sel, services: CategoryId[] = sel.services, venueId: string | null = sel.venue): number[] {
  const venue = VENUES.find((v) => v.id === venueId) ?? null;
  const out: number[] = [];
  for (let d = 1; d <= HORIZON; d += 1) {
    if (bondzBusy(d)) continue;
    if (venue && isBusy(venue.seed, venue.busyRate, d)) continue;
    if (!SLOTS.some((_, s) => slotOpen(d, s))) continue;
    let ok = true;
    for (const c of services) {
      const ps = eligiblePartners(c, sel.guests, sel.event, venue);
      if (!ps.some((p) => !isBusy(p.seed, p.busyRate, d))) { ok = false; break; }
    }
    if (ok) out.push(d);
  }
  return out;
}

/** Free days in the horizon for one party - used for the intersection chips. */
export function freeDayCount(seed: number, rate: number): number {
  let n = 0;
  for (let d = 1; d <= HORIZON; d += 1) if (!isBusy(seed, rate, d)) n += 1;
  return n;
}

export function venueReason(v: Venue, guests: number, event: EventTypeId | null, budget: number): string | null {
  if (!fitsEvent(v.events, event)) return "Doesn't host this event type";
  if (guests > v.max) return `Holds ${v.max} max - you have ${guests}`;
  if (guests < v.min) return `Minimum ${v.min} guests`;
  if (v.minSpend && budget < v.minSpend) return `Minimum spend $${v.minSpend.toLocaleString()}`;
  return null;
}

export const DEPOSIT_RATE = 0.25;
export const RESCHEDULE_FEE_RATE = 0.05;

export interface EstimateLine { label: string; amount: number; note?: string }
export function estimate(sel: Sel): { lines: EstimateLine[]; total: number; deposit: number; balance: number } {
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  const lines: EstimateLine[] = [
    { label: "Mr. Bondz - planning & on-site", amount: sel.where === "venue" ? BONDZ_FEE.venue : BONDZ_FEE.home, note: "flat" },
  ];
  if (venue) lines.push({ label: venue.name, amount: venue.price, note: "venue hire" });
  for (const c of sel.services) {
    const p = cheapest(c, sel.guests, sel.event, venue);
    if (!p) continue;
    lines.push({ label: categoryLabel(c), amount: priceOf(p, sel.guests), note: p.flat ? "flat" : `$${p.perGuest}/guest` });
  }
  const total = lines.reduce((a, l) => a + l.amount, 0);
  const deposit = Math.round(total * DEPOSIT_RATE);
  return { lines, total, deposit, balance: total - deposit };
}

export function dayToDate(anchor: Date, d: number): Date {
  const x = new Date(anchor);
  x.setDate(x.getDate() + d);
  return x;
}

export const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const money = usd;

export const CONTACT = {
  email: "hello@bondzevents.com",
  phone: "+1 (555) 012-3456",
  hours: "Mon-Sat, 9am-7pm",
  studio: "By appointment only",
};

export const TERMS: { t: string; b: string }[] = [
  { t: "Deposit", b: "A 25% demo deposit illustrates how your date, venue and partners would be reserved in one sitting." },
  { t: "Balance", b: "The remaining balance is due 7 days before your celebration." },
  { t: "Rescheduling", b: "One free reschedule up to 30 days before the event, subject to availability. Later changes are handled personally by Mr. Bondz." },
  { t: "Cancellation", b: "Over 60 days: deposit refunded minus a 5% processing fee. 30 to 60 days: 50% of deposit refunded. Under 30 days: deposit is non-refundable." },
  { t: "Availability", b: "Only dates where Mr. Bondz, the venue and every partner are free are shown - what you see is what you get." },
  { t: "Partners", b: "Every partner is vetted, insured and briefed by Mr. Bondz personally." },
  { t: "Weather", b: "Outdoor plans always carry an indoor fallback at no extra cost." },
  { t: "One point of contact", b: "You never chase a vendor. One call, one person, one plan." },
];

export const CANCELLATION_POLICY: { t: string; b: string }[] = [
  { t: "Booking & Deposit", b: "Your booking is confirmed once the 25% deposit is paid and these terms are signed. The balance is due 7 days before the event." },
  { t: "Availability Guarantee", b: "Every date shown was free across Mr. Bondz, your venue (if any) and every assigned partner at the moment of booking. Those calendars are locked for you." },
  { t: "Rescheduling", b: "One free reschedule up to 30 days before the event, subject to live availability across the same partners. Later changes are handled personally by Mr. Bondz." },
  { t: "Cancellation Tiers", b: "More than 60 days out: deposit refunded minus a 5% processing fee. 30 to 60 days: 50% of deposit refunded. Under 30 days: deposit is non-refundable." },
  { t: "Guest Count Flexibility", b: "Final numbers may move up to 10% up to 14 days before the event at the same per-guest rates. Larger changes re-run calendar availability." },
  { t: "Force Majeure", b: "If an event cannot take place due to causes beyond anyone's control, we move it to the next mutually available date at no additional cost." },
];

export const PARTNER_GROUPS: { g: string; names: string[] }[] = [
  { g: "Catering", names: ["Halal Feast Co.", "Smoke & Cedar Catering", "Ember & Oak Kitchen"] },
  { g: "Decor", names: ["Petal Theory", "Linen & Light Studio"] },
  { g: "Music & DJ", names: ["DJ Nova", "Static Bloom Sound"] },
  { g: "Photo & Film", names: ["Lens & Frame Studio", "Lumina Cinematics"] },
  { g: "Lights & Sound", names: ["Aura Sound & Lighting", "Prism Stagecraft"] },
  { g: "Hybrid", names: ["StreamSync Studio"] },
  { g: "Equipment", names: ["RentIt Pro", "Canopy Works"] },
  { g: "Staffing", names: ["Hostline Staffing"] },
  { g: "Cleaning", names: ["Tidy Morning Co.", "Afterglow Cleaners"] },
];
