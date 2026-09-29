import { createFileRoute } from "@tanstack/react-router";
import { HoldingPage } from "../components/layout/HoldingPage";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Event Services — Bondz Events" },
    { name: "description", content: "Explore event services for your celebration with Bondz Events." },
    { property: "og:title", content: "Event Services — Bondz Events" },
    { property: "og:description", content: "Explore event services for your celebration with Bondz Events." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HoldingPage path="/services" eyebrow="Everything in its place" title="Event Services" description="From the venue to the final song, every choice should feel like yours. Our services page is coming soon." />,
});