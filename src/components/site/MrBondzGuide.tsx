import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import face from "@/assets/face-dark.png.asset.json";
import { type BotSignal, type Mood } from "@/lib/bot-bus";
import { cn } from "@/lib/utils";
import { playTapSound } from "@/lib/haptics";

const PAGE_GUIDES: Record<string, { title: string; hint: string; cta?: { label: string; to: string } }> = {
  "/": {
    title: "Welcome to Bondz Events",
    hint: "Every date, venue, and partner calendar is checked before you see it. Click below to begin.",
    cta: { label: "Get started →", to: "/book" },
  },
  "/how-it-works": {
    title: "The Zero-Conflict Rule",
    hint: "If a venue, caterer, or DJ isn't 100% available, they never render. No maybe dates.",
    cta: { label: "Try the engine →", to: "/book" },
  },
  "/portfolios": {
    title: "Curated Celebrations",
    hint: "Explore real weddings, birthdays, BBQs, and corporate offsites planned without a single phone call.",
  },
  "/services": {
    title: "11 Boutique Services",
    hint: "Production, catering, decor, DJ, equipment, and cleaning - all orchestrated under one contract.",
  },
  "/partners": {
    title: "Vetted Collective",
    hint: "All 12 partner businesses share live calendar access with Mr. Bondz in real time.",
  },
  "/contact": {
    title: "Personal Inquiry",
    hint: "Have a custom vision or need bespoke coordination? I read and reply to every message personally.",
  },
  "/book": {
    title: "Booking Cockpit",
    hint: "Step through your celebration type, location, and guest count. Live pricing calculates as you click.",
  },
};

export function MrBondzGuide() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const [mood, setMood] = useState<Mood>("idle");
  const [customHint, setCustomHint] = useState<string | null>(null);
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [headNodding, setHeadNodding] = useState(false);
  const moodTimer = useRef<number>(0);

  // Listen to external signals
  useEffect(() => {
    const handleSignal = (e: Event) => {
      const d = (e as CustomEvent<BotSignal>).detail;
      if (d.mood) {
        setMood(d.mood);
        setHeadNodding(true);
        window.clearTimeout(moodTimer.current);
        moodTimer.current = window.setTimeout(() => {
          setMood("idle");
          setHeadNodding(false);
        }, 2200);
      }
      if (d.tip) {
        setCustomHint(d.tip);
        setBubbleOpen(true);
      }
    };
    window.addEventListener("bot-signal", handleSignal);
    return () => window.removeEventListener("bot-signal", handleSignal);
  }, []);

  // Update guide on route change
  useEffect(() => {
    setCustomHint(null);
    setBubbleOpen(true);
    setHeadNodding(true);
    const t = window.setTimeout(() => setHeadNodding(false), 1400);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const guide = PAGE_GUIDES[pathname] ?? {
    title: "Mr. Bondz Guide",
    hint: "Boutique event orchestration. Pick your celebration and see only what can genuinely happen.",
  };

  const currentHint = customHint || guide.hint;

  return (
    <aside aria-label="Mr. Bondz Action Guide" className="fixed bottom-4 right-4 z-50 flex items-end gap-3 select-none pointer-events-none">
      {/* Reaction Speech Bubble */}
      {bubbleOpen && (
        <div
          className={cn(
            "pointer-events-auto relative max-w-[18rem] rounded-2xl border hairline bg-surface-light p-3.5 shadow-xl transition-all duration-300 sm:max-w-xs",
            "animate-in fade-in zoom-in-95 slide-in-from-bottom-2",
          )}
        >
          <div className="flex items-center justify-between gap-2 border-b hairline pb-1.5 text-xs">
            <span className="font-display font-bold tracking-tight text-ink">{guide.title}</span>
            <button
              onClick={() => {
                playTapSound();
                setBubbleOpen(false);
              }}
              aria-label="Dismiss guide"
              className="text-ink/40 transition hover:text-ink text-sm px-1"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink/75">{currentHint}</p>
          {guide.cta && !pathname.startsWith("/book") && (
            <button
              onClick={() => {
                playTapSound();
                navigate({ to: guide.cta!.to });
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[0.7rem] font-bold text-primary-foreground transition hover:brightness-110"
            >
              {guide.cta.label}
            </button>
          )}
          {/* Bubble tail pointing to avatar */}
          <div className="absolute -bottom-1.5 right-6 size-3 rotate-45 border-b border-r hairline bg-surface-light" />
        </div>
      )}

      {/* Floating Animated Head Avatar */}
      <button
        onClick={() => {
          playTapSound();
          setBubbleOpen((o) => !o);
          setHeadNodding(true);
          window.setTimeout(() => setHeadNodding(false), 900);
        }}
        aria-label="Toggle Mr. Bondz guide"
        className={cn(
          "pointer-events-auto group relative flex size-14 shrink-0 items-center justify-center rounded-full bg-ink p-1 ring-2 ring-canvas shadow-xl transition-transform hover:scale-105 active:scale-95",
        )}
      >
        <span
          className={cn(
            "relative block size-full overflow-hidden rounded-full transition-transform duration-300",
            headNodding ? "bot-happy" : mood === "think" ? "bot-think" : "bot-breathe",
          )}
        >
          <img src={face.url} alt="Mr. Bondz" className="h-full w-full object-contain" draggable={false} />
          {/* Animated blink dots */}
          <span className="bot-blink absolute left-[23%] top-[43.5%] h-[5%] w-[19%] rounded-full bg-surface-light" />
          <span className="bot-blink absolute right-[23%] top-[43.5%] h-[5%] w-[19%] rounded-full bg-surface-light" />
        </span>
        {/* Active status pulse */}
        <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-surface-light live-dot" />
      </button>
    </aside>
  );
}
