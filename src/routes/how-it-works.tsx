import { createFileRoute } from "@tanstack/react-router";
import { HoldingPage } from "../components/layout/HoldingPage";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ meta: [
    { title: "Who Is Mr. Bondz — Bondz Events" },
    { name: "description", content: "Meet Mr. Bondz, the solo event organizer behind over 700 celebrations." },
    { property: "og:title", content: "Who Is Mr. Bondz — Bondz Events" },
    { property: "og:description", content: "Meet Mr. Bondz, the solo event organizer behind over 700 celebrations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HoldingPage path="/how-it-works" eyebrow="The person behind it all" title="Who is Mr. Bondz?" description="Sixteen years, more than 700 celebrations, and one dedicated organizer. The full story is coming soon." />,
});