import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button, Card, cn, triggerTap } from "@/index";
import {
  CATEGORIES, DEPOSIT_RATE, HORIZON, RESCHEDULE_FEE_RATE, SLOT_TIMES, VENUES,
  assignPartner, availableDays, dayToDate, estimate, usd,
  type Sel,
} from "@/lib/bondz-data";
import { Portal, StepHead, type BookingCtx } from "./shared";

const THEMES = [
  { id: "coral", name: "Coral Night", bg: "var(--invite-coral-bg)", fg: "var(--invite-coral-fg)", hi: "var(--invite-coral-hi)" },
  { id: "golden", name: "Golden Hour", bg: "var(--invite-golden-bg)", fg: "var(--invite-golden-fg)", hi: "var(--invite-golden-hi)" },
  { id: "garden", name: "Garden", bg: "var(--invite-garden-bg)", fg: "var(--invite-garden-fg)", hi: "var(--invite-garden-hi)" },
  { id: "tie", name: "Black Tie", bg: "var(--invite-tie-bg)", fg: "var(--invite-tie-fg)", hi: "var(--invite-tie-hi)" },
] as const;

export function Step6Booked({ ctx, code, onRestart }: { ctx: BookingCtx; code: string; onRestart: () => void }) {
  const { sel, details, day, slot, anchor, vibes } = ctx;
  const est = estimate(sel);
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  const date = day !== null && anchor ? dayToDate(anchor, day) : null;
  const dateText = date ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "—";

  const [theme, setTheme] = useState<(typeof THEMES)[number]>(THEMES[0]);
  const [headline, setHeadline] = useState(`${details.honor || details.name || "Our"}'s Celebration`);
  const [tagline, setTagline] = useState("Come hungry. Leave with stories.");
  const [modal, setModal] = useState<null | "reschedule" | "cancel">(null);
  const [cancelled, setCancelled] = useState(false);
  const [movedTo, setMovedTo] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const shownDate = movedTo !== null && anchor ? dayToDate(anchor, movedTo) : date;
  const shownText = shownDate ? shownDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : dateText;

  const notified = [
    { who: "You (Host)", what: "Receipt, formal agreement & invite card" },
    ...(venue ? [{ who: venue.name, what: `Locked for ${shownText}` }] : []),
    ...sel.services.map((c) => {
      const p = day !== null ? assignPartner(c, sel, day) : null;
      return { who: p?.name ?? CATEGORIES.find((x) => x.id === c)!.label, what: `${CATEGORIES.find((x) => x.id === c)!.label} work order · ${sel.guests} guests` };
    }),
    { who: "Mr. Bondz", what: "Master on-site production brief" },
  ];

  const calendarUrl = (() => {
    if (!shownDate) return "#";
    const d = `${shownDate.getFullYear()}${String(shownDate.getMonth() + 1).padStart(2, "0")}${String(shownDate.getDate()).padStart(2, "0")}`;
    const next = new Date(shownDate); next.setDate(next.getDate() + 1);
    const d2 = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, "0")}${String(next.getDate()).padStart(2, "0")}`;
    const q = new URLSearchParams({ action: "TEMPLATE", text: headline, dates: `${d}/${d2}`, details: `${tagline}\nBondz Events · ${code}`, location: venue ? `${venue.name}, ${venue.area}` : "Host's private property" });
    return `https://calendar.google.com/calendar/render?${q.toString()}`;
  })();

  const copyLink = async () => {
    triggerTap();
    try { await navigator.clipboard.writeText(`${window.location.origin}/invite/${code}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ }
  };

  const receipt = () => {
    const w = window.open("", "_blank"); if (!w) return;
    const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
    const lines = est.lines.map((l) => `<tr><td style="padding:6px 0">${esc(l.label)}</td><td style="text-align:right">${esc(usd(l.amount))}</td></tr>`).join("");
    w.document.write(`<html><head><title>Bondz Events receipt ${esc(code)}</title></head><body style="font-family:Georgia,serif;padding:48px;max-width:640px;color:#130f16"><h1 style="font-size:28px">Bondz Events</h1><p><b>Reference:</b> ${esc(code)}<br/><b>Client:</b> ${esc(details.name)}<br/><b>Event:</b> ${esc(headline)}<br/><b>Date:</b> ${esc(shownText)}${slot ? ` · ${esc(slot)} (${esc(SLOT_TIMES[slot])})` : ""}<br/><b>Guests:</b> ${esc(sel.guests)}<br/><b>Location:</b> ${venue ? esc(`${venue.name}, ${venue.area}`) : "Host's private property"}</p><table style="width:100%;border-top:1px solid #ccc;border-bottom:1px solid #ccc;margin:16px 0">${lines}</table><p><b>Total:</b> ${esc(usd(est.total))}<br/><b>Deposit paid (${Math.round(DEPOSIT_RATE * 100)}%):</b> ${esc(usd(est.deposit))}<br/><b>Balance due:</b> ${esc(usd(est.balance))}</p><p style="font-size:12px;color:#555">Signed and accepted by ${esc(details.name)}. Same-day reschedule free · within 3 days 5% fee. Same-day cancellation refunded in full · afterwards the deposit is retained.</p></body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  return (
    <>
      <StepHead no="06" kicker={cancelled ? "Booking cancelled" : "You're booked"} title={cancelled ? "Cancelled —" : "It's official."} accent={cancelled ? "refund issued." : "Everyone knows."}>
        Reference <strong className={cn("text-ink", cancelled && "line-through")}>{code}</strong> · {shownText}{slot ? ` · ${slot}` : ""}
      </StepHead>

      {/* Bento 1 — invitation card */}
      <Card variant="elevated" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase text-subtle">Your invitation card</p>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button key={t.id} type="button" aria-pressed={theme.id === t.id} onClick={() => { triggerTap(); setTheme(t); }}
                className={cn("min-h-11 rounded-full border px-3 text-xs font-bold transition-colors", theme.id === t.id ? "border-primary text-primary" : "border-hairline text-subtle hover:border-ink")}>
                <span className="mr-2 inline-block size-3 rounded-full align-middle" style={{ background: t.bg }} aria-hidden />{t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-card p-6 sm:p-10" style={{ background: theme.bg, color: theme.fg }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.hi }}>Bondz Events invites you</p>
          <input aria-label="Invitation headline" value={headline} onChange={(e) => setHeadline(e.target.value)}
            className="mt-3 w-full bg-transparent font-serif text-4xl leading-tight outline-none sm:text-6xl" style={{ color: theme.fg }} />
          <input aria-label="Invitation tagline" value={tagline} onChange={(e) => setTagline(e.target.value)}
            className="mt-2 w-full bg-transparent font-serif text-lg italic outline-none" style={{ color: theme.hi }} />
          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-4">
            <Cell k="Date" v={shownText} fg={theme.fg} hi={theme.hi} />
            <Cell k="Time" v={slot ? SLOT_TIMES[slot] : "TBC"} fg={theme.fg} hi={theme.hi} />
            <Cell k="Where" v={venue ? `${venue.name}, ${venue.area}` : "Host's private property"} fg={theme.fg} hi={theme.hi} />
            <Cell k="Attire" v={vibes[0] ?? "Come as you are"} fg={theme.fg} hi={theme.hi} />
          </dl>
          <p className="mt-8 text-xs tracking-widest" style={{ color: theme.hi }}>REF {code}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a href={calendarUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-control border border-hairline px-4 text-sm font-bold text-ink transition-colors hover:border-ink">+ Add to Google Calendar</a>
          <Button variant="outline" onClick={copyLink}>{copied ? "Link copied ✓" : "Copy invite link"}</Button>
        </div>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Bento 2 — dispatch */}
        <Notified rows={notified} />

        {/* Bento 3 — receipt */}
        <Card variant="elevated">
          <p className="text-xs font-bold uppercase text-subtle">Receipt</p>
          <dl className="mt-4 space-y-2 text-sm">
            {est.lines.map((l) => <div key={l.label} className="flex justify-between gap-3"><dt className="text-subtle">{l.label}</dt><dd className="tabular-nums text-ink">{usd(l.amount)}</dd></div>)}
          </dl>
          <div className="mt-4 space-y-2 border-t border-hairline pt-4 text-sm">
            <div className="flex justify-between gap-3"><span className="text-subtle">Total</span><span className="font-serif text-2xl text-ink">{usd(est.total)}</span></div>
            <div className="flex justify-between gap-3"><span className="text-subtle">Deposit paid</span><span className="font-bold text-primary">{cancelled ? usd(0) : usd(est.deposit)}</span></div>
            <div className="flex justify-between gap-3"><span className="text-subtle">Balance due</span><span className="text-ink">{usd(est.balance)}</span></div>
          </div>
          <p className="mt-4 rounded-control bg-surface-light p-3 text-xs text-subtle">
            Reschedule free on the booking day · 5% fee within 3 days. Cancel on the booking day for a full refund · afterwards the deposit is retained.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={receipt}>Download Receipt PDF</Button>
            <Button variant="dark" disabled={cancelled} onClick={() => setModal("reschedule")}>Reschedule</Button>
            <Button variant="outline" disabled={cancelled} onClick={() => setModal("cancel")}>Cancel booking</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button type="button" onClick={onRestart} className="text-sm font-bold text-ink underline underline-offset-4 hover:text-primary">Start a new booking</button>
            <Link to="/" className="text-sm font-bold text-ink underline underline-offset-4 hover:text-primary">Return to home</Link>
          </div>
        </Card>
      </div>

      {modal === "reschedule" && (
        <RescheduleModal onClose={() => setModal(null)} total={est.total} current={movedTo ?? day} sel={sel} anchor={anchor}
          onConfirm={(d) => { setMovedTo(d); setModal(null); }} />
      )}
      {modal === "cancel" && (
        <CancelModal onClose={() => setModal(null)} deposit={est.deposit} onConfirm={() => { setCancelled(true); setModal(null); }} />
      )}
    </>
  );
}

function Cell({ k, v, fg, hi }: { k: string; v: string; fg: string; hi: string }) {
  return <div><dt className="text-xs uppercase tracking-widest" style={{ color: hi }}>{k}</dt><dd className="mt-1 text-sm" style={{ color: fg }}>{v}</dd></div>;
}

function Notified({ rows }: { rows: { who: string; what: string }[] }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const timers = rows.map((_, i) => setTimeout(() => setShown(i + 1), 240 * (i + 1) + 250));
    return () => timers.forEach(clearTimeout);
  }, [rows.length]);
  return (
    <Card variant="elevated">
      <p className="text-xs font-bold uppercase text-subtle">Who was just notified</p>
      <ul className="mt-4 space-y-3">
        {rows.map((r, i) => (
          <li key={r.who} className={cn("flex items-start gap-3 transition-all duration-300", i < shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0")}>
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-status text-xs text-surface-light" aria-hidden>✓</span>
            <span><span className="block text-sm font-bold text-ink">{r.who}</span><span className="block text-xs text-subtle">{r.what}</span></span>
          </li>
        ))}
      </ul>
      <p className="mt-5 rounded-control bg-ink p-4 font-serif text-lg italic leading-snug text-canvas">
        “Every event includes my physical presence on-site. Once you lock in, all subcontractors are blocked with zero double-booking risk.”
        <span className="mt-2 block font-sans text-xs uppercase not-italic tracking-widest text-canvas/60">The Mr. Bondz Guarantee</span>
      </p>
    </Card>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <Portal>
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/60 p-4 sm:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        className="rise scroll-quiet max-h-full w-full max-w-lg overflow-y-auto rounded-card bg-surface p-6 shadow-[var(--bondz-shadow-popover)]">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-3xl text-ink">{title}</h2>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>✕</Button>
        </div>
        {children}
      </div>
    </div>
    </Portal>
  );
}

function Timing({ value, onChange, later }: { value: "today" | "later"; onChange: (v: "today" | "later") => void; later: string }) {
  return (
    <div role="radiogroup" aria-label="When" className="mt-4 grid grid-cols-2 gap-2">
      {([["today", "Today (booking day)"], ["later", later]] as const).map(([k, l]) => (
        <button key={k} type="button" role="radio" aria-checked={value === k} onClick={() => { triggerTap(); onChange(k); }}
          className={cn("min-h-11 rounded-control border px-3 text-sm font-bold transition-colors", value === k ? "border-primary bg-ink text-canvas" : "border-hairline text-ink hover:border-ink")}>{l}</button>
      ))}
    </div>
  );
}

function RescheduleModal({ onClose, total, current, sel, anchor, onConfirm }:
{ onClose: () => void; total: number; current: number | null; sel: Sel; anchor: Date | null; onConfirm: (d: number) => void }) {
  const [when, setWhen] = useState<"today" | "later">("today");
  const [pick, setPick] = useState<number | null>(null);
  const days = availableDays(sel).filter((d) => d !== current).slice(0, 20);
  const fee = when === "today" ? 0 : Math.round(total * RESCHEDULE_FEE_RATE);
  const fmt = (d: number | null) => (d !== null && anchor ? dayToDate(anchor, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "—");
  return (
    <Modal title="Reschedule date" onClose={onClose}>
      <p className="mt-2 text-sm text-subtle">Current date: <strong className="text-ink">{fmt(current)}</strong>. Only dates that pass The Rule are shown ({HORIZON}-day window).</p>
      <Timing value={when} onChange={setWhen} later="Within 3 days of event" />
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {days.map((d) => (
          <button key={d} type="button" aria-pressed={pick === d} aria-label={fmt(d)} onClick={() => { triggerTap(); setPick(d); }}
            className={cn("flex min-h-12 flex-col items-center justify-center rounded-control border transition-colors", pick === d ? "border-primary bg-primary text-surface-light" : "border-hairline text-ink hover:border-ink")}>
            <span className="text-xs font-bold uppercase opacity-70">{anchor ? dayToDate(anchor, d).toLocaleDateString("en-US", { month: "short" }) : ""}</span>
            <span className="font-serif text-lg leading-none">{anchor ? dayToDate(anchor, d).getDate() : d}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between rounded-control bg-surface-light p-4">
        <span className="text-sm text-subtle">{when === "today" ? "Same-day reschedule" : "5% non-refundable transfer fee"}</span>
        <span className="font-serif text-3xl text-ink">{usd(fee)}</span>
      </div>
      <Button className="mt-4 w-full" disabled={pick === null} onClick={() => pick !== null && onConfirm(pick)}>
        {pick === null ? "Pick a new date" : `Move to ${fmt(pick)} · ${usd(fee)} fee`}
      </Button>
    </Modal>
  );
}

function CancelModal({ onClose, deposit, onConfirm }: { onClose: () => void; deposit: number; onConfirm: () => void }) {
  const [when, setWhen] = useState<"today" | "later">("today");
  const [confirm, setConfirm] = useState(false);
  const refund = when === "today" ? deposit : 0;
  return (
    <Modal title="Cancel booking" onClose={onClose}>
      <p className="mt-2 text-sm text-subtle">Refunds follow the terms you signed.</p>
      <Timing value={when} onChange={setWhen} later="After booking day" />
      <dl className="mt-5 space-y-2 rounded-control bg-surface-light p-4 text-sm">
        <div className="flex justify-between"><dt className="text-subtle">Deposit paid</dt><dd className="font-bold text-ink">{usd(deposit)}</dd></div>
        <div className="flex justify-between"><dt className="text-subtle">Retained</dt><dd className="font-bold text-ink">{usd(deposit - refund)}</dd></div>
        <div className="flex items-end justify-between border-t border-hairline pt-2">
          <dt className="text-subtle">{when === "today" ? "100% full refund" : "Deposit retained (non-refundable)"}</dt>
          <dd className="font-serif text-3xl text-primary">{usd(refund)}</dd>
        </div>
      </dl>
      <label className="mt-4 flex items-start gap-3 text-sm text-ink">
        <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-1 size-4 accent-primary" />
        I formally confirm cancellation and release this date from Mr. Bondz's calendar.
      </label>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>Keep booking</Button>
        <Button className="flex-1" disabled={!confirm} onClick={onConfirm}>Confirm cancellation</Button>
      </div>
    </Modal>
  );
}
