import { useEffect, useRef, useState, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  CATEGORIES,
  categoryLabel,
  EVENT_TYPES,
  TERMS,
  VENUES,
  assignPartner,
  dayToDate,
  estimate,
  money,
  priceOf,
  availableDays,
  HORIZON,
  type Slot,
} from "@/lib/bondz-data";
import { signalBot } from "@/lib/bot-bus";
import { cn } from "@/lib/utils";
import { StepHead } from "./panels";
import { Ghost, Primary } from "./steps";
import { useBooking } from "./store";
import { triggerHaptic, playTapSound, isSoundEnabled, playCelebrationSequence, playThump } from "@/lib/haptics";
import lightIcon from "@/assets/icons/bondz-icon-red.png";
import darkIcon from "@/assets/icons/bondz-icon-white.png";
import lightTemplate from "@/assets/templates/BONDZ_EVENTS_INVITE_CARD_-_LIGHT.png";
import darkTemplate from "@/assets/templates/BONDZ_EVENTS_INVITE_CARD_-_DARK.png";

/* ───────────────── helpers ───────────────── */
function useSummary() {
  const b = useBooking();
  const { sel, day, slot, anchor, details } = b;
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  const ev = EVENT_TYPES.find((e) => e.id === sel.event);
  const date = day ? dayToDate(anchor, day) : null;
  const dateStr =
    date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) ?? "";
  const assigned = day
    ? sel.services.map((c) => ({ cat: categoryLabel(c), p: assignPartner(c, sel, day) })).filter((x) => x.p)
    : [];
  const place = venue ? `${venue.name}, ${venue.area}` : "Client's own space";
  const est = estimate(sel);
  const parties = 2 + (venue ? 1 : 0) + assigned.length;
  return { ...b, venue, ev, dateStr, assigned, place, est, parties, slot, details };
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, className, ...rest } = props;
  return (
    <label className={cn("block", className)}>
      <span className="eyebrow text-ink/60">{label}</span>
      <input
        {...rest}
        className="mt-1 w-full rounded-xl border hairline bg-surface-light px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
      />
    </label>
  );
}

/* ───────────────── Signature ───────────────── */
function SignaturePad({ onChange }: { onChange: (d: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const c = ref.current!;
    const r = c.getBoundingClientRect();
    c.width = r.width * 2;
    c.height = r.height * 2;
    const ctx = c.getContext("2d")!;
    ctx.scale(2, 2);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const isDark = document.documentElement.classList.contains("dark");
    ctx.strokeStyle = isDark ? "#f6f1e7" : "#130f16";
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };
  return (
    <div>
      <div className="relative">
        <canvas
          ref={ref}
          className="h-24 w-full touch-none rounded-xl border border-dashed border-ink/30 bg-surface-light text-ink"
          onPointerDown={(e) => {
            drawing.current = true;
            ref.current!.setPointerCapture(e.pointerId);
            const ctx = ref.current!.getContext("2d")!;
            ctx.strokeStyle = document.documentElement.classList.contains("dark") ? "#f6f1e7" : "#130f16";
            ctx.beginPath();
            ctx.moveTo(...pos(e));
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = ref.current!.getContext("2d")!;
            ctx.strokeStyle = document.documentElement.classList.contains("dark") ? "#f6f1e7" : "#130f16";
            ctx.lineTo(...pos(e));
            ctx.stroke();
            if (empty) setEmpty(false);
          }}
          onPointerUp={() => {
            drawing.current = false;
            if (!empty) onChange(ref.current!.toDataURL());
          }}
          aria-label="Signature pad"
        />
        {empty && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center text-xs text-ink/40">
            Sign here with mouse or finger
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          const c = ref.current!;
          c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
          setEmpty(true);
          onChange(null);
        }}
        className="eyebrow mt-1.5 text-ink/55 hover:text-ink"
      >
        Clear signature
      </button>
    </div>
  );
}

/* ───────────────── STEP 5 ───────────────── */
export function Step5() {
  const s = useSummary();
  const { sel, setSel, details, setDetails, signature, setSignature, setStep, setRef, est, parties } = s;
  const [agree, setAgree] = useState(false);
  const [card, setCard] = useState({ n: "•••• •••• •••• 4242", exp: "12/28", cvc: "742" });
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(0);

  // Sample details are prefilled so the flow can be tested by signing and paying only.
  const prefilled = useRef(false);
  useEffect(() => {
    if (prefilled.current) return;
    prefilled.current = true;
    const seed: Record<string, string> = {};
    if (!details.name.trim()) seed["name"] = "Amira Kensington";
    if (!details.phone.trim()) seed["phone"] = "+1 555 234 5678";
    if (!details.email.trim()) seed["email"] = "amira.k@example.com";
    if (!details.honor.trim()) seed["honor"] = s.ev?.title ? `${s.ev.title} guest of honour` : "Guest of honour";
    if (!details.notes.trim()) seed["notes"] = "Two vegetarian tables, easy step-free access, surprise toast at 9.";
    if (Object.keys(seed).length) setDetails({ ...details, ...seed });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardValid =
    (card.n.includes("4242") || card.n.replace(/\s/g, "").length >= 12) && card.exp.length >= 4 && card.cvc.length >= 3;
  const ready =
    details.name.trim() &&
    /\S+@\S+\.\S+/.test(details.email) &&
    details.phone.trim().length >= 6 &&
    agree &&
    signature &&
    cardValid;
  const missing = !details.name.trim()
    ? "your name"
    : !/\S+@\S+\.\S+/.test(details.email)
      ? "a valid email"
      : details.phone.trim().length < 6
        ? "a phone number"
        : !agree
          ? "agreement to the terms"
          : !signature
            ? "your signature"
            : "demo card details";

  const pay = () => {
    setLoading(true);
    signalBot({ mood: "think" });
    // The self-playing showcase stays completely silent; only real bookings make sound.
    if (!s.demo) playThump();
    [1, 2, 3, 4].forEach((i) =>
      window.setTimeout(() => {
        setPhase(i);
        if (!s.demo) playThump(0.85 + i * 0.05);
      }, i * 750),
    );
    window.setTimeout(() => {
      setRef("BZ-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + String(Date.now()).slice(-4));
      setStep(6);
    }, 3700);
  };

  const set = (k: keyof typeof details) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDetails({ ...details, [k]: e.target.value });

  const checklist = [
    `Authorizing deposit of ${money(est.deposit)}`,
    `Locking ${parties - 1} partner calendars`,
    "Writing signed terms & receipt",
    `Emitting ${parties}-way confirmations`,
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_21rem]">
      <div className="flex flex-col gap-4">
        <StepHead no="05" title="Lock it in." sub="Almost booked. This is the only form you will ever fill." />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" value={details.name} onChange={set("name")} autoComplete="name" required />
          <Field label="Phone" value={details.phone} onChange={set("phone")} type="tel" autoComplete="tel" required />
          <Field
            label="Email"
            value={details.email}
            onChange={set("email")}
            type="email"
            autoComplete="email"
            required
          />
          <Field label="Guest of honor (optional)" value={details.honor} onChange={set("honor")} />
          <Field
            label="Guest count"
            type="number"
            min={10}
            max={300}
            value={sel.guests}
            onChange={(e) => setSel({ ...sel, guests: Math.min(300, Math.max(10, +e.target.value || 10)) })}
          />
          <label className="block sm:row-span-1">
            <span className="eyebrow text-ink/60">Anything we should know?</span>
            <textarea
              value={details.notes}
              onChange={set("notes")}
              rows={1}
              className="mt-1 w-full resize-none rounded-xl border hairline bg-surface-light px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-1 text-ink/60">Service agreement · 8 clauses</p>
            <ol className="scroll-quiet h-40 overflow-y-auto rounded-xl border hairline bg-surface-light p-3 text-[0.72rem] leading-relaxed">
              {TERMS.map((t, i) => (
                <li key={t.t} className="mb-2">
                  <b>
                    {i + 1}. {t.t}.
                  </b>{" "}
                  <span className="text-ink/70">{t.b}</span>
                </li>
              ))}
            </ol>
            <label className="mt-2.5 flex items-start gap-2.5 text-xs font-medium cursor-pointer p-2 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 size-4 accent-primary cursor-pointer"
              />
              <span className="text-ink">
                I've read and agree to the service agreement, including the cancellation tiers.
              </span>
            </label>
          </div>
          <div>
            <p className="eyebrow mb-1 text-ink/60">Signature</p>
            <SignaturePad onChange={setSignature} />
          </div>
        </div>
        <div className="pl-20">
          <Ghost onClick={() => setStep(4)}>← Back</Ghost>
        </div>
      </div>

      <aside className="flex flex-col rounded-2xl border border-hairline bg-surface-light dark:bg-[#161217] p-5 text-ink dark:text-white lg:sticky lg:top-0 lg:self-start shadow-raised">
        <p className="eyebrow text-primary">Secure deposit</p>
        <p className="display mt-3 text-6xl tabular-nums">{money(est.deposit)}</p>
        <p className="mt-1 text-xs text-ink/60 dark:text-white/60">
          due today · balance {money(est.balance)} due 7 days before
        </p>

        {/* What is paid, and when */}
        <dl className="mt-4 space-y-1.5 rounded-xl border border-hairline bg-canvas/60 dark:bg-white/5 p-3 text-xs">
          {est.lines.map((l) => (
            <div key={l.label} className="flex items-baseline justify-between gap-3">
              <dt className="min-w-0 truncate text-ink/65 dark:text-white/65">
                {l.label}
                {l.note ? <span className="text-ink/35 dark:text-white/35"> · {l.note}</span> : null}
              </dt>
              <dd className="shrink-0 tabular-nums text-ink/85 dark:text-white/85">{money(l.amount)}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-3 border-t border-hairline pt-2 font-semibold text-ink dark:text-white">
            <dt>Full celebration total</dt>
            <dd className="tabular-nums">{money(est.total)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 text-primary">
            <dt>Paid today · 25% deposit</dt>
            <dd className="tabular-nums">{money(est.deposit)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 text-ink/65 dark:text-white/65">
            <dt>Remaining balance · 75%</dt>
            <dd className="tabular-nums">{money(est.balance)}</dd>
          </div>
        </dl>

        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="eyebrow text-ink/60 dark:text-white/60">Card number</span>
            <input
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={card.n}
              onChange={(e) => setCard({ ...card, n: e.target.value.replace(/[^\d •]/g, "").slice(0, 19) })}
              className="mt-1 w-full rounded-xl border border-hairline bg-canvas dark:bg-black/40 text-ink dark:text-white px-3 py-2.5 text-sm tabular-nums outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="eyebrow text-ink/60 dark:text-white/60">Expiry</span>
              <input
                placeholder="12/28"
                value={card.exp}
                onChange={(e) => setCard({ ...card, exp: e.target.value.slice(0, 5) })}
                className="mt-1 w-full rounded-xl border border-hairline bg-canvas dark:bg-black/40 text-ink dark:text-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
            <label className="block">
              <span className="eyebrow text-ink/60 dark:text-white/60">CVC</span>
              <input
                placeholder="123"
                inputMode="numeric"
                value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                className="mt-1 w-full rounded-xl border border-hairline bg-canvas dark:bg-black/40 text-ink dark:text-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          </div>
          <p className="eyebrow text-ink/45 dark:text-white/45">Demo sandbox · prefilled verified card</p>
        </div>
        <Primary
          disabled={!ready}
          onClick={pay}
          className={cn(
            "mt-5 w-full py-4 text-base font-black transition-all",
            !ready && "opacity-50 cursor-not-allowed bg-ink/20 dark:bg-white/10 text-ink/60 dark:text-white/40",
          )}
        >
          Pay {money(est.deposit)} & book
        </Primary>
        {!ready && (
          <p className="mt-2.5 text-center text-xs font-bold text-primary animate-pulse">Still need {missing}.</p>
        )}
      </aside>

      {loading && (
        <div className="dark fixed inset-0 z-[100] grid place-items-center bg-[#0d0910]/95 backdrop-blur-xl text-foreground px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#16111a] p-7 sm:p-9 shadow-2xl">
            {/* Animating Mr. Bondz Logo Icon: Wobbles head -15deg to +15deg, no ai slop circles */}
            <div className="flex items-center justify-center py-3">
              <motion.div
                animate={{ rotate: [-15, 15, -15] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "50% 85%" }}
                className="size-20 sm:size-24 flex items-center justify-center"
              >
                <img
                  src={darkIcon}
                  alt="Mr. Bondz"
                  className="size-full object-contain select-none drop-shadow-[0_8px_24px_rgba(241,69,59,0.35)]"
                />
              </motion.div>
            </div>

            <h2 className="display mt-6 text-3xl sm:text-4xl text-white tracking-tight">Completing your booking</h2>
            <p className="mt-1 text-xs text-white/60">
              Dispatching instant 360° synchronization locks across all partner calendars...
            </p>

            <ul className="mt-6 space-y-3">
              {checklist.map((c, i) => (
                <li
                  key={c}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-2.5 text-xs sm:text-sm font-medium transition-all duration-500",
                    phase > i
                      ? "border-success/30 bg-success/10 text-white translate-x-0"
                      : "border-white/5 bg-white/2 text-white/40 -translate-x-1",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-black transition-all",
                      phase > i
                        ? "bg-success text-success-foreground shadow-xs"
                        : "border border-white/20 text-white/30",
                    )}
                  >
                    {phase > i ? "✓" : i + 1}
                  </span>
                  <span>{c}</span>
                  {phase === i && <span className="ml-auto inline-block size-2 rounded-full bg-primary animate-ping" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────── Celebration ───────────────── */
function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const r = c.getBoundingClientRect();
    c.width = r.width;
    c.height = r.height;
    const css = getComputedStyle(document.documentElement);
    // Read the real Bondz theme variables; the previous names did not exist, so
    // every particle was painted with an empty colour and nothing was visible.
    const resolvedColors = ["--bondz-primary", "--bondz-status", "--bondz-paper", "--bondz-cta-top"]
      .map((v) => css.getPropertyValue(v).trim())
      .filter(Boolean);
    const colors =
      resolvedColors.length >= 3 ? resolvedColors : ["#f1453b", "#10b981", "#faf7f2", "#ffd166", "#e7e2db"];
    const ps = Array.from({ length: 160 }, () => ({
      x: c.width / 2 + (Math.random() - 0.5) * 80,
      y: c.height * 0.6,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 14 - 6,
      r: Math.random() * 6 + 3,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.3,
      col: colors[Math.floor(Math.random() * colors.length)]!,
    }));
    let raf = 0;
    let t = 0;
    const loop = () => {
      t++;
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of ps) {
        p.vy += 0.32;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
      }
      if (t < 260) raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}

function cheer() {
  try {
    triggerHaptic([35, 60, 45, 60, 80]);
    const AC =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new AC();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "triangle";
      o.frequency.value = f;
      const t = ac.currentTime + i * 0.09;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + 0.55);
    });
  } catch {
    /* audio is a nice-to-have */
  }
}

const THEMES = [
  {
    id: "coral",
    name: "Coral Night",
    bg: "oklch(0.24 0.05 290)",
    fg: "oklch(0.97 0.015 85)",
    hl: "oklch(0.68 0.2 32)",
    logo: "dark" as const,
  },
  {
    id: "golden",
    name: "Golden Hour",
    bg: "oklch(0.84 0.12 75)",
    fg: "oklch(0.2 0.03 290)",
    hl: "oklch(0.52 0.19 30)",
    logo: "light" as const,
  },
  {
    id: "garden",
    name: "Garden",
    bg: "oklch(0.88 0.06 150)",
    fg: "oklch(0.22 0.04 160)",
    hl: "oklch(0.5 0.12 155)",
    logo: "light" as const,
  },
  {
    id: "tie",
    name: "Black Tie",
    bg: "oklch(0.1 0 0)",
    fg: "oklch(0.97 0.015 85)",
    hl: "oklch(0.64 0.21 28)",
    logo: "dark" as const,
  },
];

function loadImg(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

/* ───────────────── Reschedule & Cancel Modals ───────────────── */
function RescheduleModal({
  onClose,
  total,
  current,
  sel,
  anchor,
  onConfirm,
}: {
  onClose: () => void;
  total: number;
  current: number | null;
  sel: any;
  anchor: Date;
  onConfirm: (d: number) => void;
}) {
  const [when, setWhen] = useState<"today" | "later">("today");
  const [pick, setPick] = useState<number | null>(null);
  const days = availableDays(sel)
    .filter((d) => d !== current)
    .slice(0, 18);
  const fee = when === "today" ? 0 : Math.round(total * 0.05);
  const fmt = (d: number | null) =>
    d !== null
      ? dayToDate(anchor, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      : "-";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border hairline bg-surface-light p-6 text-ink shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Reschedule Celebration</h3>
            <p className="mt-1 text-xs text-ink/60">
              Current date: <span className="font-semibold text-ink">{fmt(current)}</span>
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-ink/10 transition-colors text-ink/70">
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setWhen("today")}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-bold transition-all text-left",
              when === "today" ? "border-primary bg-primary text-white" : "hairline bg-surface hover:border-ink/40",
            )}
          >
            <span className="block font-bold">Today (Booking Day)</span>
            <span className="text-[0.65rem] opacity-80">Free reschedule</span>
          </button>
          <button
            type="button"
            onClick={() => setWhen("later")}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-bold transition-all text-left",
              when === "later" ? "border-primary bg-primary text-white" : "hairline bg-surface hover:border-ink/40",
            )}
          >
            <span className="block font-bold">After 3 Days of Booking</span>
            <span className="text-[0.65rem] opacity-80">5% transfer fee</span>
          </button>
        </div>

        <p className="mt-4 text-xs font-bold text-ink/70 uppercase tracking-wider">Select new verified open date</p>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {days.map((d) => {
            const dt = dayToDate(anchor, d);
            const on = pick === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setPick(d)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border p-2 text-xs transition-all",
                  on
                    ? "border-primary bg-primary text-white font-bold shadow-xs"
                    : "hairline bg-surface hover:border-primary/50 text-ink",
                )}
              >
                <span className="text-[0.62rem] uppercase opacity-70">
                  {dt.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-base font-bold">{dt.getDate()}</span>
                <span className="text-[0.60rem] opacity-70">{dt.toLocaleDateString("en-US", { month: "short" })}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between border-t hairline pt-3 text-xs">
          <span className="text-ink/70">{when === "today" ? "Same-day transfer fee:" : "5% transfer policy fee:"}</span>
          <span className="text-base font-extrabold text-primary">{money(fee)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border hairline py-2.5 text-xs font-bold hover:bg-ink/5"
          >
            Keep Current Date
          </button>
          <Primary
            disabled={pick === null}
            onClick={() => {
              if (pick !== null) {
                onConfirm(pick);
                toast.success(`Rescheduled to ${fmt(pick)}!`);
              }
            }}
            className="flex-1 py-2.5 text-xs"
          >
            Confirm {pick !== null ? fmt(pick) : "Date"}
          </Primary>
        </div>
      </div>
    </div>
  );
}

function CancelModal({ onClose, deposit, onConfirm }: { onClose: () => void; deposit: number; onConfirm: () => void }) {
  const [when, setWhen] = useState<"today" | "later">("today");
  const [confirmed, setConfirmed] = useState(false);
  const refund = when === "today" ? deposit : 0;
  const retained = deposit - refund;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border hairline bg-surface-light p-6 text-ink shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-destructive">Cancel Booking</h3>
            <p className="mt-1 text-xs text-ink/60">Refund calculations follow the signed 8-clause terms.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-ink/10 transition-colors text-ink/70">
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setWhen("today")}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-bold transition-all text-left",
              when === "today" ? "border-primary bg-primary text-white" : "hairline bg-surface hover:border-ink/40",
            )}
          >
            <span className="block font-bold">Today (Booking Day)</span>
            <span className="text-[0.65rem] opacity-80">100% full deposit refund</span>
          </button>
          <button
            type="button"
            onClick={() => setWhen("later")}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-bold transition-all text-left",
              when === "later" ? "border-primary bg-primary text-white" : "hairline bg-surface hover:border-ink/40",
            )}
          >
            <span className="block font-bold">After Booking Day</span>
            <span className="text-[0.65rem] opacity-80">Deposit retained</span>
          </button>
        </div>

        <div className="mt-4 space-y-2 rounded-xl border hairline bg-surface p-3.5 text-xs">
          <div className="flex justify-between text-ink/70">
            <span>Deposit Paid:</span>
            <span className="font-semibold text-ink">{money(deposit)}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span>Retained by policy:</span>
            <span className="font-semibold text-ink">{money(retained)}</span>
          </div>
          <div className="flex justify-between border-t hairline pt-2 text-sm font-bold">
            <span className="text-ink">Net Refund to Original Card:</span>
            <span className="text-primary font-black">{money(refund)}</span>
          </div>
        </div>

        <label className="mt-4 flex items-start gap-2.5 text-xs text-ink/80 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 size-4 accent-primary"
          />
          <span>I understand this releases all {HORIZON}-day reserved vendor holds and cancels my event.</span>
        </label>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border hairline py-2.5 text-xs font-bold hover:bg-ink/5"
          >
            Keep My Booking
          </button>
          <button
            disabled={!confirmed}
            onClick={() => {
              onConfirm();
              toast.info(
                refund > 0
                  ? `Booking cancelled. ${money(refund)} refund processed.`
                  : "Booking cancelled. Retained per policy.",
              );
            }}
            className="flex-1 rounded-full bg-destructive text-destructive-foreground py-2.5 text-xs font-bold transition hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────────────── STEP 6 ───────────────── */
export function Step6() {
  const s = useSummary();
  const { ev, sel, dateStr, slot, place, ref, parties, assigned, venue, details, est, signature, reset, day, anchor } =
    s;
  const [tab, setTab] = useState(0);
  const [head, setHead] = useState(() => {
    const rawHonor = details.honor?.trim();
    const rawName = details.name?.trim().split(" ")[0];
    const who = rawHonor || rawName;
    const title = ev?.title ?? "Celebration";
    if (who) {
      if (who.toLowerCase().includes(title.toLowerCase())) {
        return who;
      }
      return `${who}’s ${title}`;
    }
    return title;
  });
  const [tag, setTag] = useState("Come hungry. Leave with stories.");
  const [theme, setTheme] = useState(THEMES[0]!);
  const [modal, setModal] = useState<null | "reschedule" | "cancel">(null);
  const [cancelled, setCancelled] = useState(false);
  const [movedDay, setMovedDay] = useState<number | null>(null);

  const activeDay = movedDay !== null ? movedDay : day;
  const activeDate = activeDay ? dayToDate(anchor, activeDay) : day ? dayToDate(anchor, day) : null;
  const shownDateText =
    activeDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) ??
    dateStr;

  useEffect(() => {
    // The showcase simulation never plays the fanfare; only a real confirmation does.
    if (!s.demo) {
      playCelebrationSequence();
      signalBot({ mood: "happy", tip: "You're booked! Everyone's been told. Go celebrate." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recipients = [
    {
      who: "Client",
      to: details.email || "you@example.com",
      subj: `You're booked - ${ev?.title} on ${shownDateText}`,
      body: `Hi ${details.name || "there"},\n\nIt's official. Your ${ev?.title?.toLowerCase()} for ${sel.guests} guests is locked for ${shownDateText} (${slot}) at ${place}.\n\nDeposit paid: ${money(est.deposit)}. Balance of ${money(est.balance)} is due 7 days before.\nReference: ${ref}\n\nYour signed agreement and receipt are attached. Nothing else to do - Mr. Bondz has it from here.`,
    },
    {
      who: "Mr. Bondz",
      to: "bondz@bondzevents.com",
      subj: `New booking ${ref} · ${ev?.title} · ${sel.guests} guests`,
      body: `Client: ${details.name} · ${details.phone} · ${details.email}\nWhen: ${shownDateText}, ${slot}\nWhere: ${place}\nPartners locked: ${assigned.map((a) => a.p!.name).join(", ") || "Solo event"}\nNotes: ${details.notes || "-"}\n\nCalendar blocked. Deposit cleared.`,
    },
    ...(venue
      ? [
          {
            who: venue.name,
            to: `bookings@${venue.id}.venue`,
            subj: `Confirmed hold - ${shownDateText}`,
            body: `Hello ${venue.name} team,\n\nConfirmed: ${ev?.title} for ${sel.guests} guests on ${shownDateText} (${slot}). Organizer: Mr. Bondz. Venue fee ${money(venue.price)} is covered under ref ${ref}.\n\nYour calendar has been locked for this date.`,
          },
        ]
      : []),
    ...assigned.map((a) => ({
      who: a.p!.name,
      to: `jobs@${a.p!.id}.partner`,
      subj: `You're on: ${a.cat} · ${shownDateText}`,
      body: `Hi ${a.p!.name},\n\nYou're booked for ${a.cat.toLowerCase()} - ${ev?.title?.toLowerCase()}, ${sel.guests} guests, ${shownDateText} (${slot}) at ${place}.\nAgreed: ${money(priceOf(a.p!, sel.guests))}. Ref ${ref}.\n\nMr. Bondz will share the run-of-show 14 days out.`,
    })),
  ];
  const r = recipients[Math.min(tab, recipients.length - 1)]!;
  const invitePayload = useMemo(
    () => ({
      title: head,
      host: details.name || "Mr. Bondz Client",
      date: activeDate ? activeDate.toISOString() : new Date().toISOString(),
      slot: (slot || "Evening") as Slot,
      place: place || "Smokestack Yard",
      tagline: tag || "Come hungry. Leave with stories.",
      guests: sel.guests,
      eventType: ev?.title ?? "Celebration",
    }),
    [head, details.name, activeDate, slot, place, tag, sel.guests, ev?.title],
  );

  useEffect(() => {
    try {
      localStorage.setItem(`bondz_invite_${ref}`, JSON.stringify(invitePayload));
    } catch {
      /* optional */
    }
  }, [ref, invitePayload]);

  const inviteToken = useMemo(() => {
    try {
      const json = JSON.stringify(invitePayload);
      const bytes = new TextEncoder().encode(json);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } catch {
      return "";
    }
  }, [invitePayload]);

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${ref}${inviteToken ? `?invite=${encodeURIComponent(inviteToken)}` : ""}`
      : `/invite/${ref}`;
  const guestMsg = `${head}\n${tag}\n${shownDateText} · ${slot}\n${place}\n\nDetails & RSVP: ${link}`;

  const calendarUrl = (() => {
    if (!activeDate) return "#";
    const d = `${activeDate.getFullYear()}${String(activeDate.getMonth() + 1).padStart(2, "0")}${String(activeDate.getDate()).padStart(2, "0")}`;
    const next = new Date(activeDate);
    next.setDate(next.getDate() + 1);
    const d2 = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, "0")}${String(next.getDate()).padStart(2, "0")}`;
    const q = new URLSearchParams({
      action: "TEMPLATE",
      text: head,
      dates: `${d}/${d2}`,
      details: `${tag}\nBondz Events · Ref ${ref}\nHost: ${details.name}\nRSVP: ${link}`,
      location: place,
    });
    return `https://calendar.google.com/calendar/render?${q.toString()}`;
  })();

  const download = async () => {
    try {
      const templateSrc = theme.logo === "dark" ? darkTemplate : lightTemplate;
      const templateImg = await loadImg(templateSrc);
      const W = templateImg.naturalWidth || 1080;
      const H = templateImg.naturalHeight || 1080;
      const c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(templateImg, 0, 0, W, H);

      await document.fonts.load('italic 105px "Instrument Serif"');
      await document.fonts.load('800 36px "Bricolage Grotesque"');

      // Top invitation kicker
      ctx.font = '700 24px "Bricolage Grotesque"';
      ctx.fillStyle = theme.hl;
      ctx.fillText("YOU’RE INVITED TO CELEBRATE", 100, 310);

      // Editorial headline
      ctx.fillStyle = theme.fg;
      ctx.font = 'italic 105px "Instrument Serif"';
      const words = head.split(" ");
      let line = "";
      let y = 430;
      for (const w of words) {
        if (ctx.measureText(line + w).width > W - 220) {
          ctx.fillText(line.trim(), 100, y);
          line = "";
          y += 115;
        }
        line += w + " ";
      }
      ctx.fillText(line.trim(), 100, y);

      // Punchy tagline
      ctx.font = 'italic 46px "Instrument Serif"';
      ctx.fillStyle = theme.hl;
      ctx.fillText(tag, 100, y + 75);

      // Date, Shift, and Venue
      ctx.fillStyle = theme.fg;
      ctx.font = '800 36px "Bricolage Grotesque"';
      ctx.fillText(shownDateText.toUpperCase(), 100, y + 170);
      ctx.font = '600 30px "Bricolage Grotesque"';
      ctx.fillText(`${slot ? slot : "Evening"} · ${place}`, 100, y + 215);

      // RSVP & Host details
      ctx.font = '500 22px "Bricolage Grotesque"';
      ctx.fillStyle = theme.hl;
      ctx.fillText(`Hosted by ${details.name || "Mr. Bondz Client"} · Ref: ${ref}`, 100, y + 265);

      const a = document.createElement("a");
      a.download = `bondz-invitation-${ref}.png`;
      a.href = c.toDataURL("image/png");
      a.click();
      toast.success("Invitation Card downloaded");
    } catch {
      toast.error("Could not export invitation card");
    }
  };

  const printPdf = (): void => {
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Allow pop-ups to download your contract.");
      return;
    }
    const rows = est.lines
      .map(
        (l) =>
          `<tr><td><b>${l.label}</b><small>${l.note ?? ""}</small></td><td style="text-align:right">${money(l.amount)}</td></tr>`,
      )
      .join("");
    const terms = TERMS.map((t, i) => `<li><b>${i + 1}. ${t.t}.</b> ${t.b}</li>`).join("");
    const logoUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/brand-lockup.png`;
    w.document
      .write(`<!doctype html><html><head><meta charset="utf-8"><title>Bondz Events Agreement & Receipt - ${ref}</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
@page { size: A4 portrait; margin: 12mm 15mm; }
* { box-sizing: border-box; }
body { font-family: 'Bricolage Grotesque', -apple-system, sans-serif; color: #151118; background: #fff; font-size: 10px; line-height: 1.4; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.pdf-container { max-width: 720px; margin: 0 auto; }
header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #151118; padding-bottom: 10px; margin-bottom: 12px; }
.logo { height: 42px; width: auto; object-fit: contain; }
h1 { font-family: 'Instrument Serif', Georgia, serif; font-style: italic; font-size: 30px; margin: 0; line-height: 1; color: #151118; }
.k { font-size: 8px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #f1453b; }
.meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; background: #faf8f5; border: 1px solid #e7e2db; border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; }
.meta-label { font-size: 7.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #7a7282; margin-bottom: 2px; }
.meta-val { font-size: 10.5px; font-weight: 600; color: #151118; line-height: 1.35; }
table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
th { text-align: left; font-size: 8px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #7a7282; border-bottom: 1px solid #151118; padding: 4px 0; }
th:last-child { text-align: right; }
td { border-bottom: 1px solid #eee; padding: 5px 0; font-size: 10px; }
small { display: block; color: #7a7282; font-size: 8px; margin-top: 1px; }
.t td { border-top: 1.5px solid #151118; border-bottom: 0; font-weight: 800; font-size: 12px; padding-top: 6px; }
.r td { color: #f1453b; border: 0; font-weight: 700; font-size: 10.5px; }
.b td { border-bottom: 1px solid #151118; font-weight: 600; font-size: 9.5px; padding-bottom: 6px; }
.terms-head { font-size: 8px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #7a7282; border-bottom: 1px solid #eee; padding-bottom: 3px; margin: 10px 0 6px 0; }
ol.terms { padding-left: 0; list-style: none; columns: 2; column-gap: 20px; margin: 0; }
ol.terms li { margin-bottom: 5px; break-inside: avoid; font-size: 8px; line-height: 1.35; color: #433d49; }
ol.terms li b { color: #151118; }
.signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 16px; page-break-inside: avoid; }
.sig-box { border-top: 1.5px solid #151118; padding-top: 4px; height: 60px; position: relative; }
.sig-box img { position: absolute; bottom: 20px; left: 0; height: 38px; object-fit: contain; }
.sig-name { position: absolute; bottom: 18px; left: 0; font-family: 'Instrument Serif', Georgia, serif; font-style: italic; font-size: 26px; color: #151118; }
.sig-label { position: absolute; bottom: 4px; left: 0; font-size: 7.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #7a7282; }
</style></head><body>
<div class="pdf-container">
<header>
  <div><img src="${logoUrl}" alt="Bondz Events" class="logo" /></div>
  <div style="text-align:right">
    <div class="k">Service Agreement & Receipt</div>
    <h1>You’re booked.</h1>
    <div style="font-size:9.5px;color:#555;margin-top:2px">Ref <b>${ref}</b> · Deposit Confirmed</div>
  </div>
</header>
<div class="meta-grid">
  <div><div class="meta-label">Client</div><div class="meta-val"><b>${details.name}</b><br>${details.email}<br>${details.phone}</div></div>
  <div><div class="meta-label">Event</div><div class="meta-val"><b>${ev?.title}</b> · ${sel.guests} guests<br>${shownDateText}<br>${slot}</div></div>
  <div><div class="meta-label">Location & Venue</div><div class="meta-val">${place}</div></div>
</div>
<table>
  <thead><tr><th>Item & Scope</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    ${rows}
    <tr class="t"><td>Total Event Cost</td><td style="text-align:right">${money(est.total)}</td></tr>
    <tr class="r"><td>Deposit Paid Today (25%)</td><td style="text-align:right">${money(est.deposit)}</td></tr>
    <tr class="b"><td>Balance Due (7 Days Prior)</td><td style="text-align:right">${money(est.balance)}</td></tr>
  </tbody>
</table>
<div class="terms-head">Service Agreement & Operating Principles</div>
<ol class="terms">${terms}</ol>
<div class="signatures">
  <div class="sig-box">
    ${signature ? `<img src="${signature}" alt="Client Signature" />` : ""}
    <span class="sig-label">Client Authorized - ${details.name}</span>
  </div>
  <div class="sig-box">
    <span class="sig-name">Mr. Bondz</span>
    <span class="sig-label">Event Organizer & Founder - Bondz Events</span>
  </div>
</div>
</div>
<script>setTimeout(()=>window.print(),600)</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="flex flex-col gap-3">
      <section className="dark relative overflow-hidden rounded-2xl bg-background px-5 py-6 text-foreground md:px-8 shadow-sm">
        <Confetti />
        <div className="relative grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow flex flex-wrap items-center gap-3">
              <span className={cn("font-mono", cancelled ? "line-through text-destructive" : "text-foreground/60")}>
                Ref {ref}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 font-bold",
                  cancelled ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground",
                )}
              >
                {cancelled ? "Booking Cancelled" : "✓ Deposit paid"}
              </span>
            </p>
            <h1 className="mt-3 text-[clamp(3rem,min(8vw,13vh),7.5rem)] font-extrabold leading-[0.85] tracking-[-0.04em]">
              {cancelled ? "Booking " : "You’re "}
              <span className="font-serif-i text-primary">{cancelled ? "Cancelled." : "Booked!"}</span>
            </h1>
            <p className="mt-3 text-sm text-foreground/80 font-medium">
              {ev?.title} · {sel.guests} guests · {shownDateText}, {slot} · {place}
            </p>
          </div>
          <p className="max-w-[16rem] text-sm text-foreground/70">
            <b className="text-foreground">{parties} parties</b> were notified at the same second. Nobody picked up a
            phone.
          </p>
        </div>
      </section>

      {/* 3 Bentos Layout: Bento 1 on Top Full-Width, Bentos 2 & 3 Side-by-Side Underneath */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Bento 1: Instant notifications spanning full width across the top */}
        <section className="col-span-1 md:col-span-2 flex min-h-[19rem] flex-col rounded-2xl border hairline bg-surface-light shadow-sm overflow-hidden">
          <div className="border-b hairline p-3 sm:p-4 bg-surface-light/80">
            <p className="eyebrow text-ink/55">Instant {parties}-way notifications</p>
            <div className="scroll-quiet mt-2 flex gap-1.5 overflow-x-auto">
              {recipients.map((x, i) => (
                <button
                  key={x.who}
                  onClick={() => setTab(i)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                    tab === i ? "bg-ink text-canvas shadow-xs" : "bg-muted hover:bg-secondary text-ink/75",
                  )}
                >
                  {x.who}
                </button>
              ))}
            </div>
          </div>
          <div className="scroll-quiet min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 text-xs">
            <dl className="grid grid-cols-[4.5rem_1fr] gap-y-1.5 border-b hairline pb-3">
              <dt className="eyebrow text-ink/45">From</dt>
              <dd className="font-mono text-ink/90">Bondz Events &lt;confirm@bondzevents.com&gt;</dd>
              <dt className="eyebrow text-ink/45">To</dt>
              <dd className="font-mono text-ink/90">{r.to}</dd>
              <dt className="eyebrow text-ink/45">Subject</dt>
              <dd className="font-bold text-ink">{r.subj}</dd>
            </dl>
            <p className="mt-3.5 whitespace-pre-line leading-relaxed text-ink/80 font-sans">{r.body}</p>
          </div>
        </section>

        {/* Bento 2: Guest Invitation (Underneath, Left) */}
        <section className="col-span-1 flex flex-col justify-between gap-3.5 rounded-2xl border hairline bg-surface-light p-4 sm:p-5 shadow-sm">
          <div>
            <p className="eyebrow text-ink/55">Your VIP guest invitation card</p>
            <div className="mt-3.5 flex flex-col md:flex-row gap-4 items-stretch">
              <div className="flex-1 space-y-3">
                <div>
                  <span className="eyebrow text-ink/45 text-[0.65rem] block mb-1">Invitation headline</span>
                  <input
                    value={head}
                    onChange={(e) => setHead(e.target.value)}
                    aria-label="Invitation headline"
                    className="w-full rounded-xl border hairline bg-canvas px-3 py-2 text-xs font-semibold outline-none focus:border-primary text-ink"
                  />
                </div>
                <div>
                  <span className="eyebrow text-ink/45 text-[0.65rem] block mb-1">Tagline</span>
                  <input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    aria-label="Invitation tagline"
                    className="w-full rounded-xl border hairline bg-canvas px-3 py-2 text-xs font-medium outline-none focus:border-primary text-ink"
                  />
                </div>
                <div className="pt-1">
                  <span className="eyebrow text-ink/45 text-[0.65rem] block mb-1.5">Color palette</span>
                  <div className="flex items-center gap-2">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t)}
                        title={t.name}
                        aria-label={t.name}
                        aria-pressed={theme.id === t.id}
                        className={cn(
                          "relative size-7 rounded-full border hairline transition-transform hover:scale-105",
                          theme.id === t.id && "ring-2 ring-primary ring-offset-2 ring-offset-surface-light",
                        )}
                        style={{ background: t.bg }}
                      >
                        {theme.id === t.id && (
                          <span
                            className="absolute inset-0 grid place-items-center text-[0.6rem] font-black"
                            style={{ color: t.fg }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                    <span className="eyebrow text-ink/60 ml-1 text-[0.68rem] font-mono">{theme.name}</span>
                  </div>
                </div>
              </div>

              {/* High-Fidelity Proportional Card Preview */}
              <div className="w-full sm:w-56 md:w-52 shrink-0 flex items-center justify-center">
                <div
                  className="relative w-full aspect-square overflow-hidden rounded-2xl p-4 shadow-xl select-none border hairline flex flex-col justify-between"
                  style={{
                    backgroundImage: `url(${theme.logo === "dark" ? darkTemplate : lightTemplate})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: theme.fg,
                  }}
                >
                  <div className="space-y-1">
                    <p
                      className="text-[0.52rem] font-black tracking-[0.18em] uppercase leading-none"
                      style={{ color: theme.hl }}
                    >
                      YOU’RE INVITED
                    </p>
                    <p className="font-serif-i text-[1.12rem] sm:text-[1.18rem] leading-[1.08] line-clamp-3 font-normal drop-shadow-xs">
                      {head}
                    </p>
                    <p className="font-serif-i text-[0.72rem] line-clamp-1 italic pt-0.5" style={{ color: theme.hl }}>
                      {tag}
                    </p>
                  </div>

                  {/* Date & Location with clearance on right so it never overlaps the bottom-right brand lockup */}
                  <div className="text-[0.58rem] font-mono opacity-90 leading-tight pr-14 pb-0.5">
                    <p className="font-extrabold uppercase tracking-tight truncate">{shownDateText}</p>
                    <p className="truncate opacity-80 mt-0.5">
                      {slot} · {place}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t hairline">
            <button
              onClick={download}
              className="rounded-full bg-ink py-2.5 px-3 text-xs font-bold text-canvas hover:brightness-110 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              Download Invitation Card
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(guestMsg);
                toast.success("Guest message copied");
              }}
              className="rounded-full border hairline bg-surface-light py-2.5 px-3 text-xs font-bold text-ink hover:bg-canvas active:scale-95 transition-all cursor-pointer"
            >
              Copy guest message
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Read-only invitation link copied");
              }}
              className="rounded-full border hairline bg-surface-light py-2.5 px-3 text-xs font-bold text-ink hover:bg-canvas active:scale-95 transition-all cursor-pointer"
            >
              Copy Invitation Link
            </button>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center rounded-full border hairline bg-surface-light py-2.5 px-3 text-xs font-bold text-ink hover:bg-canvas active:scale-95 transition-all cursor-pointer"
            >
              Open Invitation Link
            </a>
          </div>
        </section>

        {/* Bento 3: Receipt & Signed Contract (Underneath, Right) with 2x2 Button Grid */}
        <section className="col-span-1 flex flex-col justify-between rounded-2xl border hairline bg-surface-light p-5 shadow-sm">
          <div>
            <p className="eyebrow text-ink/55">Receipt & signed contract</p>
            <p className="display mt-3 text-4xl sm:text-5xl tabular-nums font-black text-ink">{money(est.total)}</p>
            <p className="text-xs font-semibold text-primary mt-1">
              {money(est.deposit)} paid today · {money(est.balance)} balance 7 days prior
            </p>
            <ul className="mt-4 space-y-2 text-xs text-ink/80">
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Signed service agreement (8 legal clauses)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Itemised vendor & venue breakdown
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Dual verified digital signature blocks
              </li>
            </ul>
          </div>

          {/* 2x2 Receipt button grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-5 border-t hairline mt-4">
            <Primary onClick={printPdf} className="w-full text-center py-2.5 text-xs sm:text-sm">
              Download PDF
            </Primary>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 px-3 py-2.5 text-xs sm:text-sm font-bold text-ink hover:border-ink active:scale-95 transition-all text-center cursor-pointer"
            >
              Add to Google Cal ↗
            </a>
            <button
              disabled={cancelled}
              onClick={() => setModal("reschedule")}
              className="rounded-full bg-ink px-3 py-2.5 text-xs sm:text-sm font-bold text-canvas hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Reschedule Event
            </button>
            <button
              disabled={cancelled}
              onClick={() => setModal("cancel")}
              className="rounded-full border border-destructive/40 text-destructive px-3 py-2.5 text-xs sm:text-sm font-bold hover:bg-destructive/10 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel Booking
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-ink/60">
            <button
              onClick={reset}
              className="font-bold underline underline-offset-4 hover:text-primary cursor-pointer"
            >
              Book another celebration
            </button>
            <a href="/" className="font-bold underline underline-offset-4 hover:text-primary">
              Return to home
            </a>
          </div>
        </section>
      </div>

      {modal === "reschedule" && (
        <RescheduleModal
          onClose={() => setModal(null)}
          total={est.total}
          current={activeDay}
          sel={sel}
          anchor={anchor}
          onConfirm={(d) => {
            setMovedDay(d);
            setModal(null);
          }}
        />
      )}
      {modal === "cancel" && (
        <CancelModal
          onClose={() => setModal(null)}
          deposit={est.deposit}
          onConfirm={() => {
            setCancelled(true);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
