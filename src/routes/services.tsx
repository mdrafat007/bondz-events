import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, SiteFooter, Button } from "../index";
import { MarketingNav } from "../components/layout/MarketingNav";
import { SERVICE_ICONS } from "../components/site/ServiceIcons";
import { SERVICES_11, CATEGORIES, PARTNERS, priceLabel, type ServiceTab } from "../lib/bondz-data";
import { useBookingLaunch } from "../lib/use-booking-launch";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Event Services — Bondz Events" },
    { name: "description", content: "Eleven services across planning, hosting and production — catering, decor, music, lighting, photo, hybrid streaming and the morning-after clean." },
    { property: "og:title", content: "Event Services — Bondz Events" },
    { property: "og:description", content: "Eleven services, one organizer, every partner synced before a date is offered." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ServicesPage,
});

const TABS = ["All", "Plan", "Host", "Produce"] as const;
type Tab = (typeof TABS)[number];

// Indicative pricing comes from the partner roster: the lowest quoted rate per category.
const PRICE_BY_SERVICE: Record<string, string> = {
  "04": cheapest("catering"),
  "05": cheapest("decor"),
  "06": cheapest("dj"),
  "07": cheapest("cleaning"),
  "08": cheapest("photo"),
  "09": cheapest("equipment"),
  "10": cheapest("lighting"),
  "11": cheapest("hybrid"),
};

function cheapest(category: string): string {
  const options = PARTNERS.filter((partner) => partner.category === category);
  const sorted = [...options].sort((a, b) => (a.flat ?? a.perGuest ?? 0) - (b.flat ?? b.perGuest ?? 0));
  return sorted[0] ? `From ${priceLabel(sorted[0])}` : "Quoted per event";
}

const CATEGORY_NOTE: Record<string, string> = {
  "04": CATEGORIES.find((category) => category.id === "catering")!.desc,
  "05": CATEGORIES.find((category) => category.id === "decor")!.desc,
  "06": CATEGORIES.find((category) => category.id === "dj")!.desc,
  "07": CATEGORIES.find((category) => category.id === "cleaning")!.desc,
  "08": CATEGORIES.find((category) => category.id === "photo")!.desc,
  "09": CATEGORIES.find((category) => category.id === "equipment")!.desc,
  "10": CATEGORIES.find((category) => category.id === "lighting")!.desc,
  "11": CATEGORIES.find((category) => category.id === "hybrid")!.desc,
};

function ServicesPage() {
  const [tab, setTab] = useState<Tab>("All");
  const { launchBooking, launching, curtain } = useBookingLaunch();
  const visible = SERVICES_11.filter((service) => tab === "All" || service.tab === (tab as ServiceTab));

  return <AppShell header={<MarketingNav active="/services" />} footer={<SiteFooter className="hidden sm:block" />}>
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 md:px-8">
      <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-widest text-primary">Eleven services</span>
      <h1 className="mt-3 max-w-3xl font-sans text-[clamp(2.1rem,5.4vw,4rem)] font-black uppercase leading-[0.95] tracking-tight text-ink [font-variation-settings:'wdth'_85]">
        Everything your celebration needs<span className="font-serif font-normal italic tracking-normal text-primary">, in one place</span>
      </h1>
      <div role="tablist" aria-label="Filter services" className="scroll-quiet sticky top-0 z-10 -mx-4 mt-8 flex gap-2 overflow-x-auto bg-canvas/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        {TABS.map((item) => <button
          key={item}
          type="button"
          role="tab"
          aria-selected={tab === item}
          onClick={() => setTab(item)}
          className={`shrink-0 rounded-full border px-4 py-2 font-sans text-[0.68rem] font-extrabold uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${tab === item ? "border-primary bg-primary text-surface-light" : "border-hairline bg-surface-light text-subtle hover:text-ink"}`}
        >{item}</button>)}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((service) => {
          const Icon = SERVICE_ICONS[service.no];
          return <article key={service.no} className="flex min-w-0 flex-col rounded-2xl border border-hairline bg-surface-light p-6 shadow-soft transition-shadow hover:shadow-raised">
            <div className="flex items-start justify-between gap-3">
              <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-widest text-primary">{service.no}</span>
              {Icon && <Icon className="size-8 text-ink" aria-hidden="true" />}
            </div>
            <h2 className="mt-4 font-sans text-lg font-black uppercase leading-tight tracking-tight text-ink">{service.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-subtle">{service.tagline}</p>
            {CATEGORY_NOTE[service.no] && <p className="mt-2 text-xs leading-relaxed text-subtle/80">{CATEGORY_NOTE[service.no]}</p>}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
              <span className="font-sans text-[0.68rem] font-extrabold uppercase tracking-widest text-ink">{PRICE_BY_SERVICE[service.no] ?? "Included with Mr. Bondz"}</span>
              <Button variant="outline" size="sm" onClick={launchBooking} disabled={launching}>Book this →</Button>
            </div>
          </article>;
        })}
      </div>
      <p className="mt-8 text-xs text-subtle">Prices are indicative starting rates from our verified partner roster. Your exact total is calculated live as you build your event.</p>
    </div>
    {curtain}
  </AppShell>;
}
