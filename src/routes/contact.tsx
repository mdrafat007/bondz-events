import { createFileRoute } from "@tanstack/react-router";
import { HoldingPage } from "../components/layout/HoldingPage";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact — Bondz Events" },
    { name: "description", content: "Get in touch with Bondz Events about your celebration." },
    { property: "og:title", content: "Contact — Bondz Events" },
    { property: "og:description", content: "Get in touch with Bondz Events about your celebration." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <HoldingPage path="/contact" eyebrow="Start a conversation" title="Get in touch" description="The best celebrations start with a conversation. Our contact page is coming soon." />,
});