import { useState, useEffect } from "react";

export type TransitionPhase = "idle" | "closing" | "opening";
type Listener = (phase: TransitionPhase) => void;
const listeners = new Set<Listener>();
let currentPhase: TransitionPhase = "idle";

export function triggerBookingTransition(onFinish?: () => void) {
  if (currentPhase !== "idle") return;
  currentPhase = "closing";
  listeners.forEach((l) => l("closing"));

  // Curtains sweep into center seam (450ms)
  window.setTimeout(() => {
    onFinish?.();
    // Curtains split apart from center outwards (450ms)
    currentPhase = "opening";
    listeners.forEach((l) => l("opening"));

    window.setTimeout(() => {
      currentPhase = "idle";
      listeners.forEach((l) => l("idle"));
    }, 460);
  }, 450);
}

export function useBookingTransition(): TransitionPhase {
  const [phase, setPhase] = useState<TransitionPhase>(currentPhase);
  useEffect(() => {
    listeners.add(setPhase);
    return () => {
      listeners.delete(setPhase);
    };
  }, []);
  return phase;
}
