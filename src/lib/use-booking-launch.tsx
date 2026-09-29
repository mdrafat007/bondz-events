import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function useBookingLaunch() {
  const navigate = useNavigate();
  const [launching, setLaunching] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function launchBooking() {
    if (launching) return;
    setLaunching(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => { void navigate({ to: "/book", search: { intro: 1 } }); }, reduced ? 0 : 470);
  }

  const curtain = launching ? <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true"><div className="bondz-curtain-left absolute inset-y-0 left-0 w-1/2 bg-night" /><div className="bondz-curtain-right absolute inset-y-0 right-0 w-1/2 bg-night" /></div> : null;
  return { launchBooking, launching, curtain };
}