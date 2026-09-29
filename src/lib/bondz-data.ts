export type EventTypeId = "wedding" | "anniversary" | "birthday" | "bbq" | "family" | "corporate" | "hybrid" | "custom";
export type CategoryId = "catering" | "decor" | "dj" | "equipment" | "staff" | "cleaning" | "photo" | "lighting" | "hybrid";
export type Slot = "Morning" | "Evening" | "Night";

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
export const SLOTS: readonly Slot[] = ["Morning", "Evening", "Night"] as const;
export const BONDZ_FEE = { home: 450, venue: 650 };

export const EVENT_TYPES = [
  { id: "wedding", no: "01", title: "Wedding", line: "Vows, a long table and one very good first dance" },
  { id: "anniversary", no: "02", title: "Anniversary", line: "Another lap around the sun — together" },
  { id: "birthday", no: "03", title: "Birthday", line: "Cake, candles, chaos (the good kind)" },
  { id: "bbq", no: "04", title: "BBQ Party", line: "Smoke, sun and a long table" },
  { id: "family", no: "05", title: "Family Get-together", line: "Three generations, one playlist argument" },
  { id: "corporate", no: "06", title: "Corporate Events", line: "Launches, offsites, and speeches people finish" },
  { id: "hybrid", no: "07", title: "Hybrid Events", line: "In the room and on every screen" },
  { id: "custom", no: "08", title: "Custom Events", line: "You describe it. We make it exist" },
] as const;

export const CATEGORIES: { id: CategoryId; label: string; desc: string }[] = [
  { id: "catering", label: "Catering", desc: "Plated, family-style or live grill — food people talk about." },
  { id: "decor", label: "Decorations", desc: "Florals, draping, tablescapes and a photo wall that earns its place." },
  { id: "dj", label: "DJ / Music", desc: "A set that reads the room, plus mic for speeches." },
  { id: "photo", label: "Photo & Video", desc: "Candids, portraits, and same-week 4K highlight reel." },
  { id: "lighting", label: "Lights & Audio", desc: "Warm washes, clean audio PA, zero feedback squeal." },
  { id: "hybrid", label: "Live Streaming", desc: "Multi-cam live broadcast with remote guest interactivity." },
  { id: "equipment", label: "Equipment Rental", desc: "Tables, chairs, tents, heaters — delivered and struck." },
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
export const SERVICES_11: { no: string; title: string; tagline: string; tab: ServiceTab }[] = [
  { no: "01", title: "Events Production", tagline: "Run-of-show, cues and one person holding every thread.", tab: "Plan" },
  { no: "02", title: "Design Support", tagline: "Mood, palette and floor plan before anyone buys a napkin.", tab: "Plan" },
  { no: "03", title: "Media & PR", tagline: "Announcements, press lists and a story worth telling.", tab: "Plan" },
  { no: "04", title: "Catering", tagline: "Menus built around your guests, not a set list.", tab: "Host" },
  { no: "05", title: "Decorations", tagline: "Florals, draping, tablescapes — styled, installed, struck.", tab: "Host" },
  { no: "06", title: "Music & DJ", tagline: "A set that reads the room, mic for the speeches.", tab: "Host" },
  { no: "07", title: "Post-Event Cleaning Support", tagline: "The morning after, handled before you wake.", tab: "Host" },
  { no: "08", title: "Photo & Videography", tagline: "Candids, portraits and a same-week highlight reel.", tab: "Produce" },
  { no: "09", title: "Equipment Support", tagline: "Tables, tents, heaters, power — delivered and cleared.", tab: "Produce" },
  { no: "10", title: "Lights & Sound", tagline: "Warm washes, clean audio, zero feedback squeal.", tab: "Produce" },
  { no: "11", title: "Hybrid Events", tagline: "Live + digital. Stage, cameras and a platform that just works.", tab: "Produce" },
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

/** How many of the next `horizon` days this entity is free — used for live availability badges. */
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
