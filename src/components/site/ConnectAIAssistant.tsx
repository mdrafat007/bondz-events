import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { motion, type Variants } from "framer-motion";
import { Badge, Button, Card } from "@/design-system/bondz-events---design-system-9e1fdf";
import mascotWhite from "@/assets/mascot-white.png";
import mascotRed from "@/assets/mascot-red.png";
import { useTheme } from "@/lib/theme";
import { playTapSound, triggerTap } from "@/lib/haptics";
import { cn } from "@/lib/utils";

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
3. Only suggest dates the site itself shows as open - never invent availability.
4. Summarise my choices, the total and the 25% deposit before I confirm.
5. Never enter payment details or submit the booking for me. I confirm the final step myself.

Ask me what I am celebrating, for how many guests, and roughly when.`;

export function ConnectAIAssistant({ variant = "outline", className }: { variant?: "outline" | "hero"; className?: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("quick");
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const mascotImg = theme === "dark" ? mascotWhite : mascotRed;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const config = JSON.stringify({ mcpServers: { "bondz-events": { url: MCP_URL } } }, null, 2);
  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); toast.success(`${label} copied`); }
    catch { toast.error("Couldn't copy - select and copy it manually"); }
  };

  const handleOpen = () => {
    playTapSound();
    triggerTap();
    setOpen(true);
  };

  const mascotVariants: Variants = {
    resting: {
      y: 18,
      rotate: 0,
      transition: { y: { duration: 0.28, ease: [0.25, 1, 0.5, 1] } },
    },
    hover: {
      y: -14,
      rotate: [0, 8, 8, 0],
      transition: {
        y: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
        rotate: { times: [0, 0.45, 0.75, 1], duration: 0.48, ease: "easeInOut" },
      },
    },
  };

  return (
    <>
      {variant === "hero" ? (
        <div
          className={cn(
            "relative inline-flex flex-col items-center justify-end overflow-visible select-none cursor-pointer group w-full sm:w-auto",
            className
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
          aria-label="Connect your AI agent"
        >
          {/* Peeking Mascot Hair Behind Button */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-visible [clip-path:inset(-400px_-100px_0px_-100px)]"
            aria-hidden="true"
          >
            <motion.div
              initial="resting"
              animate={isHovered ? "hover" : "resting"}
              variants={mascotVariants}
              className="flex items-center justify-center origin-bottom"
            >
              <img
                src={mascotImg}
                alt="Mr. Bondz mascot"
                className="w-24 xs:w-28 sm:w-36 h-auto max-w-none select-none object-contain drop-shadow-md"
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Luxury Red Pill Button */}
          <motion.div
            className="relative z-10 flex w-full sm:w-auto items-center justify-between gap-3 sm:gap-5 rounded-full bg-gradient-to-b from-[#f55248] via-[#ee4339] to-[#de3429] px-4 xs:px-6 sm:px-8 py-3 sm:py-4 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.18),0_12px_32px_rgba(241,69,59,0.36)] ring-1 ring-white/20 ring-inset overflow-hidden"
            animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="relative z-20 font-display text-[clamp(0.74rem,2.8vw,1.10rem)] font-black uppercase tracking-wide text-white whitespace-nowrap [font-variation-settings:'wdth'_85] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.45)] pointer-events-none">
              ✦ CONNECT YOUR AI AGENT
            </span>

            {/* Tactile Circular White Badge Pill */}
            <span className="relative z-10 flex size-8 xs:size-9 sm:size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-white to-[#fbf8f5] text-[#f1453b] shadow-[0_3px_10px_rgba(0,0,0,0.22),inset_0_1.5px_1px_rgba(255,255,255,0.95)] ring-1 ring-black/10 pointer-events-none">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 sm:size-5 text-[#f1453b] drop-shadow-xs transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <line x1="3.5" y1="12" x2="20.5" y2="12" />
                <polyline points="13.5 5 20.5 12 13.5 19" />
              </svg>
            </span>
          </motion.div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="bondz-ai-link inline-flex max-w-full shrink-0 cursor-pointer items-center gap-2 rounded-full border border-ink/25 bg-surface-light px-5 py-3 text-left font-sans text-xs font-black uppercase tracking-tight text-ink shadow-soft hover:border-ink hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:whitespace-nowrap sm:text-sm"
        >
          ✦ Connect your AI agent →
        </button>
      )}


      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-night/60 p-0 backdrop-blur-xs sm:items-center sm:p-4" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="ai-connect-title" className="flex max-h-dvh w-full max-w-lg flex-col overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Card variant="elevated">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <Badge variant="accent">● Live · read-only</Badge>
                  <h2 id="ai-connect-title" className="mt-2 font-serif text-2xl italic text-ink sm:text-3xl">Connect your AI agent</h2>
                  <p className="mt-1 text-xs text-subtle sm:text-sm">Let Claude, ChatGPT or Cursor browse Mr. Bondz's events, partners and open dates for you. It can look, never book or pay.</p>
                </div>
                <Button variant="outline" size="icon" aria-label="Close" onClick={() => setOpen(false)}>✕</Button>
              </div>

              <div className="scroll-quiet mt-4 max-h-dvh min-h-0 overflow-y-auto">
                <section className="rounded-card border border-hairline bg-surface-light p-3 sm:p-4">
                  <Badge variant="accent">Works with any AI</Badge>
                  <h3 className="mt-2 font-sans text-sm font-black uppercase tracking-tight text-ink">Booking prompt - no setup needed</h3>
                  <p className="mt-1 text-xs text-subtle">Paste this into any assistant that can browse the web. It guides you through a Bondz booking step by step.</p>
                  <pre className="scroll-quiet mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-control border border-hairline bg-canvas p-3 font-mono text-xs leading-relaxed text-ink">{AGENT_PROMPT}</pre>
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
