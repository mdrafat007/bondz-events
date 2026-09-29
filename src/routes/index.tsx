import { createFileRoute } from "@tanstack/react-router";
import { AppShell, SiteFooter } from "../index";
import { MarketingNav } from "../components/layout/MarketingNav";
import { HeroBookingCTA } from "../components/site/HeroBookingCTA";
import { ConnectAIAssistant } from "../components/site/ConnectAIAssistant";
import { useBookingLaunch } from "../lib/use-booking-launch";
import dinner from "../assets/photography/celebration-dinner.jpg";
import amira from "../assets/photography/amira.asset.json";
import jonah from "../assets/photography/jonah.asset.json";
import priya from "../assets/photography/priya.asset.json";
import lena from "../assets/photography/lena.asset.json";
import marcus from "../assets/photography/marcus.asset.json";
import tolu from "../assets/photography/tolu.asset.json";
import sara from "../assets/photography/sara.asset.json";
import hannah from "../assets/photography/hannah.asset.json";
import omar from "../assets/photography/omar.asset.json";

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
  { number: "01", title: "Curated availability" },
  { number: "02", title: "Real-time sync" },
  { number: "03", title: "One simple sitting" },
  { number: "04", title: "360° notification confirmation" },
];

// Managed portraits are served by the public preview host, not by the local Vite server.
const portraitUrl = (path: string) => `https://id-preview--b05e6b12-3dde-49e9-ac29-9053c6b86cea.lovable.app${path}`;
const reviews = [
  { name: "Amira K.", tag: "Wedding — 90", quote: "I booked a 90-person wedding on my lunch break. My mom still doesn't believe me.", avatar: portraitUrl(amira.url) },
  { name: "Jonah R.", tag: "Birthday — 40", quote: "Not one phone call. The DJ texted me before I'd closed the tab.", avatar: portraitUrl(jonah.url) },
  { name: "Priya S.", tag: "Anniversary — 24", quote: "Every date it showed me actually worked. That alone is witchcraft.", avatar: portraitUrl(priya.url) },
  { name: "Lena M.", tag: "Corporate — 140", quote: "Our offsite had caterer, AV and venue confirmed in one sitting.", avatar: portraitUrl(lena.url) },
  { name: "Marcus T.", tag: "BBQ — 60", quote: "Smoke, sun and a long table. Exactly as promised.", avatar: portraitUrl(marcus.url) },
  { name: "Tolu A.", tag: "Hybrid — 110", quote: "The stream was cleaner than our actual meeting room. Remote guests stayed the whole night.", avatar: portraitUrl(tolu.url) },
  { name: "Sara V.", tag: "Birthday — 35", quote: "Bondz was there before the caterer and left after the sweep. Felt like having an older brother who runs festivals.", avatar: portraitUrl(sara.url) },
  { name: "Dev P.", tag: "Anniversary — 50", quote: "We swapped the venue three weeks out. The calendar re-calculated and everything held together.", avatar: portraitUrl(jonah.url) },
  { name: "Hannah L.", tag: "Wedding — 120", quote: "He told our photographer where the sun was going to hit the terrace. Saved the golden hour.", avatar: portraitUrl(hannah.url) },
  { name: "Omar F.", tag: "Corporate — 85", quote: "Zero vendor emails in my inbox. Bondz absorbed the entire logistics blast radius.", avatar: portraitUrl(omar.url) },
];
const partners = [
  { category: "Catering", name: "EMBER & OAK KITCHEN" },
  { category: "Decor", name: "PETAL THEORY" },
  { category: "DJ / Music", name: "DJ NOVA" },
  { category: "Equipment", name: "AURA SOUND" },
  { category: "Venues", name: "SMOKESTACK YARD" },
];

function ReviewMarquee() {
  return <div className="overflow-x-hidden border-b border-hairline py-2 sm:py-2.5" aria-label="Client reviews">
    <div className="ticker-marquee-left">
      {[0, 1].map((copy) => <div key={copy} className="flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4" aria-hidden={copy === 1 ? true : undefined}>{reviews.map((review) => <figure key={review.name} className="flex w-[min(86vw,22rem)] shrink-0 items-center gap-3.5 rounded-2xl border border-review-hairline bg-review px-4 py-2.5 text-white shadow-raised">
        <img src={review.avatar} alt="" loading="lazy" className="size-10 shrink-0 rounded-full border-2 border-primary object-cover" />
        <figcaption className="min-w-0 flex-1"><blockquote className="line-clamp-2 min-h-8 text-[0.78rem] font-medium leading-snug"><span className="font-serif italic text-primary">“</span>{review.quote}<span className="font-serif italic text-primary">”</span></blockquote><div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1"><strong className="font-sans text-[0.72rem] font-extrabold text-primary">{review.name}</strong><span className="rounded-full border border-primary/30 bg-primary/20 px-2 py-0.5 font-sans text-[0.62rem] font-black uppercase leading-tight text-primary">{review.tag}</span></div></figcaption>
      </figure>)}</div>)}
    </div>
  </div>;
}

function PartnerMarquee() {
  return <div className="overflow-x-hidden border-b border-hairline py-1.5 sm:py-2" aria-label="Event partners">
    <div className="ticker-marquee-right">
      {[0, 1].map((copy) => <div key={copy} className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={copy === 1 ? true : undefined}>{partners.map((partner) => <div key={partner.name} className="flex shrink-0 items-center gap-2 rounded-full border border-hairline bg-surface-light px-3.5 py-1 shadow-soft"><span className="font-serif text-xs italic text-primary">{partner.category}</span><span className="font-sans text-xs font-extrabold uppercase tracking-tight text-ink">{partner.name}</span><span className="size-1.5 shrink-0 rounded-full bg-status" aria-label="Available" /></div>)}</div>)}
    </div>
  </div>;
}

function LandingPage() {
  const { launchBooking, launching, curtain } = useBookingLaunch();

  return <AppShell header={<MarketingNav />} footer={<SiteFooter />} canvasClassName="lg:overflow-hidden">
    <div className="flex min-h-full w-full max-w-full flex-col lg:h-full">
      <div className="w-full max-w-full px-4 sm:px-6 md:px-8 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        <section aria-labelledby="hero-title" className="grid min-w-0 grid-cols-1 items-stretch gap-6 pb-4 pt-4 sm:pt-6 lg:min-h-0 lg:flex-[1.65] lg:grid-cols-2 lg:gap-8 lg:py-2.5 xl:py-3.5">
          <div className="flex min-w-0 flex-col justify-between lg:h-full">
            <div className="min-w-0">
              <div className="mb-3 flex w-fit max-w-full items-center gap-2 border-l-2 border-primary pl-3 font-sans text-[0.62rem] font-extrabold uppercase leading-snug tracking-tight text-ink sm:mb-4 sm:text-xs"><span className="hidden sm:inline">Solo Event Organizer · 16 Years · 700+ Celebrations</span><span className="sm:hidden">Solo Organizer · 16 Yrs · 700+ Events</span></div>
              <h1 id="hero-title" className="bondz-hero-title font-sans font-black tracking-tight text-ink [font-variation-settings:'wdth'_85]"><span className="block">Get <span className="font-serif font-normal italic tracking-normal text-primary">“yourself booked”</span></span><span className="block">and{"\n"}Leave the <span className="font-serif font-normal italic tracking-normal text-primary">“rest on us”!</span></span></h1>
            </div>
            <div className="mt-5 flex flex-col items-start sm:mt-6">
              <HeroBookingCTA onClick={launchBooking} disabled={launching} />
              <p className="mt-2.5 max-w-full font-sans text-sm font-black uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85] sm:text-base">Tell us what you're celebrating!</p>
              <div className="mt-1"><ConnectAIAssistant /></div>
            </div>
          </div>
          <div className="min-w-0 lg:flex lg:min-h-0 lg:items-center">
            <div className="relative ml-auto aspect-video max-h-[34vh] w-full overflow-hidden rounded-2xl border border-hairline bg-night shadow-raised lg:max-h-full" aria-label="Dinner celebration at Bondz Events">
              <img src={dinner} alt="Guests raising a toast around a candlelit celebration dinner" width={1536} height={1024} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/25 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-4 pb-5 text-white sm:p-5 sm:pb-6"><span className="font-sans text-[0.6rem] font-extrabold uppercase tracking-wider text-primary sm:text-xs">Live sync network</span><p className="mt-1 max-w-[25ch] font-sans text-[clamp(1rem,2vw,1.5rem)] font-black uppercase leading-tight tracking-tight">How to get booked without a single call</p></div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 w-full bg-primary" aria-hidden="true" />
            </div>
          </div>
        </section>
        <section aria-label="Why book with Bondz Events" className="grid shrink-0 grid-cols-1 gap-4 border-t border-hairline px-1 py-3 sm:grid-cols-2 md:px-4 lg:grid-cols-4 lg:gap-6 lg:px-0 lg:py-2">
          {pillars.map((pillar) => <div key={pillar.number} className="flex min-w-0 items-start gap-3"><span className="shrink-0 font-serif text-xl italic text-primary sm:text-2xl">{pillar.number}</span><h2 className="min-w-0 pt-0.5 font-sans text-xs font-black uppercase leading-tight tracking-tight text-ink sm:text-sm">{pillar.title}</h2></div>)}
        </section>
      </div>
      <section aria-label="Client reviews and event partners" className="mt-2 shrink-0 border-t border-hairline bg-surface sm:mt-4 lg:mt-0"><ReviewMarquee /><PartnerMarquee /></section>
      <div className="mx-auto max-w-7xl px-4 py-8 text-center font-serif text-2xl italic text-ink sm:py-12 sm:text-4xl lg:hidden">Good times, beautifully made<span className="text-primary">.</span></div>
    </div>
    {curtain}
  </AppShell>;
}
