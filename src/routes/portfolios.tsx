import { createFileRoute } from "@tanstack/react-router";
import { HoldingPage } from "../components/layout/HoldingPage";

export const Route = createFileRoute("/portfolios")({
  head: () => ({ meta: [
    { title: "Events Gallery — Bondz Events" },
    { name: "description", content: "Explore celebrations made personal by Mr. Bondz." },
    { property: "og:title", content: "Events Gallery — Bondz Events" },
    { property: "og:description", content: "Explore celebrations made personal by Mr. Bondz." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HoldingPage path="/portfolios" eyebrow="Made personal" title="Events Gallery" description="A look at celebrations shaped around the people who matter. The gallery is coming soon." />,
});