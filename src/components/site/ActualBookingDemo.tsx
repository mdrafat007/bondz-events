import { useState } from "react";
import { BookingEngine } from "@/components/booking/BookingEngine";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ActualBookingDemoProps {
  onLaunchBooking?: () => void;
  className?: string;
}

export function ActualBookingDemo({ onLaunchBooking, className }: ActualBookingDemoProps) {
  const { theme } = useTheme();
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <figure
      role="button"
      tabIndex={0}
      aria-label="Watch the six-step booking demonstration. Press to start your booking."
      onClick={onLaunchBooking}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onLaunchBooking?.(); }
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "relative h-full min-h-90 max-h-115 select-none overflow-hidden rounded-2xl border border-hairline shadow-raised cursor-pointer lg:max-h-full focus-visible:outline-2 focus-visible:outline-primary",
        theme === "light" ? "dark bg-canvas text-ink" : "light bg-canvas text-ink",
        className,
      )}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-[140%] w-[140%] origin-top-left scale-[0.714] overflow-hidden pb-20">
        <BookingEngine init={{ event: "wedding", where: "venue", step: 1 }} intro={false} demo paused={paused} onDemoProgress={setProgress} />
      </div>
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-canvas/90 p-4 pt-6 text-ink backdrop-blur-sm sm:p-5">
        <p className="eyebrow text-primary">Live Demo</p>
        <p className="display mt-1 text-sm uppercase leading-tight sm:text-base">Few steps away to celebrate without a single call</p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink/15" aria-hidden="true">
          <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
        </div>
      </figcaption>
    </figure>
  );
}
