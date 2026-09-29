import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import face from "@/assets/face-dark.png.asset.json";
import { type BotSignal, type Mood } from "@/lib/bot-bus";
import { CONTACT, EVENT_TYPES, TERMS, type EventTypeId } from "@/lib/bondz-data";
import { cn } from "@/lib/utils";

type Msg = { from: "bot" | "me"; text: string; action?: { label: string; event?: EventTypeId | undefined; where?: "home" | "venue" | undefined; to?: string } };

const PAGE_TIPS: Record<string, string> = {
  "/": "Hit the red button - I'll only show you dates that genuinely work.",
  "/how-it-works": "The whole trick in one line: impossible options never render.",
  "/portfolios": "Pick a tab - every one of these was booked without a call.",
  "/services": "Eleven services, one coordinator. That's me.",
  "/partners": "Every name here syncs its calendar with mine, live.",
  "/contact": "Prefer a human first? I read every message myself.",
  "/book": "Take it step by step - I'm reconciling calendars as you go.",
};

function Face({ mood, size = 56 }: { mood: Mood; size?: number }) {
  return (
    <span
      className="relative block overflow-hidden rounded-full bg-ink ring-2 ring-canvas"
      style={{ width: size, height: size }}
    >
      <span
        className={cn(
          "absolute left-1/2 top-[8%] block -translate-x-1/2",
          mood === "happy" ? "bot-happy" : mood === "think" ? "bot-think" : "bot-breathe",
        )}
        style={{ height: size * 1.08, aspectRatio: "330 / 490" }}
      >
        <img src={face.url} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
        <span className="bot-blink absolute left-[23%] top-[43.5%] h-[5%] w-[19%] rounded-full bg-surface-light" />
        <span className="bot-blink absolute right-[23%] top-[43.5%] h-[5%] w-[19%] rounded-full bg-surface-light" />
      </span>
    </span>
  );
}

function answer(q: string): Msg {
  const s = q.toLowerCase();
  const ev = EVENT_TYPES.find((e) => s.includes(e.id) || s.includes(e.title.toLowerCase().split(" ")[0]!));
  const has = (...k: string[]) => k.some((x) => s.includes(x));

  if (has("book", "start", "plan", "want", "throw", "organi") && ev) {
    const where = has("venue", "hall", "restaurant") ? "venue" : has("home", "house", "garden", "backyard", "my place", "office") ? "home" : undefined;
    return {
      from: "bot",
      text: `A ${ev.title.toLowerCase()} - love it. I'll jump you straight in with that pre-selected${where ? (where === "home" ? ", at your place" : ", at a venue") : ""}. Every option you see from here is already confirmed possible.`,
      action: { label: `Start my ${ev.title.toLowerCase()} →`, event: ev.id, where },
    };
  }
  if (has("price", "cost", "how much", "fee", "expens", "budget"))
    return { from: "bot", text: "My planning & on-site fee is $450 at your place or $650 at a venue. Partners are priced live - flat (e.g. DJ Nova $850) or per guest (e.g. catering from $32/guest). The Live Estimate updates on every click, and you pay 25% today, the balance 7 days before." };
  if (has("deposit", "pay", "card"))
    return { from: "bot", text: "You pay a 25% deposit to lock every calendar at once. The remaining balance is due 7 days before your event. In this demo, no real card is charged." };
  if (has("cancel", "refund"))
    return { from: "bot", text: `${TERMS[3]!.b} Rescheduling: ${TERMS[2]!.b}` };
  if (has("reschedul", "change date", "move"))
    return { from: "bot", text: TERMS[2]!.b };
  if (has("hybrid", "stream", "virtual", "online"))
    return { from: "bot", text: "Hybrid means live + digital: in-room guests plus a broadcast for everyone else - stage design, AV and a streaming platform, all coordinated by me. It's not just live. It's live + digital.", action: { label: "Plan a hybrid event →", event: "hybrid" } };
  if (has("venue", "where", "location"))
    return { from: "bot", text: "Two routes: at your place (just my calendar + partners) or at a venue. For venues I only show the ones that host your event type, fit your guest count and are free on the same days as me and your partners." };
  if (has("grey", "gray", "disabled", "unavailable", "why can't", "missing", "hidden", "filter"))
    return { from: "bot", text: "That's the rule: impossible options never exist on screen. If a date, venue or partner can't work, it isn't shown at all. Flip 'Reveal filtered reality' from step 3 to watch the calendars being reconciled.", action: { label: "Read The Rule →", to: "/how-it-works" } };
  if (has("guest", "people", "capacity", "how many"))
    return { from: "bot", text: "I handle 10 to 300 guests. Your count filters everything - venues, caterers, equipment - so you only see partners who can actually serve that many." };
  if (has("service", "offer", "do you do", "catering", "dj", "decor", "clean"))
    return { from: "bot", text: "Eleven services: production, design, media & PR, catering, decorations, music & DJ, post-event cleaning, photo & video, equipment, lights & sound and hybrid events.", action: { label: "See all services →", to: "/services" } };
  if (has("contact", "email", "phone", "call", "talk", "human"))
    return { from: "bot", text: `Write to ${CONTACT.email} or ${CONTACT.phone}. ${CONTACT.hours}. Honestly though - you'll be booked faster than I can reply.`, action: { label: "Contact page →", to: "/contact" } };
  if (has("confirm", "notif", "after", "email", "contract", "receipt"))
    return { from: "bot", text: "The second you pay, every party - you, me, your venue, each vendor - gets its own confirmation. You get a signed contract PDF, receipt, and a guest invitation you can download." };
  if (has("hi", "hello", "hey", "yo"))
    return { from: "bot", text: "Hey! I'm Mr. Bondz. Tell me what you're celebrating and roughly how many people - I'll take it from there." };
  if (ev)
    return { from: "bot", text: `${ev.title}: ${ev.line}. Want me to start one?`, action: { label: `Start my ${ev.title.toLowerCase()} →`, event: ev.id } };
  return { from: "bot", text: "I can help with pricing, dates, venues, deposits, cancellations, hybrid events - or just say something like “birthday for 40 at my place” and I'll start the booking for you." };
}

export function MrBondzBot() {
  const [mood, setMood] = useState<Mood>("idle");
  const [tip, setTip] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hey, I'm Mr. Bondz. Ask me anything - prices, dates, policies - or tell me what you're celebrating." }]);
  const [input, setInput] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const moodTimer = useRef<number>(0);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<BotSignal>).detail;
      if (d.mood) {
        setMood(d.mood);
        window.clearTimeout(moodTimer.current);
        moodTimer.current = window.setTimeout(() => setMood("idle"), 1800);
      }
      if (d.tip) setTip(d.tip);
    };
    window.addEventListener("bondz:bot", on);
    return () => window.removeEventListener("bondz:bot", on);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setTip(PAGE_TIPS[pathname] ?? null), 1200);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (!tip) return;
    const t = window.setTimeout(() => setTip(null), 7000);
    return () => window.clearTimeout(t);
  }, [tip]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setMood("think");
    window.setTimeout(() => {
      const a = answer(q);
      setMsgs((m) => [...m, a]);
      setMood(a.action ? "happy" : "idle");
      window.setTimeout(() => setMood("idle"), 1600);
    }, 650);
  };

  const act = (a: NonNullable<Msg["action"]>) => {
    setOpen(false);
    if (a.to) navigate({ to: a.to });
    else navigate({ to: "/book", search: { event: a.event, where: a.where } });
  };

  return (
    <div className="pointer-events-none fixed bottom-10 left-3 z-[60] flex flex-col items-start gap-2 md:left-6">
      {open && (
        <div className="rise pointer-events-auto flex h-[min(30rem,70dvh)] w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border hairline bg-surface-light shadow-[0_30px_60px_-20px_oklch(0.2_0.03_290/0.35)]">
          <div className="flex items-center gap-3 border-b hairline px-4 py-3">
            <Face mood={mood} size={36} />
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight">Mr. Bondz</p>
              <p className="eyebrow text-ink/50">{mood === "think" ? "Checking calendars…" : "Online · knows everything here"}</p>
            </div>
            <button onClick={() => setOpen(false)} className="eyebrow ml-auto text-ink/50 hover:text-ink" aria-label="Close chat">
              Close
            </button>
          </div>
          <div ref={listRef} className="scroll-quiet flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex flex-col gap-2", m.from === "me" ? "items-end" : "items-start")}>
                <p
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug",
                    m.from === "me" ? "rounded-br-md bg-ink text-canvas" : "rounded-bl-md bg-muted",
                  )}
                >
                  {m.text}
                </p>
                {m.action && (
                  <button onClick={() => act(m.action!)} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:brightness-110">
                    {m.action.label}
                  </button>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t hairline p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. birthday for 40 at my place"
              className="min-w-0 flex-1 rounded-full border hairline bg-canvas px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="rounded-full bg-ink px-4 text-xs font-bold text-canvas">Send</button>
          </form>
        </div>
      )}
      {!open && tip && (
        <button
          onClick={() => setOpen(true)}
          className="rise pointer-events-auto ml-2 max-w-[16rem] rounded-2xl rounded-bl-sm border hairline bg-surface-light px-3.5 py-2 text-left text-xs font-medium leading-snug shadow-lg"
        >
          {tip}
        </button>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto relative transition-transform hover:scale-105"
        aria-label="Chat with Mr. Bondz"
      >
        <Face mood={mood} />
        {mood !== "idle" && (
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-primary text-[0.65rem] font-black text-primary-foreground">
            {mood === "happy" ? "!" : "…"}
          </span>
        )}
      </button>
    </div>
  );
}
