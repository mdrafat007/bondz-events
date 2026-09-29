import { createFileRoute } from "@tanstack/react-router";
import { HoldingPage } from "../components/layout/HoldingPage";

export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [
    { title: "Event Partners — Bondz Events" },
    { name: "description", content: "Meet the event partners who help bring Bondz celebrations to life." },
    { property: "og:title", content: "Event Partners — Bondz Events" },
    { property: "og:description", content: "Meet the event partners who help bring Bondz celebrations to life." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HoldingPage path="/partners" eyebrow="The people behind the moments" title="Our Partners" description="The right people make all the difference. Meet the full partner circle soon." />,
});