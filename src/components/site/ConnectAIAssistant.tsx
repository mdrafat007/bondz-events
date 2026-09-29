import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card } from "@/design-system/bondz-events---design-system-9e1fdf";

type Tab = "quick" | "apps" | "advanced";

const SITE_URL = "https://bondzevents.lovable.app";
const MCP_URL = `${SITE_URL}/mcp`;

const APPS = [
  { name: "Claude", steps: ["Open Settings → Connectors", "Choose “Add custom connector”", "Paste the Bondz link and save"] },
  { name: "ChatGPT", steps: ["Open Settings → Connectors (developer mode)", "Create a new connector", "Paste the Bondz link, no login needed"] },
  { name: "Cursor", steps: ["Open Settings → MCP", "Add a new server", "Paste the config from the Advanced tab"] },
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

export function ConnectAIAssistant() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("quick");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const config = JSON.stringify({ mcpServers: { "bondz-events": { url: MCP_URL } } }, null, 2);
  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); toast.success(`${label} copied`); }
    catch { toast.error("Couldn't copy — select and copy it manually"); }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bondz-ai-link inline-flex max-w-full shrink-0 origin-left cursor-pointer items-center gap-1.5 text-left font-sans text-xs font-black uppercase tracking-tight text-ink underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:origin-center sm:whitespace-nowrap xl:text-sm [font-variation-settings:'wdth'_85]"
      >
        ✦ Connect your AI agent →
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-night/60 p-0 backdrop-blur-xs sm:items-center sm:p-4" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="ai-connect-title" className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <Card variant="elevated">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <Badge variant="accent">● Live · read-only</Badge>
                  <h2 id="ai-connect-title" className="mt-2 font-serif text-2xl italic text-ink sm:text-3xl">Connect your AI agent</h2>
                  <p className="mt-1 text-xs text-subtle sm:text-sm">Let Claude, ChatGPT or Cursor browse Mr. Bondz's events, partners and open dates for you. It can look, never book or pay.</p>
                </div>
                <Button variant="outline" size="icon" aria-label="Close" onClick={() => setOpen(false)}>✕</Button>
              </div>

              <div className="scroll-quiet mt-4 max-h-[70dvh] overflow-y-auto sm:max-h-[60dvh]">
                <section className="rounded-card border border-hairline bg-surface-light p-3 sm:p-4">
                  <Badge variant="accent">Works with any AI</Badge>
                  <h3 className="mt-2 font-sans text-sm font-black uppercase tracking-tight text-ink">Booking prompt — no setup needed</h3>
                  <p className="mt-1 text-xs text-subtle">Paste this into any assistant that can browse the web. It guides you through a Bondz booking step by step.</p>
                  <pre className="scroll-quiet mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-control border border-hairline bg-canvas p-3 font-mono text-xs leading-relaxed text-ink">{AGENT_PROMPT}</pre>
                  <div className="mt-3"><Button size="sm" onClick={() => copy(AGENT_PROMPT, "Prompt")}>Copy prompt</Button></div>
                </section>

                <div role="tablist" className="mt-4 flex flex-wrap gap-2">
                  {([["quick", "Quick link"], ["apps", "Step by step"], ["advanced", "Advanced"]] as const).map(([id, label]) => (
                    <Button key={id} role="tab" aria-selected={tab === id} size="sm" variant={tab === id ? "dark" : "outline"} onClick={() => setTab(id)}>{label}</Button>
                  ))}
                </div>

                <div className="mt-4">
                  {tab === "quick" && (
                    <div className="space-y-3">
                      <p className="text-sm text-ink">Copy this link and paste it into your AI app's “add connector” screen.</p>
                      <code className="block break-all rounded-control border border-hairline bg-surface-light p-3 font-mono text-xs text-ink sm:text-sm">{MCP_URL}</code>
                      <Button onClick={() => copy(MCP_URL, "Link")}>Copy link</Button>
                      <p className="text-xs text-subtle">Then try: “Find a Saturday for a 60-guest birthday with catering and a DJ.”</p>
                    </div>
                  )}
                  {tab === "apps" && (
                    <div className="space-y-4">
                      {APPS.map((a) => (
                        <div key={a.name} className="border-b border-hairline pb-3">
                          <p className="font-bold text-ink">{a.name}</p>
                          <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-sm text-subtle">{a.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                        </div>
                      ))}
                      <Button variant="outline" onClick={() => copy(MCP_URL, "Link")}>Copy Bondz link</Button>
                    </div>
                  )}
                  {tab === "advanced" && (
                    <div className="space-y-3">
                      <p className="text-sm text-ink">For apps that use a config file. Tools: <b>get_catalog</b>, <b>check_availability</b>.</p>
                      <pre className="overflow-x-auto rounded-control border border-hairline bg-surface-light p-3 font-mono text-xs text-ink">{config}</pre>
                      <Button variant="outline" onClick={() => copy(config, "Config")}>Copy config</Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
