import {
  EVENT_TYPES,
  PARTNERS,
  VENUES,
  SLOT_TIMES,
  type EventTypeId,
  type CategoryId,
  type Slot,
  type Partner,
} from "./bondz-data";

export type PortalRole = "owner" | "partner" | null;

export interface PortalBooking {
  id: string;
  ref: string;
  event: EventTypeId;
  eventTitle: string;
  guests: number;
  where: "home" | "venue";
  venueName: string;
  dateStr: string;
  slot: Slot;
  totalCost: number;
  depositPaid: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  assignedPartners: {
    partnerId: string;
    partnerName: string;
    category: string;
    agreedFee: number;
    status: "Confirmed" | "Locked" | "Pending";
  }[];
  runOfShow: { time: string; action: string }[];
  status: "Confirmed" | "In Production" | "Completed";
}

export interface CustomPartner {
  id: string;
  name: string;
  category: CategoryId;
  contact: string;
  phone: string;
  email: string;
  rateLabel: string;
  capacity: string;
  active: boolean;
}

// 8 signature demo scenarios mapped to realistic portal booking structures
const DEFAULT_SCENARIOS: PortalBooking[] = [
  {
    id: "bz-wed-01",
    ref: "BZ-7492-OCT26",
    event: "wedding",
    eventTitle: "Amira & Jonah’s Wedding",
    guests: 60,
    where: "venue",
    venueName: "Smokestack Yard",
    dateStr: "Saturday, October 24, 2026",
    slot: "Evening",
    totalCost: 11450,
    depositPaid: 2862,
    clientName: "Amira Kensington & Jonah Ross",
    clientPhone: "+1 (555) 234-5678",
    clientEmail: "amira.k@example.com",
    notes: "Golden hour sunset cocktails, outdoor candlelit dinner, no gluten for bridal party.",
    assignedPartners: [
      {
        partnerId: "halal",
        partnerName: "Halal Feast Co.",
        category: "Catering",
        agreedFee: 2280,
        status: "Confirmed",
      },
      { partnerId: "nova", partnerName: "DJ Nova", category: "DJ / Music", agreedFee: 850, status: "Confirmed" },
      {
        partnerId: "petal",
        partnerName: "Petal Theory",
        category: "Decorations",
        agreedFee: 1200,
        status: "Confirmed",
      },
      {
        partnerId: "smokestack",
        partnerName: "Smokestack Yard",
        category: "Venue",
        agreedFee: 2400,
        status: "Confirmed",
      },
    ],
    runOfShow: [
      { time: "15:00", action: "Vendor load-in & soundcheck (DJ Nova & Smokestack)" },
      { time: "16:30", action: "Florals & tablescapes final placement (Petal Theory)" },
      { time: "17:30", action: "Guest arrival & welcome sparkling flutes" },
      { time: "18:15", action: "Ceremony & vow exchange" },
      { time: "19:00", action: "Banqueting service begins (Halal Feast Co.)" },
      { time: "21:00", action: "First dance & party set" },
      { time: "23:00", action: "Live event strike & quiet departure" },
    ],
    status: "Confirmed",
  },
  {
    id: "bz-bday-02",
    ref: "BZ-3184-NOV12",
    event: "birthday",
    eventTitle: "Jonah’s 30th Birthday Rave",
    guests: 40,
    where: "home",
    venueName: "Host Private Residence (Chelsea)",
    dateStr: "Thursday, November 12, 2026",
    slot: "Evening",
    totalCost: 5200,
    depositPaid: 1300,
    clientName: "Jonah Ross",
    clientPhone: "+1 (555) 987-6543",
    clientEmail: "jonah.r@example.com",
    notes: "High tempo soundscape, late night artisan pizza bar, noise curfew 01:00.",
    assignedPartners: [
      { partnerId: "nova", partnerName: "DJ Nova", category: "DJ / Music", agreedFee: 850, status: "Confirmed" },
      {
        partnerId: "lens",
        partnerName: "Lens & Frame Studio",
        category: "Photo & Video",
        agreedFee: 1200,
        status: "Confirmed",
      },
      {
        partnerId: "aura",
        partnerName: "Aura Sound & Lighting",
        category: "Lights & Audio",
        agreedFee: 750,
        status: "Confirmed",
      },
    ],
    runOfShow: [
      { time: "18:00", action: "Aura lighting wash & sound truss setup" },
      { time: "19:30", action: "Host arrival & cocktail hour" },
      { time: "20:30", action: "Lens & Frame roaming photography" },
      { time: "21:00", action: "DJ Nova prime 3-hour set" },
      { time: "01:00", action: "Sound down & strike" },
    ],
    status: "Confirmed",
  },
  {
    id: "bz-bbq-03",
    ref: "BZ-5921-AUG04",
    event: "bbq",
    eventTitle: "Summer Open-Fire Pit BBQ",
    guests: 85,
    where: "venue",
    venueName: "Smokestack Yard",
    dateStr: "Saturday, August 15, 2026",
    slot: "Evening",
    totalCost: 8900,
    depositPaid: 2225,
    clientName: "Marcus Thorne",
    clientPhone: "+1 (555) 345-6789",
    clientEmail: "marcus.t@example.com",
    notes: "Live pitmaster demonstration, craft beer pairings, casual bench seating.",
    assignedPartners: [
      {
        partnerId: "smoke",
        partnerName: "Smoke & Cedar Catering",
        category: "Catering",
        agreedFee: 2720,
        status: "Confirmed",
      },
      { partnerId: "nova", partnerName: "DJ Nova", category: "DJ / Music", agreedFee: 850, status: "Confirmed" },
      {
        partnerId: "smokestack",
        partnerName: "Smokestack Yard",
        category: "Venue",
        agreedFee: 2400,
        status: "Confirmed",
      },
    ],
    runOfShow: [
      { time: "14:00", action: "Smoke & Cedar oak pits lit on courtyard" },
      { time: "16:00", action: "Yard sound & ambient playlists ready" },
      { time: "17:00", action: "Guests arrive, craft beers tapped" },
      { time: "18:00", action: "Slow-smoked feast served family style" },
      { time: "22:00", action: "Fire pit wind-down" },
    ],
    status: "Confirmed",
  },
  {
    id: "bz-corp-04",
    ref: "BZ-9042-DEC15",
    event: "corporate",
    eventTitle: "Annual Keynote & Tech Gala",
    guests: 110,
    where: "venue",
    venueName: "Loft Nine",
    dateStr: "Tuesday, December 15, 2026",
    slot: "Morning",
    totalCost: 14800,
    depositPaid: 3700,
    clientName: "Lena Vasquez (VP Culture)",
    clientPhone: "+1 (555) 456-7890",
    clientEmail: "lena.m@company.com",
    notes: "Low-latency broadcast for remote EU offices, specialty barista lounge.",
    assignedPartners: [
      {
        partnerId: "ember",
        partnerName: "Ember & Oak Kitchen",
        category: "Catering",
        agreedFee: 5060,
        status: "Confirmed",
      },
      {
        partnerId: "streamsync",
        partnerName: "StreamSync Studio",
        category: "Live Streaming",
        agreedFee: 850,
        status: "Confirmed",
      },
      {
        partnerId: "prism",
        partnerName: "Prism Stagecraft",
        category: "Lights & Audio",
        agreedFee: 890,
        status: "Confirmed",
      },
      { partnerId: "loft9", partnerName: "Loft Nine", category: "Venue", agreedFee: 3600, status: "Confirmed" },
    ],
    runOfShow: [
      { time: "07:00", action: "AV broadcast check & stage setup (StreamSync)" },
      { time: "08:00", action: "Barista lounge open, pastry service (Ember & Oak)" },
      { time: "09:00", action: "Executive keynote live stream begins" },
      { time: "11:30", action: "Buffet lunch & networking" },
      { time: "14:00", action: "Afternoon breakout sessions & teardown" },
    ],
    status: "Confirmed",
  },
  {
    id: "bz-ann-05",
    ref: "BZ-1839-SEP20",
    event: "anniversary",
    eventTitle: "Priya & Dev’s Silver Jubilee",
    guests: 30,
    where: "home",
    venueName: "Cedar Mews Private Room",
    dateStr: "Sunday, September 20, 2026",
    slot: "Evening",
    totalCost: 6400,
    depositPaid: 1600,
    clientName: "Priya & Dev Sharma",
    clientPhone: "+1 (555) 567-8901",
    clientEmail: "priya.dev@example.com",
    notes: "Chef 5-course tasting menu with wine pairings, acoustic strings.",
    assignedPartners: [
      {
        partnerId: "ember",
        partnerName: "Ember & Oak Kitchen",
        category: "Catering",
        agreedFee: 1380,
        status: "Confirmed",
      },
      {
        partnerId: "petal",
        partnerName: "Petal Theory",
        category: "Decorations",
        agreedFee: 1200,
        status: "Confirmed",
      },
      {
        partnerId: "lens",
        partnerName: "Lens & Frame Studio",
        category: "Photo & Video",
        agreedFee: 1200,
        status: "Confirmed",
      },
      { partnerId: "mews", partnerName: "Cedar Mews Room", category: "Venue", agreedFee: 900, status: "Confirmed" },
    ],
    runOfShow: [
      { time: "17:00", action: "Floral installation & candlelight staging" },
      { time: "18:00", action: "Champagne welcome reception" },
      { time: "19:00", action: "5-course culinary journey begins" },
      { time: "22:00", action: "Dessert, toasts & memory reel" },
    ],
    status: "Confirmed",
  },
  {
    id: "bz-fam-06",
    ref: "BZ-4410-JUL18",
    event: "family",
    eventTitle: "The Vance Family Reunion",
    guests: 50,
    where: "home",
    venueName: "Private Garden Estate",
    dateStr: "Saturday, July 18, 2026",
    slot: "Afternoon",
    totalCost: 4850,
    depositPaid: 1212,
    clientName: "Elena Vance",
    clientPhone: "+1 (555) 678-9012",
    clientEmail: "vance.family@example.com",
    notes: "Multigenerational games, comfort barbecue, covered tent canopy.",
    assignedPartners: [
      {
        partnerId: "smoke",
        partnerName: "Smoke & Cedar Catering",
        category: "Catering",
        agreedFee: 1600,
        status: "Confirmed",
      },
      {
        partnerId: "canopy",
        partnerName: "Canopy Works",
        category: "Equipment Rental",
        agreedFee: 550,
        status: "Confirmed",
      },
      {
        partnerId: "tidy",
        partnerName: "Tidy Morning Co.",
        category: "Cleaning Service",
        agreedFee: 420,
        status: "Confirmed",
      },
    ],
    runOfShow: [
      { time: "10:00", action: "Tent & lawn game setup (Canopy Works)" },
      { time: "12:00", action: "Family arrival & welcome iced punches" },
      { time: "13:30", action: "Smoked feast luncheon" },
      { time: "17:00", action: "Farewell toasts & Tidy Morning sweep" },
    ],
    status: "Confirmed",
  },
  {
    id: "bz-hyb-07",
    ref: "BZ-8219-NOV03",
    event: "hybrid",
    eventTitle: "Global Brand Launch & Stream",
    guests: 110,
    where: "venue",
    venueName: "The Glasshouse",
    dateStr: "Tuesday, November 3, 2026",
    slot: "Morning",
    totalCost: 16200,
    depositPaid: 4050,
    clientName: "Tolu Adeyemi",
    clientPhone: "+1 (555) 789-0123",
    clientEmail: "tolu.events@example.com",
    notes: "Multi-cam live link with Tokyo and London partners. Crisp audio essential.",
    assignedPartners: [
      {
        partnerId: "streamsync",
        partnerName: "StreamSync Studio",
        category: "Live Streaming",
        agreedFee: 850,
        status: "Confirmed",
      },
      {
        partnerId: "glasshouse",
        partnerName: "The Glasshouse",
        category: "Venue",
        agreedFee: 4200,
        status: "Confirmed",
      },
      {
        partnerId: "halal",
        partnerName: "Halal Feast Co.",
        category: "Catering",
        agreedFee: 4180,
        status: "Confirmed",
      },
    ],
    runOfShow: [
      { time: "06:30", action: "Satellite stream latency diagnostics" },
      { time: "08:30", action: "Guest registration & barista bar" },
      { time: "09:30", action: "Global keynote transmission" },
      { time: "12:00", action: "Networking buffet & VIP demo station" },
    ],
    status: "Confirmed",
  },
  {
    id: "bz-cst-08",
    ref: "BZ-6104-OCT10",
    event: "custom",
    eventTitle: "Midnight Masquerade Gala",
    guests: 75,
    where: "venue",
    venueName: "Harbor Hall",
    dateStr: "Saturday, October 10, 2026",
    slot: "Evening",
    totalCost: 18500,
    depositPaid: 4625,
    clientName: "Clara & Sebastian Sterling",
    clientPhone: "+1 (555) 890-1234",
    clientEmail: "clara.sterling@example.com",
    notes: "Black tie masquerade, custom projection mapping, valet arrivals.",
    assignedPartners: [
      { partnerId: "harbor", partnerName: "Harbor Hall", category: "Venue", agreedFee: 6800, status: "Confirmed" },
      {
        partnerId: "ember",
        partnerName: "Ember & Oak Kitchen",
        category: "Catering",
        agreedFee: 3450,
        status: "Confirmed",
      },
      {
        partnerId: "static",
        partnerName: "Static Bloom Sound",
        category: "DJ / Music",
        agreedFee: 1100,
        status: "Confirmed",
      },
      {
        partnerId: "lumina",
        partnerName: "Lumina Cinematics",
        category: "Photo & Video",
        agreedFee: 1450,
        status: "Confirmed",
      },
    ],
    runOfShow: [
      { time: "16:00", action: "Projection calibration & lighting focus" },
      { time: "19:00", action: "Red carpet & masked guest arrivals" },
      { time: "20:00", action: "4-course seated gala dinner" },
      { time: "22:00", action: "Midnight reveal & DJ set" },
      { time: "02:00", action: "VIP valet departures" },
    ],
    status: "Confirmed",
  },
];

const STORAGE_KEYS = {
  ROLE: "bondz_portal_role",
  PARTNER_ID: "bondz_portal_partner_id",
  CUSTOM_PARTNERS: "bondz_custom_partners",
  PARTNER_BLACKOUTS: "bondz_partner_blackouts",
};

export function getStoredRole(): PortalRole {
  if (typeof window === "undefined") return null;
  const role = localStorage.getItem(STORAGE_KEYS.ROLE);
  if (role === "owner" || role === "partner") return role;
  return null;
}

export function setStoredRole(role: PortalRole) {
  if (typeof window === "undefined") return;
  if (!role) {
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  } else {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }
}

export function clearStoredRole() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ROLE);
}

export function getStoredPartnerId(): string {
  if (typeof window === "undefined") return "ember";
  return localStorage.getItem(STORAGE_KEYS.PARTNER_ID) || "ember";
}

export function setStoredPartnerId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PARTNER_ID, id);
}

export function getCustomPartners(): CustomPartner[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_PARTNERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomPartner(p: CustomPartner) {
  if (typeof window === "undefined") return;
  const current = getCustomPartners();
  const next = [p, ...current.filter((x) => x.id !== p.id)];
  localStorage.setItem(STORAGE_KEYS.CUSTOM_PARTNERS, JSON.stringify(next));
}

export function getPartnerBlackouts(partnerId: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.PARTNER_BLACKOUTS}_${partnerId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function togglePartnerBlackout(partnerId: string, day: number): number[] {
  if (typeof window === "undefined") return [];
  const current = getPartnerBlackouts(partnerId);
  const exists = current.includes(day);
  const next = exists ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => a - b);
  localStorage.setItem(`${STORAGE_KEYS.PARTNER_BLACKOUTS}_${partnerId}`, JSON.stringify(next));
  return next;
}

export function getAllPortalBookings(): PortalBooking[] {
  return DEFAULT_SCENARIOS;
}
