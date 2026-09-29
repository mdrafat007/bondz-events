import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Button, SiteFooter } from "../index";
import { MarketingNav } from "../components/layout/MarketingNav";
import { useBookingLaunch } from "../lib/use-booking-launch";
import { playPeekabooSound } from "../design-system/lib/haptics";
import mascot from "../design-system/assets/icons/BONDZ_LOGO_ICON_-_LIGHT.png";
import invitation from "../design-system/assets/templates/BONDZ_EVENTS_INVITE_CARD_-_LIGHT.png";
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
  { number: "01", title: "Curated availability", detail: "Only dates that work for everyone." },
  { number: "02", title: "Real-time sync", detail: "Your plans, all in one place." },
  { number: "03", title: "One simple sitting", detail: "From first idea to booked." },
  { number: "04", title: "360° notification confirmation", detail: "Every partner in the picture." },
];

const reviews = [
  { name: "Amira K.", tag: "Wedding · 90 guests", quote: "I booked a 90-person wedding on my lunch break. My mom still doesn't believe me.", avatar: amira.url },
  { name: "Jonah R.", tag: "Birthday · 40 guests", quote: "Not one phone call. The DJ texted me before I'd closed the tab.", avatar: jonah.url },
  { name: "Priya S.", tag: "Anniversary · 24 guests", quote: "Every date it showed me actually worked. That alone is witchcraft.", avatar: priya.url },
  { name: "Lena M.", tag: "Corporate · 140 guests", quote: "Our offsite had caterer, AV and venue confirmed in one sitting.", avatar: lena.url },
  { name: "Marcus T.", tag: "BBQ · 60 guests", quote: "Smoke, sun and a long table. Exactly as promised.", avatar: marcus.url },
  { name: "Tolu A.", tag: "Hybrid · 110 guests", quote: "The stream was cleaner than our actual meeting room. Remote guests stayed the whole night.", avatar: tolu.url },
  { name: "Sara V.", tag: "Birthday · 35 guests", quote: "Bondz was there before the caterer and left after the sweep. Felt like having an older brother who runs festivals.", avatar: sara.url },
  { name: "Dev P.", tag: "Anniversary · 50 guests", quote: "We swapped the venue three weeks out. The calendar re-calculated and everything held together.", avatar: jonah.url },
  { name: "Hannah L.", tag: "Wedding · 120 guests", quote: "He told our photographer where the sun was going to hit the terrace. Saved the golden hour.", avatar: hannah.url },
  { name: "Omar F.", tag: "Corporate · 85 guests", quote: "Zero vendor emails in my inbox. Bondz absorbed the entire logistics blast radius.", avatar: omar.url },
];
const partners = [
  { category: "Catering", name: "Halal Feast Co." },
  { category: "DJ", name: "DJ Nova" },
  { category: "Decor", name: "Petal Theory" },
  { category: "Lighting", name: "Aura Sound" },
  { category: "Venues", name: "Smokestack Yard" },
  { category: "Venues", name: "The Glasshouse" },
];

function ReviewMarquee() {
  return <div className="overflow-x-hidden border-b border-hairline py-5" aria-label="Client reviews">
    <div className="bondz-marquee flex w-max items-stretch gap-3 sm:gap-4">
      {[0, 1].map((copy) => <div key={copy} className="flex shrink-0 items-stretch gap-3 sm:gap-4" aria-hidden={copy === 1 ? true : undefined}>{reviews.map((review) => <figure key={review.name} className="flex w-[min(78vw,350px)] shrink-0 flex-col justify-between gap-4 rounded-card bg-review p-4 text-paper shadow-raised sm:w-[350px] sm:p-5"><blockquote className="text-sm leading-snug sm:text-base">“{review.quote}”</blockquote><figcaption className="flex items-center gap-3"><img src={review.avatar} alt="" loading="lazy" className="size-10 shrink-0 rounded-full object-cover" /><span className="min-w-0"><strong className="block text-xs font-extrabold uppercase">{review.name}</strong><span className="block text-[0.65rem] text-paper/65">{review.tag}</span></span></figcaption></figure>)}</div>)}
    </div>
  </div>;
}

function PartnerMarquee() {
  return <div className="overflow-x-hidden border-b border-hairline py-4" aria-label="Event partners">
    <div className="bondz-marquee bondz-marquee-reverse flex w-max items-center gap-3">
      {[0, 1].map((copy) => <div key={copy} className="flex shrink-0 items-center gap-3" aria-hidden={copy === 1 ? true : undefined}>{partners.map((partner) => <div key={partner.name} className="flex shrink-0 items-center gap-3 rounded-full border border-hairline bg-canvas px-4 py-2.5"><span className="font-serif text-lg italic text-primary">{partner.category}</span><span className="text-[0.7rem] font-extrabold uppercase text-ink">{partner.name}</span><span className="size-2 rounded-full bg-status" aria-label="Available" /></div>)}</div>)}
    </div>
  </div>;
}

function LandingPage() {
  const { launchBooking, launching, curtain } = useBookingLaunch();

  return <AppShell header={<MarketingNav />} footer={<SiteFooter className="hidden sm:block" />}>
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="hero-title" className="grid min-w-0 items-center gap-8 pb-8 pt-9 sm:pt-12 lg:grid-cols-2 lg:gap-8 lg:py-10 2xl:py-14">
        <div className="min-w-0 lg:pr-4">
          <div className="mb-6 flex w-fit max-w-full items-center gap-2 border-l-2 border-primary pl-3 text-[0.62rem] font-extrabold uppercase leading-snug text-ink sm:mb-8 sm:text-xs"><span className="hidden sm:inline">Solo Event Organizer · 16 Years · 700+ Celebrations</span><span className="sm:hidden">Solo Organizer · 16 Yrs · 700+ Events</span></div>
          <h1 id="hero-title" className="bondz-hero-title max-w-[15ch] font-serif text-ink">Get <em className="font-normal text-primary">‘yourself booked’</em> and Leave the <em className="font-normal text-primary">‘rest on us’!</em></h1>
          <div className="mt-14 flex flex-col items-start gap-4 sm:mt-16">
            <div className="relative isolate pt-3">
              <span aria-hidden="true" className="bondz-mascot-peek pointer-events-none absolute left-[57%] z-10 w-16 -translate-x-1/2 sm:w-20"><img src={mascot} alt="" className="block h-auto w-full" /></span>
              <Button variant="dark" size="lg" onClick={launchBooking} onMouseEnter={playPeekabooSound} onFocus={playPeekabooSound} disabled={launching} className="bondz-hero-cta group relative z-20 min-h-14 gap-6 rounded-full bg-night py-2 pl-6 pr-2 text-sm text-paper shadow-raised hover:bg-night/85 sm:text-base">Get a Booking <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-xl text-paper transition-transform group-hover:rotate-45">↗</span></Button>
            </div>
            <p className="max-w-sm text-sm font-extrabold uppercase leading-relaxed text-ink sm:text-base">Tell us what you're celebrating!</p>
          </div>
        </div>
        <div className="min-w-0">
          <div className="relative aspect-video max-h-[34vh] min-h-0 w-full overflow-hidden border border-hairline bg-night shadow-raised lg:ml-auto" aria-label="Preview of a Bondz Events invitation">
            <div className="absolute inset-0 grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-0">
              <div className="relative min-w-0 overflow-hidden bg-white"><img src={invitation} alt="Bondz Events invitation artwork" className="h-full w-full object-cover object-bottom" /><div className="absolute left-[7%] top-[10%] max-w-[80%] text-night"><span className="text-[0.5rem] font-extrabold uppercase text-primary sm:text-[0.6rem]">The invitation</span><p className="mt-2 font-serif text-[clamp(1.1rem,2.7vw,3rem)] leading-none">A celebration<br /><em>made for you.</em></p></div></div>
              <div className="flex min-w-0 flex-col justify-between bg-night p-[clamp(0.75rem,2vw,2rem)] text-paper"><div className="flex items-start justify-between gap-2"><span className="text-[0.55rem] font-extrabold uppercase text-primary sm:text-xs">A little preview</span><span className="font-serif text-lg italic text-primary sm:text-3xl">B.</span></div><div><p className="font-serif text-[clamp(1.25rem,3vw,3.5rem)] leading-[0.95]">Good things<br />are worth<br /><em className="text-primary">celebrating.</em></p><span className="mt-3 block border-t border-paper/20 pt-2 text-[0.5rem] font-bold uppercase text-paper/70 sm:mt-5 sm:text-[0.65rem]">An occasion, entirely yours ↗</span></div></div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-[0.62rem] font-bold uppercase text-subtle"><span>Made personal by Mr. Bondz</span><span>01 / 04</span></div>
        </div>
      </section>
      <section aria-label="Why book with Bondz Events" className="grid grid-cols-1 gap-2 border-t border-hairline py-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-2.5 lg:py-2">
        {pillars.map((pillar) => <div key={pillar.number} className="flex min-w-0 gap-3 border border-hairline bg-surface p-3 sm:p-5"><span className="shrink-0 font-serif text-2xl italic text-primary sm:text-3xl">{pillar.number}</span><div className="min-w-0"><h2 className="text-xs font-extrabold uppercase leading-snug text-ink sm:text-sm">{pillar.title}</h2><p className="mt-2 text-xs leading-snug text-subtle">{pillar.detail}</p></div></div>)}
      </section>
    </div>
    <section aria-label="Client reviews and event partners" className="mt-6 border-t border-hairline bg-surface sm:mt-9"><ReviewMarquee /><PartnerMarquee /></section>
    <div className="mx-auto max-w-7xl px-4 py-8 text-center font-serif text-2xl italic text-ink sm:py-12 sm:text-4xl">Good times, beautifully made<span className="text-primary">.</span></div>
    {curtain}
  </AppShell>;
}