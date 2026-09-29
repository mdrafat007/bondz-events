import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell, Button, SiteFooter, SiteNav } from "../index";
import { playPeekabooSound } from "../design-system/lib/haptics";
import mascot from "../design-system/assets/icons/BONDZ_LOGO_ICON_-_LIGHT.png";
import invitation from "../design-system/assets/templates/BONDZ_EVENTS_INVITE_CARD_-_LIGHT.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Bondz Events — Celebrations, Beautifully Booked" },
    { name: "description", content: "Plan your celebration in one sitting with Mr. Bondz, your solo event organizer with 16 years and 700+ celebrations behind him." },
    { property: "og:title", content: "Bondz Events — Celebrations, Beautifully Booked" },
    { property: "og:description", content: "One organizer. Every detail considered. Book a celebration with Mr. Bondz." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: LandingPage,
});

const pillars = [
  { number: "01", title: "Curated availability", detail: "Only dates that work for everyone." },
  { number: "02", title: "Real-time sync", detail: "Your plans, all in one place." },
  { number: "03", title: "One simple sitting", detail: "From first idea to booked." },
  { number: "04", title: "360° confirmation", detail: "Every partner in the picture." },
];

const proofA = ["16 years of celebrations", "700+ celebrations", "One dedicated organizer", "Every detail considered"];
const proofB = ["No multi-vendor phone tag", "A date that works for everyone", "A single, seamless sitting", "By Mr. Bondz"];

function Marquee({ phrases, reverse = false }: { phrases: string[]; reverse?: boolean }) {
  return <div className="overflow-x-hidden border-b border-hairline" aria-label={phrases.join(" · ")}>
    <div aria-hidden="true" className={`bondz-marquee flex w-max items-center py-3.5 ${reverse ? "bondz-marquee-reverse" : ""}`}>
      {[0, 1].map((copy) => <div key={copy} className="flex shrink-0 items-center">{phrases.map((phrase) => <span key={`${copy}-${phrase}`} className="flex items-center gap-4 px-4 text-[0.68rem] font-bold uppercase text-ink sm:gap-8 sm:px-8 sm:text-xs"><span className="font-serif text-xl italic text-primary" aria-hidden="true">✳</span>{phrase}</span>)}</div>)}
    </div>
  </div>;
}

function LandingPage() {
  const navigate = useNavigate();
  const [launching, setLaunching] = useState(false);
  const launchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (launchTimer.current) clearTimeout(launchTimer.current); }, []);

  function launchBooking() {
    if (launching) return;
    setLaunching(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    launchTimer.current = setTimeout(() => { void navigate({ to: "/book", search: { intro: 1 } }); }, reduced ? 0 : 470);
  }

  return <AppShell header={<SiteNav items={[{ label: "Home", href: "/", active: true }, { label: "Design system", href: "/system" }]} />} footer={<SiteFooter className="hidden sm:block" />}>
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="hero-title" className="grid min-w-0 items-center gap-8 pb-8 pt-9 sm:pt-12 lg:grid-cols-2 lg:gap-8 lg:py-10 2xl:py-14">
        <div className="min-w-0 lg:pr-4">
          <div className="mb-6 flex w-fit max-w-full items-center gap-2 border-l-2 border-primary pl-3 text-[0.62rem] font-extrabold uppercase leading-snug text-ink sm:mb-8 sm:text-xs"><span className="hidden sm:inline">Solo Event Organizer · 16 Years · 700+ Celebrations</span><span className="sm:hidden">Solo Organizer · 16 Yrs · 700+ Events</span></div>
          <h1 id="hero-title" className="bondz-hero-title max-w-[14ch] font-serif text-ink">Turn <em className="font-normal text-primary">‘can we book you?’</em> into ‘you’re booked.’</h1>
          <div className="mt-8 flex flex-col items-start gap-4 sm:mt-10">
            <div className="relative isolate pt-3">
              <span aria-hidden="true" className="bondz-mascot-peek pointer-events-none absolute left-[57%] z-10 w-16 -translate-x-1/2 sm:w-20"><img src={mascot} alt="" className="block h-auto w-full" /></span>
              <Button variant="dark" size="lg" onClick={launchBooking} onMouseEnter={playPeekabooSound} onFocus={playPeekabooSound} disabled={launching} className="bondz-hero-cta group relative z-20 min-h-14 gap-6 rounded-full py-2 pl-6 pr-2 text-sm shadow-raised sm:text-base">Get a Booking <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-xl text-surface-light transition-transform group-hover:rotate-45">↗</span></Button>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-subtle sm:text-base">One conversation. One date that works for everyone. A celebration that feels entirely yours.</p>
          </div>
        </div>
        <div className="min-w-0">
          <div className="relative aspect-video max-h-[34vh] min-h-0 w-full overflow-hidden border border-hairline bg-ink shadow-raised lg:ml-auto" aria-label="Preview of a Bondz Events invitation">
            <div className="absolute inset-0 grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-0">
              <div className="relative min-w-0 overflow-hidden bg-surface-light"><img src={invitation} alt="Bondz Events invitation artwork" className="h-full w-full object-cover object-bottom" /></div>
              <div className="flex min-w-0 flex-col justify-between bg-ink p-[clamp(0.75rem,2vw,2rem)] text-canvas"><div className="flex items-start justify-between gap-2"><span className="text-[0.55rem] font-extrabold uppercase text-primary sm:text-xs">A little preview</span><span className="font-serif text-lg italic text-primary sm:text-3xl">B.</span></div><div><p className="font-serif text-[clamp(1.25rem,3vw,3.5rem)] leading-[0.95]">Good things<br />are worth<br /><em className="text-primary">celebrating.</em></p><span className="mt-3 block border-t border-canvas/20 pt-2 text-[0.5rem] font-bold uppercase text-canvas/70 sm:mt-5 sm:text-[0.65rem]">An occasion, entirely yours ↗</span></div></div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[0.62rem] font-bold uppercase text-subtle"><span>Made personal by Mr. Bondz</span><span>01 / 04</span></div>
        </div>
      </section>
      <section aria-label="Why book with Bondz Events" className="grid grid-cols-2 gap-2 border-t border-hairline py-3 lg:grid-cols-4 lg:gap-2.5 lg:py-2">
        {pillars.map((pillar) => <div key={pillar.number} className="min-w-0 border border-hairline bg-surface p-3 sm:p-5"><span className="block font-serif text-lg italic text-primary sm:text-2xl">{pillar.number}</span><h2 className="mt-4 text-[0.68rem] font-extrabold uppercase leading-snug text-ink sm:text-sm">{pillar.title}</h2><p className="mt-2 text-[0.67rem] leading-snug text-subtle sm:text-xs">{pillar.detail}</p></div>)}
      </section>
    </div>
    <section aria-label="Bondz Events at a glance" className="mt-6 border-t border-hairline bg-surface sm:mt-9"><Marquee phrases={proofA} /><Marquee phrases={proofB} reverse /></section>
    <div className="mx-auto max-w-7xl px-4 py-8 text-center font-serif text-2xl italic text-ink sm:py-12 sm:text-4xl">Good times, beautifully made<span className="text-primary">.</span></div>
    {launching && <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true"><div className="bondz-curtain-left absolute inset-y-0 left-0 w-1/2 bg-ink" /><div className="bondz-curtain-right absolute inset-y-0 right-0 w-1/2 bg-ink" /></div>}
  </AppShell>;
}