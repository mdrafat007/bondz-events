import type { SVGProps } from "react";
import type { EventTypeId } from "@/lib/bondz-data";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 100 100", fill: "none", xmlns: "http://www.w3.org/2000/svg" } as const;
const RED = "#f1453b";

export function WeddingIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <path d="M22 84V44C22 28.5 34.5 16 50 16C65.5 16 78 28.5 78 44V84" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 84V46C28 33.8 37.8 24 50 24C62.2 24 72 33.8 72 46V84" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="43" cy="58" r="14" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="57" cy="58" r="14" stroke="currentColor" strokeWidth="2.2" />
      <path d="M43 40L47 44L43 48L39 44Z" fill={RED} stroke={RED} strokeWidth="1" />
      <line x1="43" y1="36" x2="43" y2="39" stroke={RED} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M50 8L51.5 12.5L56 14L51.5 15.5L50 20L48.5 15.5L44 14L48.5 12.5Z" fill={RED} />
      <circle cx="70" cy="30" r="1.5" fill={RED} />
      <circle cx="30" cy="30" r="1.5" fill={RED} />
    </svg>
  );
}

export function AnniversaryIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="20" y1="84" x2="80" y2="84" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      <path d="M38 32L34 52C34 58 39 63 45 63H47V78H39V82H55V78H47V63" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M62 32L66 52C66 58 61 63 55 63H53V78H61V82H45V78H53V63" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M35 44C38 45 42 45 45 44" stroke={RED} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M65 44C62 45 58 45 55 44" stroke={RED} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M50 24L52 29L57 31L52 33L50 38L48 33L43 31L48 29Z" fill={RED} />
      <circle cx="40" cy="38" r="1.5" fill={RED} />
      <circle cx="60" cy="38" r="1.5" fill={RED} />
      <circle cx="48" cy="18" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="53" cy="15" r="1.8" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function BirthdayIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <rect x="25" y="58" width="50" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M25 66C31 69 37 63 43 66C49 69 55 63 61 66C67 69 71 64 75 66" stroke={RED} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="34" y="40" width="32" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M34 46C38 48 42 44 46 46C50 48 54 44 58 46C62 48 64 45 66 46" stroke={RED} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="50" y1="28" x2="50" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 17C47 22 48 25 50 27C52 25 53 22 50 17Z" fill={RED} />
      <path d="M20 34L21.5 37.5L25 39L21.5 40.5L20 44L18.5 40.5L15 39L18.5 37.5Z" fill={RED} opacity="0.8" />
      <path d="M78 30L79.5 33.5L83 35L79.5 36.5L78 40L76.5 36.5L73 35L76.5 33.5Z" fill={RED} opacity="0.8" />
      <circle cx="30" cy="22" r="1.5" fill={RED} />
      <circle cx="70" cy="20" r="1.5" fill={RED} />
    </svg>
  );
}

export function BbqIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="22" y1="86" x2="78" y2="86" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      <line x1="38" y1="58" x2="28" y2="86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="58" x2="72" y2="86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="58" x2="50" y2="86" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      <path d="M24 48C24 64 35 68 50 68C65 68 76 64 76 48H24Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="22" y="45" width="56" height="4" rx="1.5" stroke={RED} strokeWidth="1.8" fill="currentColor" fillOpacity="0.05" />
      <path d="M26 38C26 24 37 18 50 18C63 18 74 24 74 38H26Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M44 18V13H56V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M46 44C44 41 45 39 48 37C49 39 52 40 50 44" stroke={RED} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M54 44C52 41 53 38 56 36C57 39 60 40 58 44" stroke={RED} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="50" cy="56" r="2" fill={RED} />
      <circle cx="42" cy="54" r="1.5" fill={RED} />
      <circle cx="58" cy="54" r="1.5" fill={RED} />
    </svg>
  );
}

export function FamilyIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="50" y1="12" x2="50" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 32C40 26 44 24 50 24C56 24 60 26 60 32H40Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M46 32L50 36L54 32" stroke={RED} strokeWidth="1.5" />
      <line x1="16" y1="62" x2="84" y2="62" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="22" y1="62" x2="22" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="78" y1="62" x2="78" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="84" x2="82" y2="84" stroke="currentColor" strokeWidth="1.4" opacity="0.3" />
      <path d="M47 62V54H53V62H47Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="48" r="4" fill={RED} />
      <ellipse cx="32" cy="59" rx="5" ry="2" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="68" cy="59" rx="5" ry="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="24" y1="52" x2="24" y2="58" stroke={RED} strokeWidth="1.4" />
      <line x1="76" y1="52" x2="76" y2="58" stroke={RED} strokeWidth="1.4" />
    </svg>
  );
}

export function CorporateIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <rect x="22" y="26" width="16" height="58" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      <rect x="62" y="20" width="16" height="64" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      <line x1="26" y1="36" x2="34" y2="36" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="26" y1="46" x2="34" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="66" y1="32" x2="74" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="66" y1="42" x2="74" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <rect x="36" y="32" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M40 44L46 38L52 42L60 36" stroke={RED} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M45 84L47 58H53L55 84H45Z" stroke="currentColor" strokeWidth="1.8" />
      <rect x="43" y="55" width="14" height="4" rx="1" fill={RED} />
      <line x1="50" y1="55" x2="52" y2="50" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="52" cy="49" r="1.5" fill={RED} />
    </svg>
  );
}

export function HybridIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <rect x="24" y="38" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M48 42L60 34V60L48 52V42Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="36" cy="47" r="5" stroke={RED} strokeWidth="1.8" />
      <circle cx="36" cy="47" r="2" fill={RED} />
      <line x1="36" y1="56" x2="26" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="56" x2="46" y2="84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="56" x2="36" y2="84" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="30" cy="33" r="2" fill={RED} />
      <path d="M66 38C70 43 70 51 66 56" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M72 32C78 40 78 54 72 62" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 3" />
      <path d="M78 26C86 37 86 59 78 70" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function CustomIcon(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.04" />
      <line x1="16" y1="84" x2="84" y2="84" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      <line x1="50" y1="16" x2="50" y2="84" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      <circle cx="50" cy="24" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="24" r="2" fill={RED} />
      <line x1="47" y1="28" x2="28" y2="76" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="53" y1="28" x2="72" y2="76" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="37" y1="52" x2="63" y2="52" stroke={RED} strokeWidth="1.8" />
      <circle cx="50" cy="52" r="3" fill="currentColor" />
      <circle cx="28" cy="77" r="1.5" fill={RED} />
      <polygon points="70,74 74,74 72,80" fill={RED} />
      <path d="M28 76C42 66 58 66 72 76" stroke={RED} strokeWidth="1.4" strokeDasharray="2 3" />
      <path d="M78 22L79.5 25.5L83 27L79.5 28.5L78 32L76.5 28.5L73 27L76.5 25.5Z" fill={RED} />
    </svg>
  );
}

export const EVENT_SVGS: Record<EventTypeId, (props: P) => JSX.Element> = {
  wedding: WeddingIcon,
  anniversary: AnniversaryIcon,
  birthday: BirthdayIcon,
  bbq: BbqIcon,
  family: FamilyIcon,
  corporate: CorporateIcon,
  hybrid: HybridIcon,
  custom: CustomIcon,
};

export function HomeEditorialSvg(props: P) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="80" r="64" fill="currentColor" fillOpacity="0.05" />
      <line x1="16" y1="138" x2="144" y2="138" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="28" y1="144" x2="132" y2="144" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />
      <path d="M40 138V66L80 34L120 66V138H40Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M34 69L80 32L126 69" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="52" r="7" stroke="currentColor" strokeWidth="1.8" />
      <line x1="80" y1="45" x2="80" y2="59" stroke="currentColor" strokeWidth="1.2" />
      <line x1="73" y1="52" x2="87" y2="52" stroke="currentColor" strokeWidth="1.2" />
      <rect x="52" y="74" width="16" height="24" rx="8" stroke="currentColor" strokeWidth="1.8" />
      <line x1="52" y1="84" x2="68" y2="84" stroke="currentColor" strokeWidth="1.2" />
      <line x1="60" y1="74" x2="60" y2="98" stroke="currentColor" strokeWidth="1.2" />
      <rect x="92" y="74" width="16" height="24" rx="8" stroke="currentColor" strokeWidth="1.8" />
      <line x1="92" y1="84" x2="108" y2="84" stroke="currentColor" strokeWidth="1.2" />
      <line x1="100" y1="74" x2="100" y2="98" stroke="currentColor" strokeWidth="1.2" />
      <path d="M70 138V110C70 105.5 73.5 102 78 102H82C86.5 102 90 105.5 90 110V138H70Z" stroke="currentColor" strokeWidth="2" />
      <path d="M66 102H94" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <circle cx="76" cy="122" r="1.5" fill={RED} />
      <rect x="49" y="112" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="99" y="112" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="95" r="2" fill={RED} />
      <path d="M26 44L28 38L34 36L28 34L26 28L24 34L18 36L24 38L26 44Z" fill={RED} opacity="0.8" />
      <path d="M136 50L137.5 45L142 43.5L137.5 42L136 37L134.5 42L130 43.5L134.5 45L136 50Z" fill={RED} opacity="0.6" />
    </svg>
  );
}

export function VenueEditorialSvg(props: P) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="80" r="64" fill="currentColor" fillOpacity="0.05" />
      <line x1="14" y1="138" x2="146" y2="138" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
      <line x1="22" y1="143" x2="138" y2="143" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.3" />
      <line x1="32" y1="148" x2="128" y2="148" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.15" />
      <path d="M30 68C30 40 52 24 80 24C108 24 130 40 130 68" stroke={RED} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 68C42 46 59 34 80 34C101 34 118 46 118 68" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
      <rect x="24" y="68" width="112" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
      <line x1="20" y1="68" x2="140" y2="68" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      <rect x="34" y="76" width="10" height="62" stroke="currentColor" strokeWidth="1.8" />
      <line x1="39" y1="78" x2="39" y2="136" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="58" y="76" width="10" height="62" stroke="currentColor" strokeWidth="1.8" />
      <line x1="63" y1="78" x2="63" y2="136" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="92" y="76" width="10" height="62" stroke="currentColor" strokeWidth="1.8" />
      <line x1="97" y1="78" x2="97" y2="136" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <rect x="116" y="76" width="10" height="62" stroke="currentColor" strokeWidth="1.8" />
      <line x1="121" y1="78" x2="121" y2="136" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M72 138V98C72 93 75.5 89 80 89C84.5 89 88 93 88 98V138" stroke={RED} strokeWidth="2" />
      <line x1="80" y1="68" x2="80" y2="82" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="80" cy="84" r="2.5" fill={RED} />
      <line x1="80" y1="24" x2="80" y2="68" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <line x1="56" y1="31" x2="68" y2="68" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <line x1="104" y1="31" x2="92" y2="68" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <path d="M142 34L144 28L150 26L144 24L142 18L140 24L134 26L140 28L142 34Z" fill={RED} opacity="0.8" />
    </svg>
  );
}
