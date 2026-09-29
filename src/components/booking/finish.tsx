import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { CATEGORIES, EVENT_TYPES, TERMS, VENUES, assignPartner, dayToDate, estimate, money, priceOf } from "@/lib/bondz-data";
import { signalBot } from "@/lib/bot-bus";
import { cn } from "@/lib/utils";
import { StepHead } from "./panels";
import { Ghost, Primary } from "./steps";
import { useBooking } from "./store";
import { triggerHaptic, playTapSound, isSoundEnabled, playConfirmFlourish } from "@/lib/haptics";

/* ───────────────── helpers ───────────────── */
function useSummary() {
  const b = useBooking();
  const { sel, day, slot, anchor, details } = b;
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  const ev = EVENT_TYPES.find((e) => e.id === sel.event);
  const date = day ? dayToDate(anchor, day) : null;
  const dateStr = date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) ?? "";
  const assigned = day
    ? sel.services.map((c) => ({ cat: CATEGORIES.find((x) => x.id === c)!.label, p: assignPartner(c, sel, day) })).filter((x) => x.p)
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
      <input {...rest} className="mt-1 w-full rounded-xl border hairline bg-surface-light px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25" />
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
    ctx.strokeStyle = getComputedStyle(c).color;
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
            ctx.beginPath();
            ctx.moveTo(...pos(e));
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const ctx = ref.current!.getContext("2d")!;
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
        {empty && <span className="pointer-events-none absolute inset-0 grid place-items-center text-xs text-ink/40">Sign here with mouse or finger</span>}
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
  const { sel, day, slot, details, setDetails, signature, setSignature, setStep, setRef, est, parties, demo } = s;
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState(0);

  const ready = day !== null && slot !== null && details.name.trim() && /\S+@\S+\.\S+/.test(details.email) && details.phone.trim().length >= 6 && agree && signature;
  const missing = day === null || slot === null ? "a valid date and time" : !details.name.trim() ? "your name" : !/\S+@\S+\.\S+/.test(details.email) ? "a valid email" : details.phone.trim().length < 6 ? "a phone number" : !agree ? "agreement to the terms" : "your signature";

  const pay = () => {
    if (demo) return;
    setLoading(true);
    signalBot({ mood: "think" });
    [1, 2, 3, 4].forEach((i) => window.setTimeout(() => setPhase(i), i * 750));
    window.setTimeout(() => {
      setRef("BZ-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + String(Date.now()).slice(-4));
      setStep(6);
    }, 3700);
  };

  const set = (k: keyof typeof details) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDetails({ ...details, [k]: e.target.value });

  const checklist = [
    `Calculating sample deposit of ${money(est.deposit)}`,
    `Checking ${parties - 1} partner calendars`,
    "Preparing agreement preview",
    `Preparing ${parties}-way dispatch preview`,
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_21rem]">
      <div className="flex flex-col gap-4">
        <StepHead no="05" title="Your details." sub="Create a sample booking brief. No payment is taken and no date is held." />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name" value={details.name} onChange={set("name")} autoComplete="name" required />
          <Field label="Phone" value={details.phone} onChange={set("phone")} type="tel" autoComplete="tel" required />
          <Field label="Email" value={details.email} onChange={set("email")} type="email" autoComplete="email" required />
          <Field label="Guest of honor (optional)" value={details.honor} onChange={set("honor")} />
          {(day === null || slot === null) && <p className="text-xs text-primary sm:col-span-2">Please return to Dates and choose a time.</p>}
          <label className="block sm:row-span-1">
            <span className="eyebrow text-ink/60">Anything we should know?</span>
            <textarea value={details.notes} onChange={set("notes")} rows={1} className="mt-1 w-full resize-none rounded-xl border hairline bg-surface-light px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/25" />
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-1 text-ink/60">Service agreement · 8 clauses</p>
            <ol className="scroll-quiet h-40 overflow-y-auto rounded-xl border hairline bg-surface-light p-3 text-[0.72rem] leading-relaxed">
              {TERMS.map((t, i) => (
                <li key={t.t} className="mb-2">
                  <b>{i + 1}. {t.t}.</b> <span className="text-ink/70">{t.b}</span>
                </li>
              ))}
            </ol>
            <label className="mt-2 flex items-start gap-2 text-xs">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-4 accent-primary" />
              <span>I've read and agree to the service agreement, including the cancellation tiers.</span>
            </label>
          </div>
          <div>
            <p className="eyebrow mb-1 text-ink/60">Signature</p>
            <SignaturePad onChange={setSignature} />
          </div>
        </div>
        <div className="pl-20"><Ghost onClick={() => setStep(4)}>← Back</Ghost></div>
      </div>

      <aside className="dark flex flex-col rounded-2xl bg-background p-5 text-foreground lg:sticky lg:top-0 lg:self-start">
        <p className="eyebrow text-primary">Demo deposit - no payment collected</p>
        <p className="display mt-3 text-6xl tabular-nums">{money(est.deposit)}</p>
        <p className="mt-1 text-xs text-foreground/60">illustrative 25% deposit · 75% balance {money(est.balance)} due 7 days before</p>
        <p className="mt-5 text-xs text-foreground/70">This is a client-side preview. No card details are requested, no money is collected and no notifications are sent.</p>
        <Primary disabled={!ready || demo} onClick={pay} className="mt-5 w-full py-4">
          Create sample booking
        </Primary>
        {!ready && <p className="mt-2 text-center text-[0.7rem] text-foreground/50">Still need {missing}.</p>}
      </aside>

      {loading && (
        <div className="dark fixed inset-0 z-[100] grid place-items-center bg-night/95 backdrop-blur-xl text-foreground px-4">
          <div className="w-full max-w-lg rounded-card border border-hairline bg-surface p-7 sm:p-9 shadow-raised">
            {/* Luxury Dual-Ring Orbital Animation */}
            <div className="relative flex items-center justify-center size-20">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-primary animate-spin [animation-duration:1.2s]" />
              <div className="absolute inset-2 rounded-full border-2 border-white/10 border-b-primary/60 border-l-primary/40 animate-spin [animation-duration:2s] [animation-direction:reverse]" />
              <div className="relative flex size-9 items-center justify-center rounded-full bg-primary/15 border border-primary/40">
                <span className="text-[0.65rem] font-black tracking-wider text-primary">BZ</span>
              </div>
            </div>

            <h2 className="display mt-6 text-3xl sm:text-4xl text-white tracking-tight">Preparing your preview</h2>
            <p className="mt-1 text-xs text-white/60">Preparing a simulated confirmation. No partner calendars are locked.</p>

            <ul className="mt-6 space-y-3">
              {checklist.map((c, i) => (
                <li
                  key={c}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-2.5 text-xs sm:text-sm font-medium transition-all duration-500",
                    phase > i
                      ? "border-success/30 bg-success/10 text-white translate-x-0"
                      : "border-white/5 bg-white/2 text-white/40 -translate-x-1"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-black transition-all",
                      phase > i ? "bg-success text-success-foreground shadow-xs" : "border border-white/20 text-white/30"
                    )}
                  >
                    {phase > i ? "✓" : i + 1}
                  </span>
                  <span>{c}</span>
                  {phase === i && (
                    <span className="ml-auto inline-block size-2 rounded-full bg-primary animate-ping" />
                  )}
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
    const colors = ["--accent-brand", "--success", "--canvas", "--surface-light"].map((v) => css.getPropertyValue(v).trim());
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
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  { id: "coral", name: "Coral Night", bg: "oklch(0.24 0.05 290)", fg: "oklch(0.97 0.015 85)", hl: "oklch(0.68 0.2 32)", logo: "dark" as const },
  { id: "golden", name: "Golden Hour", bg: "oklch(0.84 0.12 75)", fg: "oklch(0.2 0.03 290)", hl: "oklch(0.52 0.19 30)", logo: "light" as const },
  { id: "garden", name: "Garden", bg: "oklch(0.88 0.06 150)", fg: "oklch(0.22 0.04 160)", hl: "oklch(0.5 0.12 155)", logo: "light" as const },
  { id: "tie", name: "Black Tie", bg: "oklch(0.1 0 0)", fg: "oklch(0.97 0.015 85)", hl: "oklch(0.64 0.21 28)", logo: "dark" as const },
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

/* ───────────────── STEP 6 ───────────────── */
export function Step6() {
  const s = useSummary();
  const { ev, sel, dateStr, slot, place, ref, parties, assigned, venue, details, est, signature, reset, demo, anchor, day, vibes } = s;
  const [tab, setTab] = useState(0);
  const [head, setHead] = useState(`${details.honor || details.name.split(" ")[0] || "You"}’s ${ev?.title ?? "Celebration"}`);
  const [tag, setTag] = useState("Come hungry. Leave with stories.");
  const [theme, setTheme] = useState(THEMES[0]!);

  useEffect(() => {
    if (demo) return;
    // Tactile synthetic confirm first, then the recorded human celebration.
    playConfirmFlourish();
    cheer();
    signalBot({ mood: "happy", tip: "Your sample booking is ready. No messages have been sent." });

    let audio: HTMLAudioElement | null = null;
    let fadeInterval: number | null = null;
    let stopTimeout: number | null = null;
    let startTimeout: number | null = null;

    if (isSoundEnabled()) {
      try {
        audio = new Audio("/celebration.wav");
        audio.volume = 0.85;
        startTimeout = window.setTimeout(() => audio?.play().catch(() => {}), 520);

        // Play celebration audio for first 5.8s, then smooth fade out over 1s (total ~6.8s)
        stopTimeout = window.setTimeout(() => {
          fadeInterval = window.setInterval(() => {
            if (audio && audio.volume > 0.08) {
              audio.volume = Math.max(0, audio.volume - 0.1);
            } else if (audio) {
              audio.pause();
              if (fadeInterval) window.clearInterval(fadeInterval);
            }
          }, 80);
        }, 6300);
      } catch {
        /* audio optional */
      }
    }

    return () => {
      if (startTimeout) window.clearTimeout(startTimeout);
      if (stopTimeout) window.clearTimeout(stopTimeout);
      if (fadeInterval) window.clearInterval(fadeInterval);
      if (audio) {
        audio.pause();
        audio = null;
      }
    };
  }, []);

  const recipients = [
    { who: "Client", to: details.email || "you@example.com", subj: `Sample booking - ${ev?.title} on ${dateStr}`, body: `Hi ${details.name || "there"},\n\nThis is a preview for ${sel.guests} guests on ${dateStr} (${slot}) at ${place}.\n\nSample deposit: ${money(est.deposit)}. Estimated balance: ${money(est.balance)}. Reference: ${ref}. No payment was taken and no date was reserved.` },
    { who: "Mr. Bondz", to: "Organizer preview", subj: `Sample brief ${ref} · ${ev?.title}`, body: `Preview only - not sent.\nClient: ${details.name} · ${details.phone} · ${details.email}\nWhen: ${dateStr}, ${slot}\nWhere: ${place}\nCelebration vibe: ${vibes.join(", ") || "Not specified"}\nSuggested partners: ${assigned.map((a) => a.p?.name).filter(Boolean).join(", ") || "Solo event"}\nNotes: ${details.notes || "-"}` },
    ...(venue ? [{ who: venue.name, to: "Venue preview", subj: `Sample venue brief - ${dateStr}`, body: `Preview only - not sent. Suggested venue: ${venue.name}. Estimated hire: ${money(venue.price)}. No hold was placed.` }] : []),
    ...assigned.map((a) => ({ who: a.p?.name ?? a.cat, to: "Partner preview", subj: `Sample work order: ${a.cat} · ${dateStr}`, body: `Preview only - not sent. Proposed ${a.cat.toLowerCase()} for ${ev?.title?.toLowerCase()}, ${sel.guests} guests, ${dateStr} (${slot}) at ${place}. Celebration vibe: ${vibes.join(", ") || "Not specified"}. Estimated: ${money(priceOf(a.p!, sel.guests))}.` })),
  ];
  const r = recipients[Math.min(tab, recipients.length - 1)]!;
  const inviteData = day && slot ? { title: head, host: details.name, date: dayToDate(anchor, day).toISOString(), slot, place, tagline: tag } : null;
  const inviteToken = inviteData ? btoa(Array.from(new TextEncoder().encode(JSON.stringify(inviteData)), (byte) => String.fromCharCode(byte)).join("")) : "";
  const link = typeof window !== "undefined" ? `${window.location.origin}/invite/${encodeURIComponent(ref)}?invite=${encodeURIComponent(inviteToken)}` : `/invite/${encodeURIComponent(ref)}?invite=${encodeURIComponent(inviteToken)}`;
  const guestMsg = `${head}\n${tag}\n${dateStr} · ${slot}\n${place}\n\nDetails & RSVP: ${link}`;

  useEffect(() => {
    if (demo || !ref || !day || !slot) return;
    try {
      localStorage.setItem(`bondz_invite_${ref}`, JSON.stringify({ title: head, host: details.name, date: dayToDate(anchor, day).toISOString(), slot, place, tagline: tag }));
    } catch { /* storage may be unavailable */ }
  }, [demo, ref, day, slot, anchor, head, tag, details.name, place]);

  const download = async () => {
    const S = 1080;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const ctx = c.getContext("2d")!;
    await document.fonts.load('italic 110px "Instrument Serif"');
    await document.fonts.load('700 36px "Bricolage Grotesque"');
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, S, S);
    const logoSrc = theme.logo === "dark" ? "/brand-lockup-dark.png" : "/brand-lockup.png";
    const img = await loadImg(logoSrc);
    const w = 380;
    ctx.drawImage(img, S - w - 50, S - (w * img.height) / img.width - 50, w, (w * img.height) / img.width);
    ctx.fillStyle = theme.hl;
    ctx.font = '700 30px "Bricolage Grotesque"';
    ctx.fillText("YOU'RE INVITED", 80, 130);
    ctx.fillStyle = theme.fg;
    ctx.font = 'italic 120px "Instrument Serif"';
    const words = head.split(" ");
    let line = "";
    let y = 290;
    for (const w of words) {
      if (ctx.measureText(line + w).width > S - 160) {
        ctx.fillText(line.trim(), 80, y);
        line = "";
        y += 120;
      }
      line += w + " ";
    }
    ctx.fillText(line.trim(), 80, y);
    ctx.font = 'italic 52px "Instrument Serif"';
    ctx.fillStyle = theme.hl;
    ctx.fillText(tag, 80, y + 90);
    ctx.fillStyle = theme.fg;
    ctx.font = '700 34px "Bricolage Grotesque"';
    ctx.fillText(dateStr.toUpperCase(), 80, y + 200);
    ctx.font = '500 30px "Bricolage Grotesque"';
    ctx.fillText(`${slot} · ${place}`, 80, y + 250);
    const a = document.createElement("a");
    a.download = `bondz-invite-${ref}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  const printPdf = (): void => {
    const w = window.open("", "_blank");
    if (!w) { toast.error("Allow pop-ups to download your contract."); return; }
    const esc = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const rows = est.lines.map((l) => `<tr><td><b>${esc(l.label)}</b><small>${esc(l.note)}</small></td><td style="text-align:right">${money(l.amount)}</td></tr>`).join("");
    const terms = TERMS.map((t, i) => `<li><b>${i + 1}. ${esc(t.t)}.</b> ${esc(t.b)}</li>`).join("");
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Bondz Events Agreement & Receipt - ${ref}</title>
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
  <div><img src="${typeof window !== "undefined" ? window.location.origin : ""}/brand-lockup.png" alt="Bondz Events" class="logo" /></div>
  <div style="text-align:right">
    <div class="k">Service Agreement & Receipt</div>
    <h1>You’re booked.</h1>
    <div style="font-size:9.5px;color:#555;margin-top:2px">Ref <b>${esc(ref)}</b> · Demo only - no payment collected</div>
  </div>
</header>
<div class="meta-grid">
  <div><div class="meta-label">Client</div><div class="meta-val"><b>${esc(details.name)}</b><br>${esc(details.email)}<br>${esc(details.phone)}</div></div>
  <div><div class="meta-label">Event</div><div class="meta-val"><b>${esc(ev?.title)}</b> · ${sel.guests} guests<br>${esc(dateStr)}<br>${esc(slot)}</div></div>
  <div><div class="meta-label">Location & Venue</div><div class="meta-val">${esc(place)}</div></div>
</div>
<table>
  <thead><tr><th>Item & Scope</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    ${rows}
    <tr class="t"><td>Total Event Cost</td><td style="text-align:right">${money(est.total)}</td></tr>
    <tr class="r"><td>Sample Deposit (25%, not paid)</td><td style="text-align:right">${money(est.deposit)}</td></tr>
    <tr class="b"><td>Balance Due (7 Days Prior)</td><td style="text-align:right">${money(est.balance)}</td></tr>
  </tbody>
</table>
<div class="terms-head">Service Agreement & Operating Principles</div>
<ol class="terms">${terms}</ol>
<div class="signatures">
  <div class="sig-box">
    ${signature ? `<img src="${signature}" alt="Client Signature" />` : ""}
    <span class="sig-label">Client preview signature - ${esc(details.name)}</span>
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
        {!demo && <Confetti />}
        <div className="relative grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow flex flex-wrap items-center gap-3">
              <span className="text-foreground/60 font-mono">Ref {ref}</span>
              <span className="rounded-full bg-success px-2.5 py-1 text-success-foreground font-bold">✓ Demo booking - no payment</span>
            </p>
            <h1 className="mt-3 text-[clamp(3rem,min(8vw,13vh),7.5rem)] font-extrabold leading-[0.85] tracking-[-0.04em]">
              You’re <span className="font-serif-i text-primary">Almost Booked!</span>
            </h1>
            <p className="mt-3 text-sm text-foreground/80 font-medium">
              {ev?.title} · {sel.guests} guests · {dateStr}, {slot} · {place}
            </p>
          </div>
          <p className="max-w-[16rem] text-sm text-foreground/70">
            <b className="text-foreground">{parties} parties</b> in the simulated dispatch. No messages were sent.
          </p>
        </div>
      </section>

      {/* 3 Bentos Layout: Bento 1 on Top Full-Width, Bentos 2 & 3 Side-by-Side Underneath */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Bento 1: Instant notifications spanning full width across the top */}
        <section className="col-span-1 md:col-span-2 flex min-h-[19rem] flex-col rounded-2xl border hairline bg-surface-light shadow-sm overflow-hidden">
          <div className="border-b hairline p-3 sm:p-4 bg-surface-light/80">
            <p className="eyebrow text-ink/55">Simulated {parties}-way dispatch - messages not sent</p>
            <div className="scroll-quiet mt-2 flex gap-1.5 overflow-x-auto">
              {recipients.map((x, i) => (
                <button
                  key={x.who}
                  onClick={() => setTab(i)}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                    tab === i ? "bg-ink text-canvas shadow-xs" : "bg-muted hover:bg-secondary text-ink/75"
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
            <p className="eyebrow text-ink/55">Your guest invitation</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_9rem] gap-3.5">
              <div className="space-y-2.5">
                <input
                  value={head}
                  onChange={(e) => setHead(e.target.value)}
                  aria-label="Invitation headline"
                  className="w-full rounded-xl border hairline bg-canvas px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                />
                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  aria-label="Invitation tagline"
                  className="w-full rounded-xl border hairline bg-canvas px-3 py-2 text-xs font-medium outline-none focus:border-primary"
                />
                <div className="flex items-center gap-2 pt-1">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      title={t.name}
                      aria-label={t.name}
                      aria-pressed={theme.id === t.id}
                      className={cn(
                        "relative size-7 rounded-full border hairline transition-transform hover:scale-105",
                        theme.id === t.id && "ring-2 ring-primary ring-offset-2 ring-offset-surface-light"
                      )}
                      style={{ background: t.bg }}
                    >
                      {theme.id === t.id && (
                        <span className="absolute inset-0 grid place-items-center text-[0.6rem] font-black" style={{ color: t.fg }}>
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                  <span className="eyebrow text-ink/50 ml-1 text-[0.68rem]">{theme.name}</span>
                </div>
              </div>
              <div
                className="relative aspect-square overflow-hidden rounded-xl p-3 shadow-md select-none shrink-0"
                style={{ background: theme.bg, color: theme.fg }}
              >
                <img
                  src={theme.logo === "dark" ? "/brand-lockup-dark.png" : "/brand-lockup.png"}
                  alt="Bondz Events"
                  className="absolute bottom-2.5 right-2.5 w-[38%] object-contain"
                />
                <p className="relative text-[0.45rem] font-bold tracking-[0.16em] uppercase" style={{ color: theme.hl }}>
                  YOU’RE INVITED
                </p>
                <p className="font-serif-i relative mt-1.5 text-[1.02rem] leading-[0.95] line-clamp-3">{head}</p>
                <p className="font-serif-i relative mt-1 text-[0.60rem]" style={{ color: theme.hl }}>
                  {tag}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t hairline">
            <button
              onClick={download}
              className="rounded-full bg-ink py-2.5 px-3 text-xs font-bold text-canvas hover:brightness-110 active:scale-95 transition-all shadow-xs"
            >
              Download image
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(guestMsg);
                toast.success("Guest message copied");
              }}
              className="rounded-full border hairline bg-surface-light py-2.5 px-3 text-xs font-bold text-ink hover:bg-canvas active:scale-95 transition-all"
            >
              Copy guest message
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Read-only booking link copied");
              }}
              className="col-span-2 rounded-full border hairline bg-surface-light py-2.5 text-xs font-bold text-ink hover:bg-canvas active:scale-95 transition-all"
            >
              Copy booking link <span className="font-normal text-ink/50">· read-only, for guests</span>
            </button>
          </div>
        </section>

        {/* Bento 3: Receipt & Signed Contract (Underneath, Right) */}
        <section className="col-span-1 flex flex-col justify-between rounded-2xl border hairline bg-surface-light p-5 shadow-sm">
          <div>
            <p className="eyebrow text-ink/55">Sample receipt & agreement</p>
            <p className="display mt-3 text-4xl sm:text-5xl tabular-nums font-black text-ink">{money(est.total)}</p>
            <p className="text-xs font-semibold text-primary mt-1">
              {money(est.deposit)} demo deposit · {money(est.balance)} balance 7 days prior
            </p>
            <ul className="mt-4 space-y-2 text-xs text-ink/80">
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Signed service agreement (8 legal clauses)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Itemised vendor & venue breakdown
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success font-bold">✓</span> Client signature preview
              </li>
            </ul>
          </div>
          <div className="space-y-2 pt-6 border-t hairline mt-4">
            <button onClick={() => {
              if (!day || !slot) return;
              const date = dayToDate(anchor, day);
              const start = new Date(date);
              start.setHours(slot === "Morning" ? 10 : slot === "Afternoon" ? 14 : 17, 0, 0, 0);
              const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
              const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
              const safe = (text: string) => text.replace(/[\\;,\n]/g, " ");
              const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Bondz Events//Booking//EN\r\nBEGIN:VEVENT\r\nUID:${safe(ref)}@bondzevents.lovable.app\r\nDTSTAMP:${stamp(new Date())}\r\nDTSTART:${stamp(start)}\r\nDTEND:${stamp(end)}\r\nSUMMARY:${safe(ev?.title ?? "Celebration")} with Mr. Bondz\r\nLOCATION:${safe(place)}\r\nDESCRIPTION:Booking reference ${safe(ref)} - demonstration only\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
              const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
              const a = document.createElement("a"); a.href = url; a.download = `bondz-${ref}.ics`; a.click();
              window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            }} className="w-full rounded-full border hairline py-2.5 text-xs sm:text-sm font-bold text-ink hover:bg-canvas">Download calendar .ics</button>
            <Link to="/invite/$ref" params={{ ref }} search={{ invite: inviteToken }} className="block w-full rounded-full border hairline py-2.5 text-center text-xs sm:text-sm font-bold text-ink hover:bg-canvas">View VIP invitation</Link>
            <Primary onClick={printPdf} className="w-full text-center">
              Download / Print PDF
            </Primary>
            <button
              onClick={reset}
              className="w-full rounded-full border hairline py-2.5 text-xs sm:text-sm font-bold text-ink hover:bg-canvas active:scale-95 transition-all"
            >
              Book another celebration
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
