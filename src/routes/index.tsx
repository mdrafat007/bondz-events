import { createFileRoute } from "@tanstack/react-router";
import { HeroBookingCTA } from "../components/site/HeroBookingCTA";
import { ActualBookingDemo } from "../components/site/ActualBookingDemo";
import { useBookingLaunch } from "../lib/use-booking-launch";
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
  head: () => ({
    meta: [
      { title: "Bondz Events - Celebrations, Beautifully Booked" },
      {
        name: "description",
        content:
          "Plan your celebration in one sitting with Mr. Bondz, your solo event organizer with 16 years and 700+ celebrations behind him.",
      },
      { property: "og:title", content: "Bondz Events - Celebrations, Beautifully Booked" },
      {
        property: "og:description",
        content: "One organizer. Every detail considered. Explore a sample celebration with Mr. Bondz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const pillars = [
  { number: "01", title: "Curated availability" },
  { number: "02", title: "Sample date matching" },
  { number: "03", title: "One simple sitting" },
  { number: "04", title: "360° dispatch preview" },
];

// Managed portraits are served by the public preview host
const portraitUrl = (path: string) => `https://id-preview--b05e6b12-3dde-49e9-ac29-9053c6b86cea.lovable.app${path}`;

const reviews = [
  { name: "Amira K.", tag: "Wedding - 90", quote: "I booked a 90-person wedding on my lunch break. My mom still doesn't believe me.", avatar: portraitUrl(amira.url) },
  { name: "Jonah R.", tag: "Birthday - 40", quote: "Not one phone call. The DJ texted me before I'd closed the tab.", avatar: portraitUrl(jonah.url) },
  { name: "Priya S.", tag: "Anniversary - 24", quote: "Every date it showed me actually worked. That alone is witchcraft.", avatar: portraitUrl(priya.url) },
  { name: "Lena M.", tag: "Corporate - 140", quote: "Our offsite had caterer, AV and venue confirmed in one sitting.", avatar: portraitUrl(lena.url) },
  { name: "Marcus T.", tag: "BBQ - 60", quote: "Smoke, sun and a long table. Exactly as promised.", avatar: portraitUrl(marcus.url) },
  { name: "Tolu A.", tag: "Hybrid - 110", quote: "The stream was cleaner than our actual meeting room. Remote guests stayed the whole night.", avatar: portraitUrl(tolu.url) },
  { name: "Sara V.", tag: "Birthday - 35", quote: "Bondz was there before the caterer and left after the sweep. Felt like having an older brother who runs festivals.", avatar: portraitUrl(sara.url) },
  { name: "Dev P.", tag: "Anniversary - 50", quote: "We swapped the venue three weeks out. The calendar re-calculated and everything held together.", avatar: portraitUrl(jonah.url) },
  { name: "Hannah L.", tag: "Wedding - 120", quote: "He told our photographer where the sun was going to hit the terrace. Saved the golden hour.", avatar: portraitUrl(hannah.url) },
  { name: "Omar F.", tag: "Corporate - 85", quote: "Zero vendor emails in my inbox. Bondz absorbed the entire logistics blast radius.", avatar: portraitUrl(omar.url) },
];

const partners = [
  { category: "Catering", name: "EMBER & OAK KITCHEN" },
  { category: "Decor", name: "PETAL THEORY" },
  { category: "DJ / Music", name: "DJ NOVA" },
  { category: "Equipment", name: "AURA SOUND" },
  { category: "Venues", name: "SMOKESTACK YARD" },
];

function ReviewMarquee() {
  return (
    <div className="overflow-x-hidden border-b border-hairline py-2 sm:py-2.5" aria-label="Client reviews">
      <div className="ticker-marquee-left">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {reviews.map((review) => (
              <figure
                key={review.name}
                className="flex w-[min(86vw,22rem)] shrink-0 items-center gap-3.5 rounded-2xl border border-review-hairline bg-review px-4 py-2.5 text-white shadow-raised"
              >
                <img
                  src={review.avatar}
                  alt=""
                  loading="lazy"
                  className="size-10 shrink-0 rounded-full border-2 border-primary object-cover"
                />
                <figcaption className="min-w-0 flex-1">
                  <blockquote className="line-clamp-2 min-h-8 text-[0.78rem] font-medium leading-snug">
                    <span className="font-serif italic text-primary">“</span>
                    {review.quote}
                    <span className="font-serif italic text-primary">”</span>
                  </blockquote>
                  <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <strong className="font-sans text-[0.72rem] font-extrabold text-primary">{review.name}</strong>
                    <span className="rounded-full border border-primary/30 bg-primary/20 px-2 py-0.5 font-sans text-[0.62rem] font-black uppercase leading-tight text-primary">
                      {review.tag}
                    </span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerMarquee() {
  return (
    <div className="overflow-x-hidden border-b border-hairline py-1.5 sm:py-2" aria-label="Event partners">
      <div className="ticker-marquee-right">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-3 pr-3"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex shrink-0 items-center gap-2 rounded-full border border-hairline bg-surface-light px-3.5 py-1 shadow-soft"
              >
                <span className="font-serif text-xs italic text-primary">{partner.category}</span>
                <span className="font-sans text-xs font-extrabold uppercase tracking-tight text-ink">{partner.name}</span>
                <span className="size-1.5 shrink-0 rounded-full bg-status" aria-label="Available" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingPage() {
  const { launchBooking, launching } = useBookingLaunch();

  return (
    <div className="scroll-quiet h-full overflow-y-auto overflow-x-hidden lg:overflow-hidden">
      <div className="flex min-h-full w-full max-w-full flex-col lg:h-full">
        <div className="w-full max-w-full px-4 sm:px-6 md:px-8 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
          <section
            aria-labelledby="hero-title"
            className="grid min-w-0 grid-cols-1 items-stretch gap-5 pb-3 pt-4 sm:gap-6 sm:pt-5 lg:min-h-0 lg:flex-[1.65] lg:grid-cols-2 lg:gap-8 lg:py-2 xl:py-3"
          >
            <div className="flex min-w-0 flex-col gap-6 sm:gap-8 lg:h-full lg:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex w-fit max-w-full items-center gap-2 border-l-2 border-primary pl-3 font-sans text-[0.62rem] font-extrabold uppercase leading-snug tracking-tight text-ink sm:mb-4 sm:text-xs">
                  <span>Solo Event Organizer · 16 Years · 700+ Celebrations</span>
                </div>
                <h1
                  id="hero-title"
                  className="bondz-hero-title font-sans font-black tracking-tight text-ink [font-variation-settings:'wdth'_85]"
                >
                  <span className="block whitespace-nowrap">
                    Get <span className="font-serif font-normal italic tracking-normal text-primary">“yourself booked”</span>
                  </span>
                  <span className="block whitespace-nowrap">
                    and Leave the <span className="font-serif font-normal italic tracking-normal text-primary">“rest on us”!</span>
                  </span>
                </h1>
              </div>

              <div className="mt-auto flex w-full max-w-full flex-col items-start gap-4 lg:mt-0">
                <HeroBookingCTA onClick={launchBooking} disabled={launching} />

                {/* Features placed directly under the Booking CTA */}
                <div className="w-full pt-3 sm:pt-4 border-t border-hairline grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {pillars.map((pillar) => (
                    <div key={pillar.number} className="flex items-baseline gap-2 min-w-0">
                      <span className="shrink-0 font-serif text-base sm:text-lg italic font-bold text-primary">
                        {pillar.number}
                      </span>
                      <h2 className="min-w-0 font-sans text-xs font-black uppercase leading-tight text-ink [font-variation-settings:'wdth'_85]">
                        {pillar.title}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:flex lg:min-h-0 lg:items-center">
              <ActualBookingDemo onLaunchBooking={launchBooking} className="w-full" />
            </div>
          </section>
        </div>

        {/* Generous editorial breathing space before client reviews and event partners */}
        <section
          aria-label="Client reviews and event partners"
          className="mt-10 sm:mt-14 lg:mt-16 shrink-0 border-t border-hairline bg-surface"
        >
          <ReviewMarquee />
          <PartnerMarquee />
        </section>
        <div className="mx-auto max-w-7xl px-4 py-6 text-center font-serif text-2xl italic text-ink sm:py-8 sm:text-4xl lg:hidden">
          Good times, beautifully made<span className="text-primary">.</span>
        </div>
      </div>
    </div>
  );
}
