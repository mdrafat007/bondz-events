import { SiteNav } from "@/design-system/bondz-events---design-system-9e1fdf";
import { useBookingLaunch } from "../../lib/use-booking-launch";

const items = [
  { label: "Get a Booking", href: "/book" },
  { label: "Who is Mr. Bondz", href: "/how-it-works" },
  { label: "Events Gallery", href: "/portfolios" },
  { label: "Event Services", href: "/services" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export function MarketingNav({ active }: { active?: string }) {
  const { launchBooking, curtain } = useBookingLaunch();
  return <><SiteNav items={items.map((item) => ({ ...item, active: item.href === active }))} onNavigate={(event, item) => {
    if (item.href === "/book" && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      launchBooking();
    }
  }} />{curtain}</>;
}