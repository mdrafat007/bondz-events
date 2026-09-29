import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn, triggerTap } from "@/index";
import {
  GUEST_MAX, GUEST_MIN, estimate, usd,
  type Details, type Sel, type Slot,
} from "@/lib/bondz-data";

export interface BookingCtx {
  sel: Sel;
  patch: (u: Partial<Sel>) => void;
  vibes: string[];
  setVibes: (v: string[]) => void;
  day: number | null;
  setDay: (d: number | null) => void;
  slot: Slot | null;
  setSlot: (s: Slot) => void;
  details: Details;
  setDetails: (u: Partial<Details>) => void;
  anchor: Date | null;
  goto: (s: number) => void;
}

/** Renders overlays at document level so animated ancestors can't trap `fixed`. */
export function Portal({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  return ready ? createPortal(children, document.body) : null;
}

export function StepHead({ no, kicker, title, accent, children }: { no: string; kicker: string; title: string; accent?: string; children?: ReactNode }) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Step {no} · {kicker}</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
        {title} {accent && <em className="text-primary">{accent}</em>}
      </h1>
      {children && <p className="mt-4 text-sm text-subtle sm:text-base">{children}</p>}
    </header>
  );
}

export function GuestSlider({ value, onChange, compact }: { value: number; onChange: (n: number) => void; compact?: boolean }) {
  return (
    <div className={cn("rounded-card border border-hairline bg-surface-light p-4", compact ? "w-full sm:w-72" : "w-full")}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor="guest-count" className="text-xs font-bold uppercase text-subtle">Guest count</label>
        <span className="font-serif text-3xl tabular-nums text-ink">{value >= GUEST_MAX ? `${GUEST_MAX}+` : value}</span>
      </div>
      <input id="guest-count" type="range" min={GUEST_MIN} max={GUEST_MAX} step={5} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="mt-3 w-full accent-primary" />
      <div className="mt-1 flex justify-between text-xs text-subtle"><span>{GUEST_MIN}</span><span>{GUEST_MAX}</span></div>
    </div>
  );
}

export function EstimatePanel({ sel, sticky }: { sel: Sel; sticky?: boolean }) {
  const est = estimate(sel);
  return (
    <div className={cn("rounded-card bg-ink p-6 text-canvas shadow-[var(--bondz-shadow-raised)]", sticky && "lg:sticky lg:top-0")} aria-live="polite">
      <p className="text-xs font-bold uppercase text-canvas/60">Live estimate</p>
      <dl className="mt-4 space-y-2.5 text-sm">
        {est.lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-3">
            <dt className="text-canvas/70">{l.label}{l.note && <span className="block text-xs text-canvas/40">{l.note}</span>}</dt>
            <dd className="tabular-nums">{usd(l.amount)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-end justify-between gap-3 border-t border-review-hairline pt-4">
        <span className="text-xs font-bold uppercase text-canvas/60">Total</span>
        <span className="font-serif text-3xl tabular-nums">{usd(est.total)}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3 rounded-control bg-primary px-4 py-3 text-surface-light">
        <span className="text-xs font-bold uppercase">25% deposit today</span>
        <span className="font-serif text-3xl tabular-nums">{usd(est.deposit)}</span>
      </div>
      <p className="mt-3 text-xs text-canvas/50">Balance {usd(est.balance)} due 7 days before the event.</p>
    </div>
  );
}

export function Chip({ on, children, onClick, ariaPressed = true }: { on: boolean; children: ReactNode; onClick: () => void; ariaPressed?: boolean }) {
  return (
    <button type="button" aria-pressed={ariaPressed ? on : undefined} onClick={() => { triggerTap(); onClick(); }}
      className={cn("min-h-11 rounded-full border px-4 text-sm font-bold transition-colors",
        on ? "border-primary bg-primary text-surface-light" : "border-hairline text-ink hover:border-ink")}>
      {on ? "✓ " : ""}{children}
    </button>
  );
}

export function Field({ id, label, value, onChange, type = "text", autoComplete, placeholder, textarea }:
{ id: string; label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string; placeholder?: string; textarea?: boolean }) {
  const cls = "mt-1 w-full rounded-control border border-hairline bg-surface-light px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-primary";
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-bold uppercase text-subtle">{label}</span>
      {textarea
        ? <textarea id={id} rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cls} />
        : <input id={id} type={type} value={value} autoComplete={autoComplete} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cn(cls, "min-h-11")} />}
    </label>
  );
}

export function SignaturePad({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [has, setHas] = useState(false);

  const setup = () => {
    const c = ref.current!;
    const r = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== Math.round(r.width * dpr)) { c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); }
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.strokeStyle = getComputedStyle(c).color;
    ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.lineJoin = "round";
    return { ctx, r };
  };

  return (
    <div className="relative mt-2">
      <canvas ref={ref} role="img" aria-label="Signature pad - sign with mouse or finger"
        className="h-24 w-full touch-none rounded-control border border-dashed border-hairline bg-surface-light text-ink"
        onPointerDown={(e) => { const { ctx, r } = setup(); drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); ctx.beginPath(); ctx.moveTo(e.clientX - r.left, e.clientY - r.top); }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const c = ref.current!; const ctx = c.getContext("2d")!; const r = c.getBoundingClientRect();
          ctx.lineTo(e.clientX - r.left, e.clientY - r.top); ctx.stroke();
          if (!has) setHas(true);
        }}
        onPointerUp={() => { drawing.current = false; if (has) onChange(ref.current!.toDataURL()); }} />
      {!has && <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-lg italic text-subtle">Sign here with mouse or finger</span>}
      {has && (
        <button type="button" onClick={() => { const c = ref.current!; c.getContext("2d")!.clearRect(0, 0, c.width, c.height); setHas(false); onChange(null); }}
          className="absolute right-2 top-2 min-h-11 px-2 text-xs font-bold uppercase text-subtle hover:text-primary">Clear</button>
      )}
    </div>
  );
}
