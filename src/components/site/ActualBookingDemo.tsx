import { useEffect, useRef, useState } from "react";
import { BookingEngine } from "@/components/booking/BookingEngine";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import clip from "@/assets/demo-celebration.mp4.asset.json";

interface ActualBookingDemoProps {
  onLaunchBooking?: () => void;
  className?: string;
}

const CLIP_MS = 7000;

export function ActualBookingDemo({ onLaunchBooking, className }: ActualBookingDemoProps) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showClip, setShowClip] = useState(false);
  const lastProgress = useRef(0);

  // After each complete run of the demo, rest on a looping celebration clip.
  useEffect(() => {
    if (!showClip) return;
    const t = window.setTimeout(() => setShowClip(false), CLIP_MS);
    return () => window.clearTimeout(t);
  }, [showClip]);

  const handleProgress = (value: number) => {
    if (lastProgress.current > 80 && value < 20) setShowClip(true);
    lastProgress.current = value;
    setProgress(value);
  };

  return (
    <figure
      role="button"
      tabIndex={0}
      aria-label="Watch the six-step booking demonstration. Press to start your booking."
      onClick={onLaunchBooking}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onLaunchBooking?.(); }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "relative aspect-[4/5] max-h-[30rem] w-full cursor-pointer select-none overflow-hidden rounded-2xl border border-hairline shadow-raised focus-visible:outline-2 focus-visible:outline-primary sm:aspect-[4/3.4] sm:max-h-[26rem] lg:aspect-auto lg:h-full lg:max-h-[30rem]",
        theme === "light" ? "dark bg-canvas text-ink" : "light bg-canvas text-ink",
        className,
      )}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-[143%] w-[143%] origin-top-left scale-[0.7] select-none overflow-hidden pb-20">
        <BookingEngine
          init={{ event: "wedding", where: "venue", step: 1 }}
          intro={false}
          demo
          paused={hovered || showClip}
          onDemoProgress={handleProgress}
        />
      </div>

      {showClip && (
        <video
          src={clip.url}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 size-full select-none object-cover"
        />
      )}

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 select-none bg-canvas/90 p-3.5 pt-5 text-ink backdrop-blur-sm sm:p-4">
        <p className="eyebrow text-primary">Live Demo</p>
        <p className="display mt-1 text-[0.82rem] uppercase leading-tight sm:text-sm">
          Few steps away to celebrate without a single call
        </p>
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink/15" aria-hidden="true">
          <div className="h-full rounded-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>
      </figcaption>
    </figure>
  );
}
