import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AppShell, Badge, BrandLockup, Button, Card, cn, playCelebrationSound, playSwitchSound, toggleSound, triggerTap, useSoundState } from "../index";
import { Confetti } from "@/components/site/Confetti";
import {
  ADDONS, BOOK_EVENTS, DEPOSIT_RATE, GUEST_MAX, GUEST_MIN, HORIZON, RESCHEDULE_FEE_RATE, VENUE_PREFS, VIBES,
  bookDayStatus, bookingTotals, guestTier, usd,
  type AddonId, type BookEventId, type DayStatus, type VenuePrefId,
} from "@/lib/bondz-data";

export const Route = createFileRoute("/book")({
  head: () => ({ meta: [
    { title: "Book Your Celebration — Bondz Events" },
    { name: "description", content: "Pick your celebration, lock a date where Mr. Bondz, the venue and every partner are free, and pay a 25% deposit in one sitting." },
    { property: "og:title", content: "Book Your Celebration — Bondz Events" },
    { property: "og:description", content: "Three steps. One date everyone is free. Lock it with a 25% deposit." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: BookingEngine,
});

type Step = 1 | 2 | 3 | 4;
const STEP_LABELS = ["Celebration", "Date & Add-ons", "Confirmation"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAY_MS = 86_400_000;

const STATUS_COPY: Record<DayStatus, string> = { open: "Fully Open (All 3 Locked)", limited: "Limited (Evening Only)", booked: "Booked / Venue Conflict" };

function EventIcon({ id }: { id: BookEventId }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<BookEventId, ReactNode> = {
    wedding: <><circle cx="9" cy="14" r="5" {...common} /><circle cx="15" cy="14" r="5" {...common} /><path d="M10 5l2-2 2 2" {...common} /></>,
    birthday: <><path d="M4 20h16M6 20v-7h12v7M12 13V9" {...common} /><path d="M12 5.5c.8.9.8 2 0 2.5-.8-.5-.8-1.6 0-2.5z" {...common} /></>,
    anniversary: <><path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.5C19 15.6 12 20 12 20z" {...common} /></>,
    dinner: <><path d="M7 3v8M5 3v4a2 2 0 004 0V3M7 11v10M16 3c-2 2-2 6 0 8v10" {...common} /></>,
    corporate: <><rect x="3" y="7" width="18" height="13" rx="1" {...common} /><path d="M9 7V4h6v3M3 12h18" {...common} /></>,
    bbq: <><path d="M4 10h16a8 6 0 01-16 0zM8 16l-2 5M16 16l2 5M9 6c1-1 0-2 1-3M14 6c1-1 0-2 1-3" {...common} /></>,
  };
  return <svg viewBox="0 0 24 24" className="size-7" aria-hidden>{paths[id]}</svg>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-extrabold uppercase tracking-widest text-primary">{children}</p>;
}

function BookingEngine() {
  const sound = useSoundState();
  const [step, setStep] = useState<Step>(1);
  const [today, setToday] = useState<number | null>(null);
  const [eventId, setEventId] = useState<BookEventId>("wedding");
  const [guests, setGuests] = useState(80);
  const [pref, setPref] = useState<VenuePrefId>("venue");
  const [vibes, setVibes] = useState<string[]>(["Black Tie"]);
  const [day, setDay] = useState<number | null>(null);
  const [addons, setAddons] = useState<AddonId[]>(["wine"]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [confetti, setConfetti] = useState(0);
  const [ref, setRef] = useState("");
  const [modal, setModal] = useState<null | "reschedule" | "cancel">(null);
  const [cancelled, setCancelled] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const d = new Date(); d.setHours(0, 0, 0, 0); setToday(d.getTime()); }, []);
  useEffect(() => { canvasRef.current?.closest(".scroll-quiet")?.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const eventIndex = BOOK_EVENTS.findIndex((e) => e.id === eventId);
  const totals = bookingTotals(eventId, guests, pref, addons);
  const tier = guestTier(guests);
  const ev = BOOK_EVENTS[eventIndex];
  const dateOf = (d: number) => (today === null ? null : new Date(today + d * DAY_MS));
  const fmt = (d: number | null) => { const x = d === null ? null : dateOf(d); return x ? x.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "—"; };
  const dayStatus = day === null ? null : bookDayStatus(day, eventIndex, pref);

  useEffect(() => { if (day !== null && bookDayStatus(day, eventIndex, pref) === "booked") setDay(null); }, [eventIndex, pref, day]);

  const go = (s: Step) => { setError(""); setStep(s); };
  const toggleIn = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const pay = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!form.name.trim() || !emailOk || form.phone.replace(/\D/g, "").length < 7) return setError("Add your full name, a valid email and a phone number.");
    if (!agreed || !signed) return setError("Sign the pad and accept the terms to lock your date.");
    setError(""); setPaying(true);
    setTimeout(() => {
      const date = dateOf(day ?? 0)!;
      const code = String(1000 + ((day ?? 0) * 7919 + guests * 31 + eventIndex * 997) % 9000);
      setRef(`BNDZ-${code}-${MONTHS[date.getMonth()]}${String(date.getFullYear()).slice(2)}`);
      setPaying(false); setStep(4); setConfetti((c) => c + 1); playCelebrationSound();
    }, 1200);
  };

  const header = (
    <header className="border-b border-hairline px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <Link to="/" aria-label="Bondz Events home"><BrandLockup className="w-24 sm:w-32" /></Link>
        <div className="hidden items-center gap-1 rounded-full border border-hairline p-1 md:flex" aria-label="Booking progress">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1; const active = Math.min(step, 3) === n; const done = step > n;
            return <span key={label} aria-current={active ? "step" : undefined} className={cn("rounded-full px-3 py-1.5 text-xs font-bold uppercase transition-colors", active ? "bg-ink text-canvas" : done ? "text-primary" : "text-subtle")}>0{n} / {label}</span>;
          })}
        </div>
        <span className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold uppercase text-canvas md:hidden">0{Math.min(step, 3)} / {STEP_LABELS[Math.min(step, 3) - 1]}</span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { toggleSound(); playSwitchSound(!sound); }} aria-pressed={sound} aria-label={sound ? "Mute sound effects" : "Turn on sound effects"} className="min-h-11 rounded-full border border-hairline px-3 text-xs font-bold uppercase text-ink transition-colors hover:bg-surface-light">
            <span className={sound ? "text-primary" : "text-subtle"}>SFX</span> / <span className={!sound ? "text-primary" : "text-subtle"}>Mute</span>
          </button>
          <Link to="/" aria-label="Exit booking"><Button variant="outline" size="icon">✕</Button></Link>
        </div>
      </div>
    </header>
  );

  const footer = step < 4 ? (
    <div className="border-t border-hairline bg-surface px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase text-subtle">Total · 25% deposit</p>
          <p className="truncate font-serif text-2xl text-ink">{usd(totals.total)} <span className="text-primary">· {usd(totals.deposit)}</span></p>
        </div>
        <div className="flex gap-2">
          {step > 1 && <Button variant="outline" onClick={() => go((step - 1) as Step)}>← Back</Button>}
          {step === 1 && <Button onClick={() => go(2)}>Continue to Date & Add-ons →</Button>}
          {step === 2 && <Button disabled={day === null} onClick={() => go(3)}>{day === null ? "Pick a date" : "Proceed to Lock-In →"}</Button>}
          {step === 3 && <Button disabled={paying} onClick={pay}>{paying ? "Processing…" : "Lock In My Date (Pay 25% Deposit)"}</Button>}
        </div>
      </div>
    </div>
  ) : undefined;

  return (
    <AppShell header={header} footer={footer}>
      <Confetti fire={confetti} />
      <div ref={canvasRef} key={step} className="rise mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        {step === 1 && (
          <>
            <Eyebrow>Step 01 · Celebration</Eyebrow>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-6xl">What are we <em className="text-primary">celebrating?</em></h1>
            <div className="mt-8 grid gap-5 lg:grid-cols-12">
              <Card variant="elevated" className="lg:col-span-7">
                <p className="text-xs font-bold uppercase text-subtle">Event type</p>
                <div role="radiogroup" aria-label="Event type" className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {BOOK_EVENTS.map((e) => {
                    const on = e.id === eventId;
                    return (
                      <button key={e.id} type="button" role="radio" aria-checked={on} onClick={() => { triggerTap(); setEventId(e.id); }}
                        className={cn("flex min-h-36 flex-col justify-between rounded-card border p-4 text-left transition-colors", on ? "border-primary bg-ink text-canvas" : "border-hairline bg-surface-light text-ink hover:border-ink")}>
                        <span className="flex items-start justify-between gap-2"><span className={on ? "text-primary" : ""}><EventIcon id={e.id} /></span><Badge size="sm" variant={on ? "accent" : "outline"}>{e.badge}</Badge></span>
                        <span><span className="block font-serif text-xl leading-tight">{e.name}</span><span className={cn("mt-1 block text-xs", on ? "text-canvas/70" : "text-subtle")}>{e.note} · from {usd(e.base)}</span></span>
                      </button>
                    );
                  })}
                </div>
              </Card>
              <div className="grid gap-5 lg:col-span-5">
                <Card variant="elevated">
                  <div className="flex items-center justify-between gap-3"><label htmlFor="guests" className="text-xs font-bold uppercase text-subtle">Guest count</label><Badge variant="accent">{tier.name} · {tier.range}</Badge></div>
                  <p className="mt-3 font-serif text-6xl text-ink">{guests >= GUEST_MAX ? `${GUEST_MAX}+` : guests}<span className="ml-2 font-sans text-sm text-subtle">guests</span></p>
                  <input id="guests" type="range" min={GUEST_MIN} max={GUEST_MAX} step={5} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-4 w-full accent-primary" />
                  <div className="mt-1 flex justify-between text-xs text-subtle"><span>10</span><span>40</span><span>100</span><span>200</span><span>350+</span></div>
                  <p className="mt-4 border-t border-hairline pt-4 text-sm text-subtle">Estimated <strong className="text-ink">{usd(tier.perGuest)}/guest</strong> · guest budget <strong className="text-ink">{usd(totals.guestCost)}</strong></p>
                </Card>
                <Card variant="elevated">
                  <p className="text-xs font-bold uppercase text-subtle">Where’s the party?</p>
                  <div role="radiogroup" aria-label="Venue preference" className="mt-3 grid gap-2">
                    {VENUE_PREFS.map((v) => {
                      const on = v.id === pref;
                      return <button key={v.id} type="button" role="radio" aria-checked={on} onClick={() => { triggerTap(); setPref(v.id); }} className={cn("flex items-center gap-3 rounded-control border p-3 text-left transition-colors", on ? "border-primary bg-surface-light" : "border-hairline hover:border-ink")}>
                        <span className={cn("size-4 shrink-0 rounded-full border-4", on ? "border-primary" : "border-hairline")} aria-hidden />
                        <span><span className="block text-sm font-bold text-ink">{v.title}</span><span className="block text-xs text-subtle">{v.note}{v.surcharge ? ` · +${usd(v.surcharge)}` : ""}</span></span>
                      </button>;
                    })}
                  </div>
                </Card>
              </div>
              <Card variant="elevated" className="lg:col-span-12">
                <p className="text-xs font-bold uppercase text-subtle">Celebration vibe · pick any</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {VIBES.map((v) => { const on = vibes.includes(v); return <button key={v} type="button" aria-pressed={on} onClick={() => { triggerTap(); setVibes(toggleIn(vibes, v)); }} className={cn("min-h-11 rounded-full border px-4 text-sm font-bold transition-colors", on ? "border-primary bg-primary text-surface-light" : "border-hairline text-ink hover:border-ink")}>{on ? "✓ " : ""}{v}</button>; })}
                </div>
              </Card>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Eyebrow>Step 02 · Date & Add-ons</Eyebrow>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-6xl">Only dates where <em className="text-primary">everyone</em> is free.</h1>
            <div className="mt-8 grid gap-5 lg:grid-cols-12">
              <div className="grid gap-5 lg:col-span-8">
                <Card variant="elevated">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase text-subtle">75-day live sync · Mr. Bondz + {pref === "venue" ? "venue" : "your estate"} + crew</p>
                    <div className="flex flex-wrap gap-3 text-xs text-subtle">
                      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-status" />{STATUS_COPY.open}</span>
                      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-review" />{STATUS_COPY.limited}</span>
                      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-hairline" />{STATUS_COPY.booked}</span>
                    </div>
                  </div>
                  {today === null ? <div className="mt-5 h-72 animate-pulse rounded-card bg-surface-light" /> : (
                    <div className="mt-5 grid grid-cols-5 gap-1.5 sm:grid-cols-10 lg:grid-cols-15">
                      {Array.from({ length: HORIZON }, (_, d) => {
                        const s = bookDayStatus(d, eventIndex, pref); const dt = dateOf(d)!; const on = d === day;
                        return (
                          <button key={d} type="button" disabled={s === "booked"} aria-pressed={on} aria-label={`${fmt(d)} — ${STATUS_COPY[s]}`} title={STATUS_COPY[s]}
                            onClick={() => { triggerTap(); setDay(d); }}
                            className={cn("flex aspect-square min-h-11 flex-col items-center justify-center rounded-control border text-center transition-colors",
                              on ? "border-primary bg-primary text-surface-light" : s === "booked" ? "cursor-not-allowed border-transparent bg-surface-light text-subtle line-through opacity-50" : "border-hairline text-ink hover:border-ink")}>
                            <span className="text-[0.6rem] font-bold uppercase opacity-70">{MONTHS[dt.getMonth()]}</span>
                            <span className="font-serif text-lg leading-none">{dt.getDate()}</span>
                            {s !== "booked" && <span className={cn("mt-1 size-1.5 rounded-full", on ? "bg-surface-light" : s === "open" ? "bg-status" : "bg-review")} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <p className="mt-4 text-sm text-subtle" aria-live="polite">{day === null ? "Tap an open date to lock all three calendars." : <>Selected <strong className="text-ink">{fmt(day)}</strong> · {STATUS_COPY[dayStatus!]}</>}</p>
                </Card>
                <Card variant="elevated">
                  <p className="text-xs font-bold uppercase text-subtle">Curated partner add-ons</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {ADDONS.map((a) => { const on = addons.includes(a.id); return (
                      <button key={a.id} type="button" aria-pressed={on} onClick={() => { triggerTap(); setAddons(toggleIn(addons, a.id)); }} className={cn("flex items-start justify-between gap-3 rounded-card border p-4 text-left transition-colors", on ? "border-primary bg-ink text-canvas" : "border-hairline bg-surface-light text-ink hover:border-ink")}>
                        <span><span className="block font-serif text-lg leading-tight">{a.name}</span><span className={cn("mt-1 block text-xs", on ? "text-canvas/70" : "text-subtle")}>{a.crew} · synced to your date</span></span>
                        <span className={cn("shrink-0 text-sm font-bold", on ? "text-primary" : "text-ink")}>+{usd(a.price)}</span>
                      </button>
                    ); })}
                  </div>
                </Card>
              </div>
              <aside className="lg:col-span-4"><Ledger totals={totals} guests={guests} addons={addons} sticky /></aside>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Eyebrow>Step 03 · Review, deposit & 360° dispatch</Eyebrow>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-6xl">Sign once. <em className="text-primary">Everyone moves.</em></h1>
            <div className="mt-8 grid gap-5 lg:grid-cols-12">
              <div className="grid gap-5 lg:col-span-7">
                <Card variant="elevated">
                  <p className="text-xs font-bold uppercase text-subtle">Your details</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Field id="bk-name" label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} autoComplete="name" />
                    <Field id="bk-email" label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} autoComplete="email" />
                    <Field id="bk-phone" label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} autoComplete="tel" />
                    <Field id="bk-notes" label="Event location / notes" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase text-subtle">Digital signature</p>
                  <SignaturePad onChange={setSigned} />
                  <label className="mt-4 flex items-start gap-3 text-sm text-ink"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 size-4 accent-primary" />I accept the rescheduling and cancellation terms and authorise the 25% deposit.</label>
                  {error && <p role="alert" className="mt-3 text-sm font-bold text-primary">{error}</p>}
                </Card>
                <Card variant="outlined">
                  <p className="text-xs font-bold uppercase text-subtle">Rescheduling & cancellation terms</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div><p className="font-serif text-xl text-ink">Rescheduling</p><ul className="mt-2 space-y-1.5 text-sm text-subtle"><li>Same-day reschedule is <strong className="text-ink">free ($0 fee)</strong>.</li><li>Rescheduling within 3 days incurs a <strong className="text-ink">5% non-refundable fee</strong>.</li></ul></div>
                    <div><p className="font-serif text-xl text-ink">Cancellation</p><ul className="mt-2 space-y-1.5 text-sm text-subtle"><li>Same-day cancellation receives a <strong className="text-ink">100% full refund</strong>.</li><li>Cancellation after booking day <strong className="text-ink">forfeits the 25% non-refundable deposit</strong>.</li></ul></div>
                  </div>
                </Card>
              </div>
              <aside className="grid content-start gap-5 lg:col-span-5">
                <Card variant="elevated">
                  <p className="text-xs font-bold uppercase text-subtle">Celebration summary</p>
                  <dl className="mt-3 divide-y divide-hairline text-sm">
                    {[["Event", ev.name], ["Date", fmt(day)], ["Guests", `${guests >= GUEST_MAX ? "350+" : guests} · ${tier.name}`], ["Location", pref === "venue" ? "Exclusive partner venue" : "Private property / estate"], ["Vibe", vibes.join(", ") || "Mr. Bondz's call"]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-subtle">{k}</dt><dd className="text-right font-bold text-ink">{v}</dd></div>
                    ))}
                  </dl>
                </Card>
                <Ledger totals={totals} guests={guests} addons={addons} />
                <p className="text-xs text-subtle">The {Math.round(DEPOSIT_RATE * 100)}% deposit locks this date on Mr. Bondz's master calendar. Payment is simulated in this preview.</p>
              </aside>
            </div>
          </>
        )}

        {step === 4 && (
          <Confirmation code={ref} date={fmt(day)} evName={ev.name} guests={guests} totals={totals} addons={addons} cancelled={cancelled}
            onReschedule={() => setModal("reschedule")} onCancel={() => setModal("cancel")} name={form.name} />
        )}
      </div>

      {modal === "reschedule" && (
        <RescheduleModal onClose={() => setModal(null)} total={totals.total} current={day} eventIndex={eventIndex} pref={pref} fmt={fmt} dateOf={dateOf}
          onConfirm={(d) => { setDay(d); setModal(null); }} />
      )}
      {modal === "cancel" && (
        <CancelModal onClose={() => setModal(null)} deposit={totals.deposit} onConfirm={() => { setCancelled(true); setModal(null); }} />
      )}
    </AppShell>
  );
}

type Totals = ReturnType<typeof bookingTotals>;

function Ledger({ totals, guests, addons, sticky }: { totals: Totals; guests: number; addons: AddonId[]; sticky?: boolean }) {
  return (
    <div className={cn("rounded-card bg-ink p-6 text-canvas shadow-[var(--bondz-shadow-raised)]", sticky && "lg:sticky lg:top-0")} aria-live="polite">
      <p className="text-xs font-bold uppercase text-canvas/60">Live price ledger</p>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between gap-3"><dt className="text-canvas/70">Base production</dt><dd>{usd(totals.base)}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-canvas/70">Guests · {guests} × {usd(totals.perGuest)}</dt><dd>{usd(totals.guestCost)}</dd></div>
        {totals.venue > 0 && <div className="flex justify-between gap-3"><dt className="text-canvas/70">Partner venue</dt><dd>{usd(totals.venue)}</dd></div>}
        {ADDONS.filter((a) => addons.includes(a.id)).map((a) => <div key={a.id} className="flex justify-between gap-3"><dt className="text-canvas/70">{a.name}</dt><dd>{usd(a.price)}</dd></div>)}
      </dl>
      <div className="mt-4 flex items-end justify-between gap-3 border-t border-review-hairline pt-4"><span className="text-xs font-bold uppercase text-canvas/60">Subtotal</span><span className="font-serif text-3xl">{usd(totals.total)}</span></div>
      <div className="mt-3 flex items-end justify-between gap-3 rounded-control bg-primary px-4 py-3 text-surface-light"><span className="text-xs font-bold uppercase">25% deposit today</span><span className="font-serif text-3xl">{usd(totals.deposit)}</span></div>
    </div>
  );
}

function Field({ id, label, value, onChange, type = "text", autoComplete }: { id: string; label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string }) {
  return <label htmlFor={id} className="block"><span className="text-xs font-bold uppercase text-subtle">{label}</span>
    <input id={id} type={type} value={value} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} className="mt-1 min-h-11 w-full rounded-control border border-hairline bg-surface-light px-3 text-sm text-ink outline-none transition-colors focus:border-primary" /></label>;
}

function SignaturePad({ onChange }: { onChange: (signed: boolean) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [has, setHas] = useState(false);
  const setup = () => {
    const c = ref.current!; const r = c.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(r.width * dpr)) { c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); }
    const ctx = c.getContext("2d")!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = getComputedStyle(c).color; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.lineJoin = "round";
    return { ctx, r };
  };
  const pos = (e: React.PointerEvent, r: DOMRect) => [e.clientX - r.left, e.clientY - r.top] as const;
  return (
    <div className="relative mt-2">
      <canvas ref={ref} aria-label="Signature pad — draw your signature" role="img" className="h-32 w-full touch-none rounded-control border border-dashed border-hairline bg-surface-light text-ink"
        onPointerDown={(e) => { const { ctx, r } = setup(); drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); const [x, y] = pos(e, r); ctx.beginPath(); ctx.moveTo(x, y); }}
        onPointerMove={(e) => { if (!drawing.current) return; const c = ref.current!; const ctx = c.getContext("2d")!; const [x, y] = pos(e, c.getBoundingClientRect()); ctx.lineTo(x, y); ctx.stroke(); if (!has) { setHas(true); onChange(true); } }}
        onPointerUp={() => { drawing.current = false; }} />
      {!has && <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-xl italic text-subtle">Sign here</span>}
      {has && <button type="button" onClick={() => { const c = ref.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setHas(false); onChange(false); }} className="absolute right-2 top-2 min-h-11 px-2 text-xs font-bold uppercase text-subtle hover:text-primary">Clear</button>}
    </div>
  );
}

const DISPATCH = [
  "Client SMS & Email Receipt Sent",
  "Venue Calendar Blocked",
  "Sommelier & Chef Dispatched",
  "Master Production Brief filed to Mr. Bondz's personal iPad",
];

function Confirmation({ code, date, evName, guests, totals, addons, cancelled, onReschedule, onCancel, name }: { code: string; date: string; evName: string; guests: number; totals: Totals; addons: AddonId[]; cancelled: boolean; onReschedule: () => void; onCancel: () => void; name: string }) {
  const [done, setDone] = useState(0);
  useEffect(() => { if (done >= DISPATCH.length) return; const t = setTimeout(() => { setDone((d) => d + 1); triggerTap(); }, 700); return () => clearTimeout(t); }, [done]);
  const brief = () => {
    const w = window.open("", "_blank"); if (!w) return;
    const lines = ADDONS.filter((a) => addons.includes(a.id)).map((a) => `<li>${a.name} — ${usd(a.price)}</li>`).join("");
    w.document.write(`<html><head><title>Production Brief ${code}</title></head><body style="font-family:Georgia,serif;padding:48px;max-width:640px"><h1>Bondz Events — Production Brief</h1><p><b>Reference:</b> ${code}</p><p><b>Client:</b> ${name}</p><p><b>Event:</b> ${evName} · ${guests} guests</p><p><b>Date:</b> ${date}</p><h3>Add-ons</h3><ul>${lines || "<li>None</li>"}</ul><p><b>Total:</b> ${usd(totals.total)}<br/><b>Deposit paid (25%):</b> ${usd(totals.deposit)}</p><p>Same-day reschedule $0 · within 3 days 5% fee. Same-day cancellation 100% refund · afterwards deposit retained.</p></body></html>`);
    w.document.close(); w.focus(); w.print();
  };
  return (
    <>
      <Eyebrow>{cancelled ? "Booking cancelled" : "You're booked"}</Eyebrow>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-6xl">{cancelled ? <>Cancelled — <em className="text-primary">refund issued.</em></> : <>It's official. <em className="text-primary">Everyone knows.</em></>}</h1>
      <div className="mt-8 grid gap-5 lg:grid-cols-12">
        <div className="rounded-card bg-ink p-6 text-canvas shadow-[var(--bondz-shadow-raised)] lg:col-span-5">
          <p className="text-xs font-bold uppercase text-canvas/60">Official booking reference</p>
          <p className={cn("mt-3 font-serif text-4xl sm:text-5xl", cancelled && "line-through opacity-60")}>{code}</p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-canvas/60">Event</dt><dd>{evName}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-canvas/60">Date</dt><dd>{date}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-canvas/60">Guests</dt><dd>{guests}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-canvas/60">Deposit paid</dt><dd className="text-primary">{usd(totals.deposit)}</dd></div>
          </dl>
        </div>
        <Card variant="elevated" className="lg:col-span-7">
          <p className="text-xs font-bold uppercase text-subtle">360° notification dispatch</p>
          <ol className="mt-4 space-y-3">
            {DISPATCH.map((d, i) => { const ok = i < done; return (
              <li key={d} className="flex items-center gap-3">
                <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors", ok ? "border-status bg-status text-surface-light" : "border-hairline text-subtle")} aria-hidden>{ok ? "✓" : i + 1}</span>
                <span className={cn("text-sm transition-colors", ok ? "font-bold text-ink" : "text-subtle")}>{d}</span>
                {!ok && i === done && <span className="ml-auto size-2 animate-pulse rounded-full bg-primary" aria-hidden />}
              </li>
            ); })}
          </ol>
          <p className="mt-5 border-t border-hairline pt-4 text-sm text-subtle"><strong className="text-ink">The Mr. Bondz Guarantee:</strong> every partner on this date has a confirmed work order — no phone tag, ever.</p>
        </Card>
        <Card variant="outlined" className="lg:col-span-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button variant="dark" disabled={cancelled} onClick={onReschedule}>Reschedule Date</Button>
              <Button variant="outline" disabled={cancelled} onClick={onCancel}>Cancel Booking</Button>
              <Button onClick={brief}>Download Production Brief (PDF)</Button>
            </div>
            <Link to="/" className="text-sm font-bold text-ink underline underline-offset-4 hover:text-primary">Return to Home</Link>
          </div>
        </Card>
      </div>
    </>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/60 p-4 sm:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} className="rise scroll-quiet max-h-full w-full max-w-lg overflow-y-auto rounded-card bg-surface p-6 shadow-[var(--bondz-shadow-popover)]">
        <div className="flex items-start justify-between gap-3"><h2 className="font-serif text-3xl text-ink">{title}</h2><Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>✕</Button></div>
        {children}
      </div>
    </div>
  );
}

function Timing({ value, onChange, later }: { value: "today" | "later"; onChange: (v: "today" | "later") => void; later: string }) {
  return <div role="radiogroup" aria-label="When" className="mt-4 grid grid-cols-2 gap-2">
    {([["today", "Today (booking day)"], ["later", later]] as const).map(([k, l]) => <button key={k} type="button" role="radio" aria-checked={value === k} onClick={() => { triggerTap(); onChange(k); }} className={cn("min-h-11 rounded-control border px-3 text-sm font-bold transition-colors", value === k ? "border-primary bg-ink text-canvas" : "border-hairline text-ink hover:border-ink")}>{l}</button>)}
  </div>;
}

function RescheduleModal({ onClose, total, current, eventIndex, pref, fmt, dateOf, onConfirm }: { onClose: () => void; total: number; current: number | null; eventIndex: number; pref: VenuePrefId; fmt: (d: number | null) => string; dateOf: (d: number) => Date | null; onConfirm: (d: number) => void }) {
  const [when, setWhen] = useState<"today" | "later">("today");
  const [pick, setPick] = useState<number | null>(null);
  const days = useMemo(() => Array.from({ length: HORIZON }, (_, d) => d).filter((d) => d !== current && bookDayStatus(d, eventIndex, pref) !== "booked").slice(0, 20), [current, eventIndex, pref]);
  const fee = when === "today" ? 0 : Math.round(total * RESCHEDULE_FEE_RATE);
  return (
    <Modal title="Reschedule date" onClose={onClose}>
      <p className="mt-2 text-sm text-subtle">Current date: <strong className="text-ink">{fmt(current)}</strong>. Only dates that pass The Rule are shown.</p>
      <Timing value={when} onChange={setWhen} later="Within 3 days of event" />
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {days.map((d) => { const dt = dateOf(d)!; return <button key={d} type="button" aria-pressed={pick === d} aria-label={fmt(d)} onClick={() => { triggerTap(); setPick(d); }} className={cn("flex min-h-12 flex-col items-center justify-center rounded-control border transition-colors", pick === d ? "border-primary bg-primary text-surface-light" : "border-hairline text-ink hover:border-ink")}><span className="text-[0.6rem] font-bold uppercase opacity-70">{MONTHS[dt.getMonth()]}</span><span className="font-serif text-lg leading-none">{dt.getDate()}</span></button>; })}
      </div>
      <div className="mt-5 flex items-end justify-between rounded-control bg-surface-light p-4"><span className="text-sm text-subtle">{when === "today" ? "Same-day reschedule" : "5% non-refundable fee"}</span><span className="font-serif text-3xl text-ink">{usd(fee)}</span></div>
      <Button className="mt-4 w-full" disabled={pick === null} onClick={() => pick !== null && onConfirm(pick)}>{pick === null ? "Pick a new date" : `Move to ${fmt(pick)} · ${usd(fee)} fee`}</Button>
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
        <div className="flex items-end justify-between border-t border-hairline pt-2"><dt className="text-subtle">{when === "today" ? "100% full refund" : "Deposit retained (non-refundable)"}</dt><dd className="font-serif text-3xl text-primary">{usd(refund)}</dd></div>
      </dl>
      <label className="mt-4 flex items-start gap-3 text-sm text-ink"><input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} className="mt-1 size-4 accent-primary" />I formally confirm cancellation and release this date from Mr. Bondz's master calendar.</label>
      <div className="mt-4 flex gap-2"><Button variant="outline" className="flex-1" onClick={onClose}>Keep booking</Button><Button className="flex-1" disabled={!confirm} onClick={onConfirm}>Confirm cancellation</Button></div>
    </Modal>
  );
}
