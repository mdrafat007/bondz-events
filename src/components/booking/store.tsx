import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  CATEGORIES,
  SLOTS,
  VENUES,
  availableDays,
  eligiblePartners,
  slotOpen,
  type CategoryId,
  type EventTypeId,
  type Sel,
  type Slot,
} from "@/lib/bondz-data";
import { signalBot } from "@/lib/bot-bus";

export type Step = 1 | 2 | 3 | 4 | 5 | 6;
export type LogLine = { id: number; text: string; before: number; after: number; at: string };
export type Details = { name: string; phone: string; email: string; honor: string; notes: string };

function stamp() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

export function useBookingState(init: { event?: EventTypeId | undefined; where?: "home" | "venue" | undefined; step?: Step | undefined; reveal?: boolean | undefined }, demo = false) {
  const [anchor] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [step, setStep] = useState<Step>(init.step ?? (init.event ? (init.where ? 3 : 2) : 1));
  const [sel, setSel] = useState<Sel>({
    event: init.event ?? (init.step ? "wedding" : null),
    guests: 60,
    where: init.where ?? (init.step && init.step >= 3 ? "venue" : null),
    venue: init.step && init.step >= 3 ? "smokestack" : null,
    services: init.step && init.step >= 3 ? ["catering", "dj"] : [],
  });
  const [vibes, setVibes] = useState<string[]>(["Black Tie Glamour"]);
  const [day, setDay] = useState<number | null>(init.step && init.step >= 4 ? availableDays({ event: init.event ?? "wedding", guests: 60, where: init.where ?? "venue", venue: "smokestack", services: ["catering", "dj"] })[0] ?? null : null);
  const [slot, setSlot] = useState<Slot | null>(init.step && init.step >= 5 ? "Evening" : null);
  const [log, setLog] = useState<LogLine[]>([]);
  const [reveal, setReveal] = useState(init.reveal ?? false);
  const [details, setDetails] = useState<Details>({
    name: demo ? "Amira & Jonah" : "",
    phone: demo ? "+1 555 234 5678" : "",
    email: demo ? "amira@example.com" : "",
    honor: "",
    notes: "",
  });
  const [signature, setSignature] = useState<string | null>(null);
  const [ref, setRef] = useState<string>(demo ? "BZ-7492-OCT26" : "");
  const [moves, setMoves] = useState(0);
  const [cancelled, setCancelled] = useState<{ refund: number; tier: string; note: string } | null>(null);

  const days = useMemo(() => availableDays(sel), [sel]);
  // A previous choice cannot remain locked when the intersection changes.
  const validDay = day !== null && days.includes(day) ? day : null;
  const validSlot = validDay !== null && slot !== null && slotOpen(validDay, SLOTS.indexOf(slot)) ? slot : null;

  const push = useCallback((text: string, before: number, after: number) => {
    setLog((l) => [...l, { id: Date.now() + Math.random(), text, before, after, at: stamp() }]);
    signalBot({ mood: after > 0 ? "happy" : "think" });
  }, []);

  const pruneFor = (next: Sel): Sel => {
    const venue = VENUES.find((v) => v.id === next.venue) ?? null;
    return { ...next, services: next.services.filter((c) => eligiblePartners(c, next.guests, next.event, venue).length > 0) };
  };

  const toggleService = (c: CategoryId) => {
    const on = sel.services.includes(c);
    const next = { ...sel, services: on ? sel.services.filter((x) => x !== c) : [...sel.services, c] };
    const before = availableDays(sel).length;
    const after = availableDays(next).length;
    const venue = VENUES.find((v) => v.id === sel.venue) ?? null;
    const n = eligiblePartners(c, sel.guests, sel.event, venue).length;
    const label = categoryLabel(c);
    signalBot({ mood: "think" });
    if (on) push(`${label} removed - ${after - before} date${after - before === 1 ? "" : "s"} came back`, before, after);
    else push(`${label} added - polled ${n} partner calendar${n === 1 ? "" : "s"}. ${before - after} date${before - after === 1 ? "" : "s"} stopped existing`, before, after);
    setSel(next);
    setDay(null);
    setSlot(null);
  };

  const setGuests = (g: number, commit = false) => {
    if (g === sel.guests) return;
    const next = pruneFor({ ...sel, guests: g });
    const nextDays = availableDays(next);
    if (commit) {
      const before = availableDays(sel).length;
      const after = nextDays.length;
      if (before !== after || next.services.length !== sel.services.length)
        push(`Guests set to ${g} - partner eligibility re-checked`, before, after);
    }
    setSel(next);
    // Keep an already-picked date whenever it survives the new intersection.
    if (day === null || !nextDays.includes(day)) {
      setDay(null);
      setSlot(null);
    }
  };

  const chooseVenue = (id: string | null) => {
    const v = VENUES.find((x) => x.id === id);
    const next = pruneFor({ ...sel, venue: id });
    const before = availableDays(sel).length;
    const after = availableDays(next).length;
    if (v) push(`${v.name} selected - polled 1 venue calendar. ${Math.max(before - after, 0)} dates stopped existing`, before, after);
    setSel(next);
    setDay(null);
    setSlot(null);
  };

  /** Move a confirmed booking to another date that still works for the same partners. */
  const reschedule = (nextDay: number, nextSlot: Slot) => {
    const before = day ?? 0;
    setDay(nextDay);
    setSlot(nextSlot);
    setMoves((m) => m + 1);
    push(`Booking moved to day ${nextDay} (${nextSlot}) - same partners re-confirmed`, before, nextDay);
  };

  const cancel = (outcome: { refund: number; tier: string; note: string }) => {
    setCancelled(outcome);
    signalBot({ mood: "think" });
  };

  const reset = () => {
    setStep(1);
    setSel({ event: null, guests: 60, where: null, venue: null, services: [] });
    setVibes([]);
    setDay(null);
    setSlot(null);
    setLog([]);
    setDetails({ name: "", phone: "", email: "", honor: "", notes: "" });
    setSignature(null);
    setRef("");
    setMoves(0);
    setCancelled(null);
  };

  return {
    anchor, step, setStep, sel, setSel, vibes, setVibes, days, day: validDay, setDay, slot: validSlot, setSlot, log, push, reveal, setReveal, demo,
    details, setDetails, signature, setSignature, ref, setRef, toggleService, setGuests, chooseVenue, reset,
    moves, cancelled, reschedule, cancel,
  };
}

export type BookingCtx = ReturnType<typeof useBookingState>;
const Ctx = createContext<BookingCtx | null>(null);
export const BookingProvider = Ctx.Provider;
export function useBooking() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBooking outside provider");
  return c;
}
