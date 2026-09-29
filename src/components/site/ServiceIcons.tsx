import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ACCENT = "#f1453b";

function Production(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 3h6v2H9z" /><path d="M8 10h8M8 13.5h8M8 17h4" /><circle cx="17" cy="17.5" r="1.6" fill={ACCENT} stroke={ACCENT} /></svg>;
}
function Design(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><circle cx="12" cy="4.5" r="1.8" /><path d="M10.8 6.1 6 20M13.2 6.1 18 20" /><path d="M8.6 13.5h6.8" stroke={ACCENT} /><path d="M6 20c3.6-2.6 8.4-2.6 12 0" stroke={ACCENT} strokeDasharray="1.5 2" /><path d="M9 17.5c1.9-1 4.1-1 6 0" /></svg>;
}
function MediaPr(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M4 10v4a1 1 0 0 0 1 1h3l6 4V5L8 9H5a1 1 0 0 0-1 1Z" /><path d="M17.5 8.5a5 5 0 0 1 0 7M20 6a8.5 8.5 0 0 1 0 12" stroke={ACCENT} /></svg>;
}
function Catering(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M4 16a8 8 0 0 1 16 0" /><path d="M2.5 19h19" /><path d="M12 6v2" /><circle cx="12" cy="5" r="1.3" fill={ACCENT} stroke={ACCENT} /><path d="M7.5 16a4.5 4.5 0 0 1 4.5-4.5" stroke={ACCENT} /></svg>;
}
function Decorations(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M12 5.5c1.6 0 2.6 1 2.6 2.3S13.6 10 12 10s-2.6-.9-2.6-2.2S10.4 5.5 12 5.5Z" /><path d="M15.4 8.6c1.3.8 1.6 2.2 1 3.3-.7 1.1-2.1 1.4-3.4.6M8.6 8.6c-1.3.8-1.6 2.2-1 3.3.7 1.1 2.1 1.4 3.4.6" /><circle cx="12" cy="10.5" r="1.3" fill={ACCENT} stroke={ACCENT} /><path d="M12 12v8" /><path d="M12 16c-1.8 0-3-1-3.4-2.4 1.8-.4 3 .6 3.4 2.4Z" stroke={ACCENT} /></svg>;
}
function MusicDj(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.2" /><circle cx="12" cy="12" r="1" fill={ACCENT} stroke={ACCENT} /><path d="m17.5 6.5-3.3 3.3" stroke={ACCENT} /></svg>;
}
function Cleaning(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M14.5 3.5 10 8" /><path d="M8.4 8.6h4.4l1.4 4.4H7l1.4-4.4Z" stroke={ACCENT} /><path d="M7 13h8l1.6 7.5H5.4L7 13Z" /><path d="M9.6 13.5v7M12.4 13.5v7" /></svg>;
}
function PhotoVideo(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><rect x="3" y="7" width="14" height="11" rx="2" /><path d="m17 12 4-2.8v9.6L17 16" stroke={ACCENT} /><circle cx="9.5" cy="12.5" r="3" /><circle cx="9.5" cy="12.5" r="1" fill={ACCENT} stroke={ACCENT} /><path d="M6 7V5.5h3V7" /></svg>;
}
function Equipment(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><path d="M3 10h18" stroke={ACCENT} /><path d="M4.5 10v-.8a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v.8" /><path d="M6 10.5 4.5 20M18 10.5 19.5 20M9.5 10.5 9 20M14.5 10.5l.5 9.5" /><path d="M5.2 15.5h13.6" opacity="0.45" /></svg>;
}
function LightsSound(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><rect x="8" y="3.5" width="8" height="5" rx="1.5" /><path d="M8.4 8.5 4 20.5h16L15.6 8.5" stroke={ACCENT} /><path d="M10 12.5h4M9 16.5h6" opacity="0.5" /><circle cx="12" cy="6" r="1.2" fill={ACCENT} stroke={ACCENT} /></svg>;
}
function HybridEvents(props: SVGProps<SVGSVGElement>) {
  return <svg {...base} {...props}><rect x="2.5" y="5" width="14" height="10" rx="2" /><path d="M7 18.5h5.5" /><path d="M9.5 15v3.5" /><path d="M18.5 8.5a5 5 0 0 1 0 7M21 6a8.5 8.5 0 0 1 0 12" stroke={ACCENT} /><circle cx="9.5" cy="10" r="1.4" fill={ACCENT} stroke={ACCENT} /></svg>;
}

export const SERVICE_ICONS: Record<string, (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  "01": Production,
  "02": Design,
  "03": MediaPr,
  "04": Catering,
  "05": Decorations,
  "06": MusicDj,
  "07": Cleaning,
  "08": PhotoVideo,
  "09": Equipment,
  "10": LightsSound,
  "11": HybridEvents,
};
