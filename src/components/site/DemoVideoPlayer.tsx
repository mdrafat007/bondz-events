import { useState, useRef } from "react";
import { triggerTap } from "@/lib/haptics";
import heroPoster from "@/assets/pf-wedding.jpg";
import { cn } from "@/lib/utils";

interface DemoVideoPlayerProps {
  onLaunchBooking?: () => void;
  className?: string;
}

export function DemoVideoPlayer({ onLaunchBooking, className }: DemoVideoPlayerProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTap = () => {
    triggerTap();
    setShowOverlay((s) => !s);
  };

  return (
    <figure
      onClick={handleTap}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
      className={cn(
        "relative flex flex-col justify-end overflow-hidden rounded-2xl border hairline bg-surface-dark text-canvas shadow-2xl h-full min-h-[360px] lg:min-h-0 select-none group cursor-pointer",
        className,
      )}
      aria-label="Booking Engine Demo Video"
    >
      {/* Video Element (completely clean and uninterrupted) */}
      <video
        ref={videoRef}
        src="/demo-video.mp4"
        poster={heroPoster}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        playsInline
        muted
        loop
        autoPlay
      />

      {/* 
        Bottom YouTube-style overlay:
        Kicker: "Live Sync Network"
        Title: "A DEMO TO MAKE YOUR LIFE MORE EASIER"
        Video duration bar underneath
        REVEALS ONLY ON HOVER OR TAP!
      */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5 sm:p-6 bg-gradient-to-t from-black/95 via-black/65 to-transparent transition-opacity duration-300",
          showOverlay ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none group-hover:opacity-100",
        )}
      >
        <figcaption className="mb-3">
          {/* Kicker */}
          <p className="eyebrow text-primary text-[0.72rem] font-bold tracking-widest uppercase">
            Live Sync Network
          </p>
          {/* Title */}
          <p className="mt-1 font-display text-base sm:text-lg md:text-xl font-black uppercase text-white tracking-tight leading-snug [font-variation-settings:'wdth'_85]">
            HOW TO GET BOOKED WITHOUT A SINGLE CALL
          </p>
        </figcaption>

        {/* Video progress/scrubber bar right under the title */}
        <div className="w-full h-1.5 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full bg-primary rounded-full animate-pulse transition-all"
            style={{ width: "65%" }}
          />
        </div>
      </div>
    </figure>
  );
}
