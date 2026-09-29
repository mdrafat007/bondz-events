import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell, BrandLockup, Button, ThemeSoundToggle, cn, playCelebrationSound, triggerTap } from "@/index";
import { Confetti } from "@/components/site/Confetti";
import { Step1Event } from "@/components/booking/Step1Event";
import { Step2Where } from "@/components/booking/Step2Where";
import { Step3Services } from "@/components/booking/Step3Services";
import { Step4Date } from "@/components/booking/Step4Date";
import { Step5Lock } from "@/components/booking/Step5Lock";
import { Step6Booked } from "@/components/booking/Step6Booked";
import { EstimatePanel, type BookingCtx } from "@/components/booking/shared";
import { estimate, usd, type Details, type Sel, type Slot } from "@/lib/bondz-data";

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>) => ({ intro: s["intro"] === 1 || s["intro"] === "1" ? 1 : undefined }),
  head: () => ({
    meta: [
      { title: "Book Your Celebration — Bondz Events" },
      { name: "description", content: "Six steps: pick your celebration, add partners, lock a date where Mr. Bondz, the venue and every partner are free, and pay a 25% deposit." },
      { property: "og:title", content: "Book Your Celebration — Bondz Events" },
      { property: "og:description", content: "One sitting. One date everyone is free. Locked with a 25% deposit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingEngine,
});

const STEPS = ["Event", "Where", "Services", "Dates", "Details", "Booked"];

function BookingEngine() {
  const [step, setStep] = useState(1);
  const [anchor, setAnchor] = useState<Date | null>(null);
  const [sel, setSel] = useState<Sel>({ event: null, guests: 60, where: null, venue: null, services: [] });
  const [vibes, setVibes] = useState<string[]>([]);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [details, setDetailsState] = useState<Details>({ name: "", phone: "", email: "", honor: "", notes: "" });
  const [code, setCode] = useState("");
  const [confetti, setConfetti] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const d = new Date(); d.setHours(0, 0, 0, 0); setAnchor(d); }, []);
  useEffect(() => { topRef.current?.closest(".scroll-quiet")?.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  const patch = (u: Partial<Sel>) => setSel((s) => ({ ...s, ...u }));
  const setDetails = (u: Partial<Details>) => setDetailsState((d) => ({ ...d, ...u }));

  const ctx: BookingCtx = {
    sel, patch, vibes, setVibes, day, setDay: (d) => { setDay(d); setSlot(null); }, slot,
    setSlot: (s) => setSlot(s), details, setDetails, anchor, goto: setStep,
  };

  const est = estimate(sel);
  const canContinue =
    step === 1 ? sel.event !== null :
      step === 2 ? sel.where !== null :
        step === 3 ? sel.where === "home" || sel.venue !== null :
          step === 4 ? day !== null && slot !== null : false;

  const restart = () => {
    setSel({ event: null, guests: 60, where: null, venue: null, services: [] });
    setVibes([]); setDay(null); setSlot(null); setCode(""); setStep(1);
    setDetailsState({ name: "", phone: "", email: "", honor: "", notes: "" });
  };

  const header = (
    <header className="border-b border-hairline bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Back to Bondz Events site">
          <BrandLockup className="w-24 sm:w-32" />
          <span className="hidden text-xs font-bold uppercase text-subtle hover:text-primary lg:inline">← Back to site</span>
        </Link>
        <p className="rounded-full bg-ink px-3 py-1.5 text-xs font-bold uppercase text-canvas md:hidden">0{step} / 06 · {STEPS[step - 1]}</p>
        <div className="hidden items-center gap-1 rounded-full border border-hairline p-1 md:flex" aria-label="Booking progress">
          {STEPS.map((label, i) => {
            const n = i + 1; const active = n === step; const done = n < step;
            return (
              <span key={label} aria-current={active ? "step" : undefined}
                className={cn("rounded-full px-2.5 py-1.5 text-xs font-bold uppercase tabular-nums transition-colors",
                  active ? "bg-ink text-canvas" : done ? "text-primary" : "text-subtle")}>
                {done ? "✓" : `0${n}`}<span className={cn("ml-1.5", active ? "inline" : "hidden xl:inline")}>{label}</span>
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <ThemeSoundToggle variant="icons" />
          <Link to="/" aria-label="Exit booking"><Button variant="outline" size="icon">✕</Button></Link>
        </div>
      </div>
    </header>
  );

  const footer = step < 6 ? (
    <div className="border-t border-hairline bg-surface px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase text-subtle">Estimate · 25% deposit</p>
          <p className="truncate font-serif text-xl text-ink sm:text-2xl">{usd(est.total)} <span className="text-primary">· {usd(est.deposit)}</span></p>
        </div>
        <div className="flex gap-2">
          {step > 1 && <Button variant="outline" onClick={() => { triggerTap(); setStep(step - 1); }}>← Back</Button>}
          {step < 5 && <Button disabled={!canContinue} onClick={() => { triggerTap(); setStep(step + 1); }}>Continue →</Button>}
        </div>
      </div>
    </div>
  ) : undefined;

  return (
    <AppShell header={header} footer={footer}>
      <Confetti fire={confetti} />
      <div ref={topRef} key={step} className="rise mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        {step === 1 && <Step1Event ctx={ctx} />}
        {step === 2 && <Step2Where ctx={ctx} />}
        {step === 3 && <Step3Services ctx={ctx} />}
        {step === 4 && (
          <div className="grid gap-5 lg:grid-cols-[1fr_19rem]">
            <div><Step4Date ctx={ctx} /></div>
            <aside className="hidden lg:block"><EstimatePanel sel={sel} sticky /></aside>
          </div>
        )}
        {step === 5 && <Step5Lock ctx={ctx} onBooked={(ref) => { setCode(ref); setStep(6); setConfetti((c) => c + 1); playCelebrationSound(); }} />}
        {step === 6 && <Step6Booked ctx={ctx} code={code} onRestart={restart} />}
      </div>
    </AppShell>
  );
}
