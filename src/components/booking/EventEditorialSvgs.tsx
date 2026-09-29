import type { EventTypeId } from "@/lib/bondz-data";

interface EditorialSvgProps {
  className?: string | undefined;
}

export function WeddingIcon({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Background ambient halo */}
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      {/* Ceremonial Arch */}
      <path d="M22 84V44C22 28.5 34.5 16 50 16C65.5 16 78 28.5 78 44V84" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 84V46C28 33.8 37.8 24 50 24C62.2 24 72 33.8 72 46V84" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Left Ring */}
      <circle cx="43" cy="58" r="14" stroke="currentColor" strokeWidth="2.2" />
      {/* Right Ring Interlocking */}
      <circle cx="57" cy="58" r="14" stroke="currentColor" strokeWidth="2.2" />
      {/* Diamond on Left Ring */}
      <path d="M43 40L47 44L43 48L39 44Z" fill="#f1453b" stroke="#f1453b" strokeWidth="1" />
      <line x1="43" y1="36" x2="43" y2="39" stroke="#f1453b" strokeWidth="1.5" strokeLinecap="round" />
      {/* Sparkles */}
      <path d="M50 8L51.5 12.5L56 14L51.5 15.5L50 20L48.5 15.5L44 14L48.5 12.5Z" fill="#f1453b" />
      <circle cx="70" cy="30" r="1.5" fill="#f1453b" />
      <circle cx="30" cy="30" r="1.5" fill="#f1453b" />
    </svg>
  );
}

export function AnniversaryIcon({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      {/* Base baseline */}
      <line x1="20" y1="84" x2="80" y2="84" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      {/* Left Champagne Flute */}
      <path d="M38 32L34 52C34 58 39 63 45 63H47V78H39V82H55V78H47V63" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Right Champagne Flute (Clinking) */}
      <path d="M62 32L66 52C66 58 61 63 55 63H53V78H61V82H45V78H53V63" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Liquid levels */}
      <path d="M35 44C38 45 42 45 45 44" stroke="#f1453b" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M65 44C62 45 58 45 55 44" stroke="#f1453b" strokeWidth="1.6" strokeLinecap="round" />
      {/* Clinking Sparkle */}
      <path d="M50 24L52 29L57 31L52 33L50 38L48 33L43 31L48 29Z" fill="#f1453b" />
      {/* Floating Bubbles */}
      <circle cx="40" cy="38" r="1.5" fill="#f1453b" />
      <circle cx="60" cy="38" r="1.5" fill="#f1453b" />
      <circle cx="48" cy="18" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="53" cy="15" r="1.8" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function BirthdayIcon({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Bottom Cake Tier */}
      <rect x="25" y="58" width="50" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M25 66C31 69 37 63 43 66C49 69 55 63 61 66C67 69 71 64 75 66" stroke="#f1453b" strokeWidth="1.6" strokeLinecap="round" />
      {/* Top Cake Tier */}
      <rect x="34" y="40" width="32" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M34 46C38 48 42 44 46 46C50 48 54 44 58 46C62 48 64 45 66 46" stroke="#f1453b" strokeWidth="1.4" strokeLinecap="round" />
      {/* Candle */}
      <line x1="50" y1="28" x2="50" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Flame */}
      <path d="M50 17C47 22 48 25 50 27C52 25 53 22 50 17Z" fill="#f1453b" />
      {/* Celebration Sparkles */}
      <path d="M20 34L21.5 37.5L25 39L21.5 40.5L20 44L18.5 40.5L15 39L18.5 37.5Z" fill="#f1453b" opacity="0.8" />
      <path d="M78 30L79.5 33.5L83 35L79.5 36.5L78 40L76.5 36.5L73 35L76.5 33.5Z" fill="#f1453b" opacity="0.8" />
      <circle cx="30" cy="22" r="1.5" fill="#f1453b" />
      <circle cx="70" cy="20" r="1.5" fill="#f1453b" />
    </svg>
  );
}

export function BbqIcon({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="22" y1="86" x2="78" y2="86" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      {/* Tripod Legs */}
      <line x1="38" y1="58" x2="28" y2="86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="58" x2="72" y2="86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="58" x2="50" y2="86" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      {/* Grill Bottom Kettle Bowl */}
      <path d="M24 48C24 64 35 68 50 68C65 68 76 64 76 48H24Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      {/* Grill Grate Rim */}
      <rect x="22" y="45" width="56" height="4" rx="1.5" stroke="#f1453b" strokeWidth="1.8" fill="currentColor" fillOpacity="0.05" />
      {/* Dome Lid (Open / Hovering) */}
      <path d="M26 38C26 24 37 18 50 18C63 18 74 24 74 38H26Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Lid Handle */}
      <path d="M44 18V13H56V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Fire & Smoke */}
      <path d="M46 44C44 41 45 39 48 37C49 39 52 40 50 44" stroke="#f1453b" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M54 44C52 41 53 38 56 36C57 39 60 40 58 44" stroke="#f1453b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="50" cy="56" r="2" fill="#f1453b" />
      <circle cx="42" cy="54" r="1.5" fill="#f1453b" />
      <circle cx="58" cy="54" r="1.5" fill="#f1453b" />
    </svg>
  );
}

export function FamilyIcon({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      {/* Overhead Warm Chandelier / Pendant Light */}
      <line x1="50" y1="12" x2="50" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 32C40 26 44 24 50 24C56 24 60 26 60 32H40Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M46 32L50 36L54 32" stroke="#f1453b" strokeWidth="1.5" />
      {/* Long Grand Dining Table */}
      <line x1="16" y1="62" x2="84" y2="62" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="22" y1="62" x2="22" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="78" y1="62" x2="78" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="84" x2="82" y2="84" stroke="currentColor" strokeWidth="1.4" opacity="0.3" />
      {/* Centerpiece Flower & Vase */}
      <path d="M47 62V54H53V62H47Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="48" r="4" fill="#f1453b" />
      <path d="M50 44L52 46L50 48L48 46Z" fill="white" />
      {/* Family Place Settings */}
      <ellipse cx="32" cy="59" rx="5" ry="2" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="68" cy="59" rx="5" ry="2" stroke="currentColor" strokeWidth="1.5" />
      {/* Wine Goblets */}
      <line x1="24" y1="52" x2="24" y2="58" stroke="#f1453b" strokeWidth="1.4" />
      <line x1="76" y1="52" x2="76" y2="58" stroke="#f1453b" strokeWidth="1.4" />
    </svg>
  );
}

export function CorporateIcon({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Modern High-Rise Geometry behind Stage */}
      <rect x="22" y="26" width="16" height="58" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      <rect x="62" y="20" width="16" height="64" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      <line x1="26" y1="36" x2="34" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="26" y1="46" x2="34" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="66" y1="32" x2="74" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="66" y1="42" x2="74" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Keynote Presentation Screen */}
      <rect x="36" y="32" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M40 44L46 38L52 42L60 36" stroke="#f1453b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Presentation Podium / Lectern */}
      <path d="M45 84L47 58H53L55 84H45Z" stroke="currentColor" strokeWidth="1.8" />
      <rect x="43" y="55" width="14" height="4" rx="1" fill="#f1453b" />
      {/* Microphone */}
      <line x1="50" y1="55" x2="52" y2="50" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="52" cy="49" r="1.5" fill="#f1453b" />
    </svg>
  );
}

export function HybridIcon({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      {/* Broadcast Camera */}
      <rect x="24" y="38" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M48 42L60 34V60L48 52V42Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Camera Lens Circle */}
      <circle cx="36" cy="47" r="5" stroke="#f1453b" strokeWidth="1.8" />
      <circle cx="36" cy="47" r="2" fill="#f1453b" />
      {/* Tripod Legs */}
      <line x1="36" y1="56" x2="26" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="56" x2="46" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="56" x2="36" y2="84" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      {/* Tally Recording Red Light */}
      <circle cx="30" cy="33" r="2" fill="#f1453b" />
      {/* Digital Stream Radiating Waves */}
      <path d="M66 38C70 43 70 51 66 56" stroke="#f1453b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M72 32C78 40 78 54 72 62" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 3" />
      <path d="M78 26C86 37 86 59 78 70" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function CustomIcon({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      {/* Blueprint Grid Crosshairs */}
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      <line x1="50" y1="16" x2="50" y2="84" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      {/* Master Architect's Drafting Compass */}
      <circle cx="50" cy="24" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="24" r="2" fill="#f1453b" />
      {/* Left Compass Arm */}
      <line x1="47" y1="28" x2="28" y2="76" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Right Compass Arm */}
      <line x1="53" y1="28" x2="72" y2="76" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Adjustment Wheel & Pivot Bar */}
      <line x1="37" y1="52" x2="63" y2="52" stroke="#f1453b" strokeWidth="1.8" />
      <circle cx="50" cy="52" r="3" fill="currentColor" />
      {/* Needle Point & Pencil Lead */}
      <circle cx="28" cy="77" r="1.5" fill="#f1453b" />
      <polygon points="70,74 74,74 72,80" fill="#f1453b" />
      {/* Golden Ratio Arc Arc / Starburst */}
      <path d="M28 76C42 66 58 66 72 76" stroke="#f1453b" strokeWidth="1.4" strokeDasharray="2 3" />
      <path d="M78 22L79.5 25.5L83 27L79.5 28.5L78 32L76.5 28.5L73 27L76.5 25.5Z" fill="#f1453b" />
    </svg>
  );
}

export const EVENT_SVGS: Record<EventTypeId, (props: EditorialSvgProps) => React.ReactElement> = {
  wedding: WeddingIcon,
  anniversary: AnniversaryIcon,
  birthday: BirthdayIcon,
  bbq: BbqIcon,
  family: FamilyIcon,
  corporate: CorporateIcon,
  hybrid: HybridIcon,
  custom: CustomIcon,
};

export function HomeEditorialSvg({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      {/* House outline */}
      <path d="M20 52L50 26L80 52" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 48V80H72V48" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Door */}
      <path d="M44 80V62H56V80" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Windows */}
      <rect x="33" y="56" width="7" height="7" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
      <rect x="60" y="56" width="7" height="7" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
      {/* Ground line */}
      <line x1="16" y1="80" x2="84" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      {/* Heart above chimney */}
      <path d="M50 14C48 11 44 11 44 14.5C44 17 50 20 50 20C50 20 56 17 56 14.5C56 11 52 11 50 14Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

export function VenueEditorialSvg({ className }: EditorialSvgProps) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      {/* Grand hall facade */}
      <path d="M18 80V44L50 24L82 44V80" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Columns */}
      <line x1="30" y1="52" x2="30" y2="80" stroke="currentColor" strokeWidth="1.8" />
      <line x1="42" y1="52" x2="42" y2="80" stroke="currentColor" strokeWidth="1.8" />
      <line x1="58" y1="52" x2="58" y2="80" stroke="currentColor" strokeWidth="1.8" />
      <line x1="70" y1="52" x2="70" y2="80" stroke="currentColor" strokeWidth="1.8" />
      {/* Entablature */}
      <line x1="24" y1="52" x2="76" y2="52" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
      {/* Star on pediment */}
      <path d="M50 32L51.5 36.5L56 38L51.5 39.5L50 44L48.5 39.5L44 38L48.5 36.5Z" fill="currentColor" opacity="0.7" />
      {/* Ground line */}
      <line x1="14" y1="80" x2="86" y2="80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function EventEditorialSvg({ id, className }: { id: EventTypeId; className?: string | undefined }) {
  switch (id) {
    case "wedding":
      return <WeddingIcon className={className} />;
    case "anniversary":
      return <AnniversaryIcon className={className} />;
    case "birthday":
      return <BirthdayIcon className={className} />;
    case "bbq":
      return <BbqIcon className={className} />;
    case "family":
      return <FamilyIcon className={className} />;
    case "corporate":
      return <CorporateIcon className={className} />;
    case "hybrid":
      return <HybridIcon className={className} />;
    case "custom":
      return <CustomIcon className={className} />;
    default:
      return null;
  }
}
