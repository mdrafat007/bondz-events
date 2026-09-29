import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card } from "@/design-system/bondz-events---design-system-9e1fdf";

type Tab = "quick" | "apps" | "advanced";

const APPS = [
  { name: "Claude", steps: ["Open Settings → Connectors", "Choose “Add custom connector”", "Paste the Bondz link and save"] },
  { name: "ChatGPT", steps: ["Open Settings → Connectors (developer mode)", "Create a new connector", "Paste the Bondz link, no login needed"] },
  { name: "Cursor", steps: ["Open Settings → MCP", "Add a new server", "Paste the config from the Advanced tab"] },
];

export function ConnectAIAssistant() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("quick");
  const [url, setUrl] = useState("/mcp");

  useEffect(() => { setUrl(`${window.location.origin}/mcp`); }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const config = JSON.stringify({ mcpServers: { "bondz-events": { url } } }, null, 2);
  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); toast.success(`${label} copied`); }
    catch { toast.error("Couldn't copy — select and copy it manually"); }
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>✦ Ask your AI assistant</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/60 p-4 backdrop-blur-xs" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="ai-connect-title" className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <Card variant="elevated">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="accent">● Live · read-only</Badge>
                  <h2 id="ai-connect-title" className="mt-2 font-serif text-3xl italic text-ink">Connect your AI assistant</h2>
                  <p className="mt-1 text-sm text-subtle">Let Claude, ChatGPT or Cursor browse Mr. Bondz's events, partners and open dates for you. It can look, never book or pay.</p>
                </div>
                <Button variant="outline" size="icon" aria-label="Close" onClick={() => setOpen(false)}>✕</Button>
              </div>

              <div role="tablist" className="mt-4 flex gap-2">
                {([["quick", "Quick link"], ["apps", "Step by step"], ["advanced", "Advanced"]] as const).map(([id, label]) => (
                  <Button key={id} role="tab" aria-selected={tab === id} size="sm" variant={tab === id ? "dark" : "outline"} onClick={() => setTab(id)}>{label}</Button>
                ))}
              </div>

              <div className="scroll-quiet mt-4 max-h-[50dvh] overflow-y-auto">
                {tab === "quick" && (
                  <div className="space-y-3">
                    <p className="text-sm text-ink">Copy this link and paste it into your AI app's “add connector” screen.</p>
                    <code className="block break-all rounded-control border border-hairline bg-surface-light p-3 font-mono text-sm text-ink">{url}</code>
                    <Button onClick={() => copy(url, "Link")}>Copy link</Button>
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
                    <Button variant="outline" onClick={() => copy(url, "Link")}>Copy Bondz link</Button>
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
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
