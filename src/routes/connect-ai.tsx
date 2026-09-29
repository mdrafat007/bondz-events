import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, Badge, Button, Card } from "../index";
import { MarketingNav } from "../components/layout/MarketingNav";
import { SiteFooter } from "../components/layout/SiteFooter";

export const Route = createFileRoute("/connect-ai")({
  head: () => ({ meta: [
    { title: "Connect Your AI Agent — Bondz Events" },
    { name: "description", content: "Let Claude, ChatGPT, Cursor or any browsing assistant read Mr. Bondz's events, partners and open dates — read-only, no login, no setup." },
    { property: "og:title", content: "Connect Your AI Agent — Bondz Events" },
    { property: "og:description", content: "Copy one prompt or one link and your assistant can plan a Bondz celebration with you." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: ConnectAIPage,
});

const SITE_URL = "https://bondzevents.lovable.app";
const MCP_URL = `${SITE_URL}/mcp`;

const APPS = [
  { name: "Claude", steps: ["Open Settings → Connectors", "Choose “Add custom connector”", "Paste the Bondz link and save"] },
  { name: "ChatGPT", steps: ["Open Settings → Connectors (developer mode)", "Create a new connector", "Paste the Bondz link, no login needed"] },
  { name: "Cursor", steps: ["Open Settings → MCP", "Add a new server", "Paste the config below"] },
];

const AGENT_PROMPT = `You are helping me book a celebration with Bondz Events (${SITE_URL}).
Mr. Bondz is a solo event organizer who confirms himself, the venue and every partner for the same date, so I never have to call anyone.

Do this:
1. Open ${SITE_URL} and read the pages: /how-it-works, /services, /partners and /portfolios.
2. Open ${SITE_URL}/book and walk through the six steps with me, asking me one question at a time:
   Step 1 celebration type and vibe, Step 2 guest count and whether it is at my place or at a venue,
   Step 3 the services I want, Step 4 a date and time slot that is shown as open,
   Step 5 my details, the agreement and the 25% deposit, Step 6 my confirmation and invitations.
3. Only suggest dates the site itself shows as open — never invent availability.
4. Summarise my choices, the total and the 25% deposit before I confirm.
5. Never enter payment details or submit the booking for me. I confirm the final step myself.

Ask me what I am celebrating, for how many guests, and roughly when.`;

const CONFIG = JSON.stringify({ mcpServers: { "bondz-events": { url: MCP_URL } } }, null, 2);

function ConnectAIPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(`${label} copied`);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Couldn't copy — select and copy it manually");
    }
  };

  return <AppShell header={<MarketingNav active="/connect-ai" />} footer={<SiteFooter />}>
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10 md:px-8">
      <header className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-serif text-2xl italic text-primary sm:text-3xl">07</span>
          <Badge variant="accent">● Live · read-only</Badge>
        </div>
        <h1 className="mt-2 font-sans text-3xl font-black uppercase leading-none tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Connect your <span className="font-serif font-normal italic tracking-normal text-primary">AI agent</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-subtle sm:text-base">
          Let Claude, ChatGPT, Cursor or any assistant that browses the web explore Mr. Bondz's celebrations, partners and genuinely open dates with you. It can look — it can never book or pay on your behalf.
        </p>
      </header>

      <section aria-labelledby="prompt-title" className="mt-8 min-w-0 sm:mt-10">
        <Card variant="elevated">
          <Badge variant="accent">Works with any AI</Badge>
          <h2 id="prompt-title" className="mt-2 font-sans text-sm font-black uppercase tracking-tight text-ink sm:text-base">Booking prompt — no setup needed</h2>
          <p className="mt-1 text-xs text-subtle sm:text-sm">Paste this into any assistant that can browse the web. It walks you through a Bondz booking, one question at a time.</p>
          <pre className="scroll-quiet mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-control border border-hairline bg-canvas p-3 font-mono text-xs leading-relaxed text-ink sm:p-4">{AGENT_PROMPT}</pre>
          <div className="mt-3"><Button size="sm" onClick={() => copy(AGENT_PROMPT, "Prompt")}>{copied === "Prompt" ? "Copied ✓" : "Copy prompt"}</Button></div>
        </Card>
      </section>

      <section aria-labelledby="link-title" className="mt-6 min-w-0">
        <Card>
          <h2 id="link-title" className="font-sans text-sm font-black uppercase tracking-tight text-ink sm:text-base">Quick link for connector-ready apps</h2>
          <p className="mt-1 text-xs text-subtle sm:text-sm">Copy this and paste it into your AI app's “add connector” screen.</p>
          <code className="mt-3 block break-all rounded-control border border-hairline bg-surface-light p-3 font-mono text-xs text-ink sm:text-sm">{MCP_URL}</code>
          <div className="mt-3"><Button size="sm" onClick={() => copy(MCP_URL, "Link")}>{copied === "Link" ? "Copied ✓" : "Copy link"}</Button></div>
          <p className="mt-3 text-xs text-subtle">Then try: “Find a Saturday for a 60-guest birthday with catering and a DJ.”</p>
        </Card>
      </section>

      <section aria-labelledby="apps-title" className="mt-6 min-w-0">
        <h2 id="apps-title" className="font-sans text-sm font-black uppercase tracking-tight text-ink sm:text-base">Step by step</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {APPS.map((app) => <Card key={app.name}>
            <p className="font-sans text-sm font-black uppercase tracking-tight text-ink">{app.name}</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-subtle">{app.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          </Card>)}
        </div>
      </section>

      <section aria-labelledby="advanced-title" className="mt-6 min-w-0">
        <Card>
          <h2 id="advanced-title" className="font-sans text-sm font-black uppercase tracking-tight text-ink sm:text-base">Advanced — config file</h2>
          <p className="mt-1 text-xs text-subtle sm:text-sm">For apps that read a config file. Available tools: <b className="text-ink">get_catalog</b> and <b className="text-ink">check_availability</b>.</p>
          <pre className="scroll-quiet mt-3 overflow-x-auto rounded-control border border-hairline bg-surface-light p-3 font-mono text-xs text-ink sm:p-4">{CONFIG}</pre>
          <div className="mt-3"><Button size="sm" variant="outline" onClick={() => copy(CONFIG, "Config")}>{copied === "Config" ? "Copied ✓" : "Copy config"}</Button></div>
        </Card>
      </section>
    </div>
  </AppShell>;
}
