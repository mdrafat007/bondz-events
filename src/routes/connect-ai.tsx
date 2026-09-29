import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { playTapSound, triggerTap } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/connect-ai")({
  head: () => ({
    meta: [
      { title: "Connect Your AI Agent - Bondz Events" },
      {
        name: "description",
        content:
          "Let Claude, ChatGPT, Cursor or any browsing assistant read Mr. Bondz's events, partners and open dates - read-only, no login, no setup.",
      },
      { property: "og:title", content: "Connect Your AI Agent - Bondz Events" },
      {
        property: "og:description",
        content: "Copy one prompt or one link and your assistant can plan a Bondz celebration with you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConnectAIPage,
});

const SITE_URL = "https://bondzevents.lovable.app";
const MCP_URL = `${SITE_URL}/mcp`;

const APPS = [
  {
    name: "Claude",
    steps: ["Open Settings -> Connectors", "Choose “Add custom connector”", "Paste the Bondz link and save"],
  },
  {
    name: "ChatGPT",
    steps: [
      "Open Settings -> Connectors (developer mode)",
      "Create a new connector",
      "Paste the Bondz link, no login needed",
    ],
  },
  {
    name: "Cursor",
    steps: ["Open Settings -> MCP", "Add a new server", "Paste the config below"],
  },
];

const AGENT_PROMPT = `You are helping me book a celebration with Bondz Events (${SITE_URL}).
Mr. Bondz is a Solo Event Organizer. This site currently shows a planning preview using simulated availability, not connected partner calendars or a live payment flow.

Do this:
1. Open ${SITE_URL} and read the pages: /how-it-works, /services, /partners and /portfolios.
2. Open ${SITE_URL}/book and walk through the six steps with me, asking me one question at a time:
   Step 1 celebration type and vibe, Step 2 guest count and whether it is at my place or at a venue,
   Step 3 the services I want, Step 4 a date and time slot that is shown as open,
   Step 5 my details, the agreement and a sample 25% deposit, Step 6 the sample booking summary and invitation.
3. Only suggest dates the site's preview shows as open - never claim those dates are actually reserved.
4. Summarise my choices, the estimated total and the sample 25% deposit.
5. Never enter payment details or claim that payment, calendar holds, or notifications happened. I complete the preview myself.

Ask me what I am celebrating, for how many guests, and roughly when.`;

const CONFIG = JSON.stringify({ mcpServers: { "bondz-events": { url: MCP_URL } } }, null, 2);

function ConnectAIPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, label: string) => {
    triggerTap();
    playTapSound();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(`${label} copied to clipboard`);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Could not copy automatically - please select and copy manually");
    }
  };

  return (
    <div className="scroll-quiet h-full overflow-y-auto overflow-x-hidden px-4 pb-16 pt-6 sm:px-6 sm:pt-8 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header matching local build design system */}
        <header className="min-w-0 border-b border-ink/15 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-serif-i text-3xl italic text-primary sm:text-4xl font-bold">07</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border hairline bg-surface-light px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest text-ink">
              <span className="size-1.5 rounded-full bg-status animate-pulse" />
              Live - Read-Only MCP
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
            Connect your <span className="font-serif-i font-normal italic text-primary">AI agent</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/75 sm:text-base font-medium">
            Let Claude, ChatGPT, Cursor or any assistant that browses the web explore Mr. Bondz's celebrations, partners
            and genuinely open dates with you. It can look - it can never book or pay on your behalf.
          </p>
        </header>

        {/* Section 1: Universal Booking Prompt */}
        <section aria-labelledby="prompt-title" className="mt-8 min-w-0 sm:mt-10">
          <div className="rounded-2xl border hairline bg-surface-light p-6 sm:p-8 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-wider text-primary">
                Universal AI Prompt
              </span>
              <span className="font-mono text-xs text-ink/50">Zero Setup Required</span>
            </div>
            <h2 id="prompt-title" className="mt-3 font-display text-lg sm:text-xl font-black uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
              Booking prompt - works with any AI
            </h2>
            <p className="mt-1 text-xs text-ink/70 sm:text-sm">
              Paste this into any assistant that can browse the web. It walks you through a Bondz booking, one question at a time.
            </p>
            <pre className="scroll-quiet mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border hairline bg-canvas p-4 font-mono text-xs leading-relaxed text-ink shadow-inner">
              {AGENT_PROMPT}
            </pre>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => copy(AGENT_PROMPT, "Prompt")}
                className="rounded-full bg-primary px-5 py-2.5 font-display text-xs font-black uppercase tracking-wider text-white shadow-raised hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
              >
                {copied === "Prompt" ? "Copied ✓" : "Copy prompt →"}
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Quick Link for Connector-Ready Apps */}
        <section aria-labelledby="link-title" className="mt-6 min-w-0">
          <div className="rounded-2xl border hairline bg-surface p-6 sm:p-8">
            <h2 id="link-title" className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
              Quick link for connector-ready apps
            </h2>
            <p className="mt-1 text-xs text-ink/70 sm:text-sm">
              Copy this link and paste it into your AI app's “add connector” screen.
            </p>
            <code className="mt-4 block break-all rounded-xl border hairline bg-surface-light p-3.5 font-mono text-xs sm:text-sm text-ink shadow-inner">
              {MCP_URL}
            </code>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => copy(MCP_URL, "Link")}
                className="rounded-full bg-ink px-5 py-2.5 font-display text-xs font-black uppercase tracking-wider text-canvas hover:bg-ink/90 active:scale-95 transition-all cursor-pointer"
              >
                {copied === "Link" ? "Copied ✓" : "Copy link →"}
              </button>
            </div>
            <p className="mt-3 text-xs text-ink/60 font-medium">
              Then try asking: “Find a Saturday for a 60-guest birthday with catering and a DJ.”
            </p>
          </div>
        </section>

        {/* Section 3: Step by Step per App */}
        <section aria-labelledby="apps-title" className="mt-6 min-w-0">
          <h2 id="apps-title" className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
            Step by step integration
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {APPS.map((app, idx) => (
              <div key={app.name} className="rounded-2xl border hairline bg-surface-light p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="font-display text-sm font-black uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
                    {app.name}
                  </p>
                  <span className="font-serif-i text-sm italic text-primary font-bold">0{idx + 1}</span>
                </div>
                <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-ink/75 font-medium">
                  {app.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Advanced MCP Config File */}
        <section aria-labelledby="advanced-title" className="mt-6 min-w-0 pb-10">
          <div className="rounded-2xl border hairline bg-surface-light p-6 sm:p-8">
            <h2 id="advanced-title" className="font-display text-lg sm:text-xl font-black uppercase tracking-tight text-ink [font-variation-settings:'wdth'_85]">
              Advanced - config file
            </h2>
            <p className="mt-1 text-xs text-ink/70 sm:text-sm">
              For developer apps that read a configuration file. Live tools provided: <b className="text-primary">get_catalog</b> and <b className="text-primary">check_availability</b>.
            </p>
            <pre className="scroll-quiet mt-4 overflow-x-auto rounded-xl border hairline bg-canvas p-4 font-mono text-xs text-ink shadow-inner">
              {CONFIG}
            </pre>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => copy(CONFIG, "Config")}
                className="rounded-full border hairline bg-surface-light px-5 py-2 font-display text-xs font-black uppercase tracking-wider text-ink hover:border-ink active:scale-95 transition-all cursor-pointer"
              >
                {copied === "Config" ? "Copied ✓" : "Copy config →"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
