import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, BrandLockup, Button } from "../index";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [
    { title: "Book Your Celebration — Bondz Events" },
    { name: "description", content: "Begin planning a one-of-a-kind celebration with Mr. Bondz." },
    { property: "og:title", content: "Book Your Celebration — Bondz Events" },
    { property: "og:description", content: "Begin planning a one-of-a-kind celebration with Mr. Bondz." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: BookingIntro,
});

function BookingIntro() {
  return <AppShell header={<header className="border-b border-hairline px-5 py-4 sm:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><Link to="/" aria-label="Bondz Events home"><BrandLockup size="sm" className="w-28 sm:w-36" /></Link><span className="text-xs font-bold uppercase text-subtle">Booking / 01</span></div></header>}>
    <div className="mx-auto flex min-h-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8"><span className="mb-6 text-xs font-extrabold uppercase text-primary">Your celebration starts here</span><h1 className="max-w-3xl font-serif text-5xl leading-tight text-ink sm:text-7xl">The next chapter is <em className="text-primary">taking shape.</em></h1><p className="mt-6 max-w-lg text-base leading-relaxed text-subtle">The full booking experience is coming next. For now, explore the Bondz Events landing page.</p><Link to="/" className="mt-9 w-fit"><Button variant="dark">← Back to home</Button></Link></div>
  </AppShell>;
}