import { useEffect, useState } from "react";
import { Card, cn } from "@/index";
import {
  CATEGORIES, DEPOSIT_RATE, SLOT_TIMES, VENUES, assignPartner, cheapest, dayToDate, estimate, usd,
} from "@/lib/bondz-data";
import { Field, Portal, SignaturePad, StepHead, type BookingCtx } from "./shared";

const CLAUSES = [
  "A 25% deposit is due today to lock the date. The balance is due 7 days before the event.",
  "Mr. Bondz personally attends and captains your event on-site for its full duration.",
  "Once locked, every confirmed partner is blocked from other bookings on your date and shift.",
  "Rescheduling on the booking day is free. Rescheduling within 3 days of the event carries a 5% non-refundable transfer fee.",
  "Cancelling on the booking day is refunded in full. Cancelling afterwards forfeits the 25% deposit.",
  "Final guest count may move by ±10% up to 7 days before the event; larger changes are re-quoted.",
  "The host is responsible for site access, parking and power at private properties.",
  "Partner substitutions of equal or better standing may be made if a partner becomes unavailable; you are notified immediately.",
];

export function Step5Lock({ ctx, onBooked }: { ctx: BookingCtx; onBooked: (ref: string) => void }) {
  const { sel, details, setDetails, day, slot, anchor } = ctx;
  const est = estimate(sel);
  const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
  const parties = 1 + (venue ? 1 : 0) + sel.services.length + 1;

  const [agree, setAgree] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [loading, setLoading] = useState(false);

  const missing: string[] = [];
  if (!details.name.trim()) missing.push("your name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) missing.push("a valid email");
  if (details.phone.replace(/\D/g, "").length < 6) missing.push("a phone number");
  if (!agree) missing.push("the agreement");
  if (!signature) missing.push("your signature");
  if (card.replace(/\D/g, "").length < 12 || exp.replace(/\D/g, "").length < 4 || cvc.replace(/\D/g, "").length < 3) missing.push("card details");
  const ready = missing.length === 0;

  const submit = () => {
    if (!ready) return;
    setLoading(true);
    const code = `BZ-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${String(Date.now()).slice(-4)}`;
    setTimeout(() => onBooked(code), 3700);
  };

  return (
    <>
      <StepHead no="05" kicker="Details & deposit" title="Sign once." accent="Everyone moves.">
        One signature dispatches {parties} work orders — venue, partners and Mr. Bondz.
      </StepHead>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_21rem]">
        <div className="grid gap-5">
          <Card variant="elevated">
            <p className="text-xs font-bold uppercase text-subtle">Your details</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field id="bk-name" label="Full name" value={details.name} onChange={(v) => setDetails({ name: v })} autoComplete="name" />
              <Field id="bk-phone" label="Phone" type="tel" value={details.phone} onChange={(v) => setDetails({ phone: v })} autoComplete="tel" />
              <Field id="bk-email" label="Email" type="email" value={details.email} onChange={(v) => setDetails({ email: v })} autoComplete="email" />
              <Field id="bk-honor" label="Guest of honour (optional)" value={details.honor} onChange={(v) => setDetails({ honor: v })} />
            </div>
            <div className="mt-3">
              <Field id="bk-notes" textarea label="Anything we should know?" value={details.notes} onChange={(v) => setDetails({ notes: v })} placeholder="Allergies, access, must-play songs, surprises…" />
            </div>
          </Card>

          <Card variant="elevated">
            <p className="text-xs font-bold uppercase text-subtle">Service agreement</p>
            <div className="scroll-quiet mt-3 h-40 overflow-y-auto rounded-control border border-hairline bg-surface-light p-4">
              <ol className="space-y-3 text-sm text-subtle">
                {CLAUSES.map((c, i) => <li key={c} className="flex gap-3"><span className="shrink-0 font-bold tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span><span>{c}</span></li>)}
              </ol>
            </div>
            <label className="mt-4 flex items-start gap-3 text-sm text-ink">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 size-4 accent-primary" />
              I have read and accept all eight clauses above.
            </label>
            <p className="mt-5 text-xs font-bold uppercase text-subtle">Signature</p>
            <SignaturePad onChange={setSignature} />
          </Card>
        </div>

        <aside className="grid content-start gap-5">
          <div className="rounded-card bg-ink p-6 text-canvas shadow-[var(--bondz-shadow-raised)]">
            <p className="text-xs font-bold uppercase text-canvas/60">Deposit due today</p>
            <p className="mt-2 font-serif text-6xl tabular-nums">{usd(est.deposit)}</p>
            <p className="mt-2 text-xs text-canvas/50">{Math.round(DEPOSIT_RATE * 100)}% of {usd(est.total)} · balance {usd(est.balance)} due 7 days before</p>
            <dl className="mt-5 space-y-1.5 border-t border-review-hairline pt-4 text-sm">
              {day !== null && anchor && <Row k="Date" v={dayToDate(anchor, day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} />}
              {slot && <Row k="Shift" v={`${slot} · ${SLOT_TIMES[slot]}`} />}
              <Row k="Guests" v={String(sel.guests)} />
              <Row k="Location" v={venue ? venue.name : "Your place"} />
              {sel.services.map((c) => {
                const p = day !== null ? assignPartner(c, sel, day) : cheapest(c, sel.guests, sel.event, venue);
                return <Row key={c} k={CATEGORIES.find((x) => x.id === c)!.label} v={p?.name ?? "—"} />;
              })}
            </dl>
            <div className="mt-5 grid gap-2 border-t border-review-hairline pt-4">
              <input aria-label="Card number" value={card} onChange={(e) => setCard(e.target.value)} className="min-h-11 rounded-control border border-review-hairline bg-transparent px-3 text-sm tabular-nums text-canvas outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-2">
                <input aria-label="Expiry" value={exp} onChange={(e) => setExp(e.target.value)} className="min-h-11 rounded-control border border-review-hairline bg-transparent px-3 text-sm tabular-nums text-canvas outline-none focus:border-primary" />
                <input aria-label="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} className="min-h-11 rounded-control border border-review-hairline bg-transparent px-3 text-sm tabular-nums text-canvas outline-none focus:border-primary" />
              </div>
              <p className="text-xs text-canvas/40">Demo sandbox · no real charge</p>
            </div>
            <button type="button" disabled={!ready} onClick={submit}
              className={cn("mt-5 min-h-12 w-full rounded-control px-4 text-sm font-bold uppercase transition-colors",
                ready ? "bg-primary text-surface-light hover:bg-primary-hover" : "cursor-not-allowed bg-review-hairline text-canvas/40")}>
              Lock in my date · {usd(est.deposit)}
            </button>
            {!ready && <p className="mt-2 text-xs text-canvas/50" aria-live="polite">Still need {missing.join(", ")}.</p>}
          </div>
        </aside>
      </div>

      {loading && <Portal><BookingLoader parties={parties} partners={sel.services.length + (venue ? 1 : 0)} /></Portal>}
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3"><dt className="text-canvas/60">{k}</dt><dd className="text-right">{v}</dd></div>;
}

function BookingLoader({ parties, partners }: { parties: number; partners: number }) {
  const steps = [
    "Authorizing deposit",
    `Locking ${partners} partner calendars`,
    "Writing signed terms & receipt",
    `Emitting ${parties}-way confirmations`,
  ];
  const [done, setDone] = useState(0);
  useEffect(() => {
    const timers = steps.map((_, i) => setTimeout(() => setDone(i + 1), 750 * (i + 1)));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/95 p-4 backdrop-blur-xl" role="status" aria-live="polite">
      <div className="w-full max-w-sm rounded-card border border-review-hairline bg-surface p-9 text-center shadow-[var(--bondz-shadow-popover)]">
        <div className="relative mx-auto size-24">
          <span className="absolute inset-0 animate-[spin_1.2s_linear_infinite] rounded-full border-2 border-transparent border-t-primary" />
          <span className="absolute inset-3 animate-[spin_2s_linear_infinite_reverse] rounded-full border-2 border-transparent border-b-primary/60 border-l-primary/40" />
          <span className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-ink">BZ</span>
        </div>
        <p className="mt-6 font-serif text-2xl text-ink">Completing your booking</p>
        <ul className="mt-5 space-y-2 text-left text-sm">
          {steps.map((s, i) => (
            <li key={s} className={cn("flex items-center gap-3 transition-colors", i < done ? "text-ink" : "text-subtle")}>
              <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border text-xs", i < done ? "border-status bg-status text-surface-light" : "border-hairline")} aria-hidden>{i < done ? "✓" : ""}</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
