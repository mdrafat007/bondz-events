import { motion, useAnimationControls, type Variants } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import mascotWhite from "@/assets/mascot-white.png";
import mascotRed from "@/assets/mascot-red.png";
import peekabooUrl from "@/assets/audio/peekaboo-sound.mp3";
import { useTheme } from "@/lib/theme";
import { triggerTap, isSoundEnabled } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface HeroBookingCTAProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function HeroBookingCTA({ onClick, className, disabled }: HeroBookingCTAProps) {
  const { theme } = useTheme();
  const mascotImg = theme === "dark" ? mascotWhite : mascotRed;
  const [isHovered, setIsHovered] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  // Measured after hydration so server and client render the same first frame.
  const [isMobile, setIsMobile] = useState(false);

  const loopTimerRef = useRef<number | null>(null);

  const buttonRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const isAnimatingRef = useRef(false);

  const textControls = useAnimationControls();
  const arrowControls = useAnimationControls();

  useEffect(() => {
    mountedRef.current = true;
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      mountedRef.current = false;
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Screen-calibrated peek and resting positions matching user reference image:
  // Rest y: completely concealed behind button (48 on mobile, 68 on desktop)
  // Peek y: -15 (1px down from -16, preserves full mascot size while resting bottom glasses frame precisely on button rim)
  const restY = isMobile ? 48 : 68;
  const peekY = -15;

  const mascotVariants: Variants = {
    resting: {
      y: restY,
      rotate: 0,
      transition: {
        y: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
        rotate: { duration: 0.18, ease: "easeOut" },
      },
    },
    hover: {
      y: peekY,
      rotate: [0, 10, 10, 0],
      transition: {
        y: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
        rotate: {
          times: [0, 0.45, 0.75, 1],
          duration: 0.48,
          ease: "easeInOut",
        },
      },
    },
    peekLoop: {
      y: [restY, peekY, peekY, restY],
      rotate: [0, 10, 10, 0],
      transition: {
        times: [0, 0.25, 0.75, 1],
        duration: 1.35,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Choreographed Side Push & Arrow Loop (Mobile-calibrated distances):
  const playPushJumpAnimation = useCallback(async () => {
    if (isAnimatingRef.current || !mountedRef.current) return;
    isAnimatingRef.current = true;

    try {
      const btn = buttonRef.current;
      const btnWidth = btn ? btn.offsetWidth : 280;
      const mobile = window.innerWidth < 640;
      const jumpDist = mobile ? Math.min(50, btnWidth * 0.22) : 96;
      const travelDist = btn ? Math.max(140, btnWidth - 52) : 240;

      // 1. Text winds up slightly left, then delivers a sharp "side push" to the right
      textControls.start({
        x: mobile ? [0, -3, 10, 1, 0] : [0, -5, 16, 2, 0],
        transition: {
          times: [0, 0.16, 0.38, 0.75, 1],
          duration: 0.34,
          ease: "easeInOut",
        },
      });

      // 2. Wait until the text strikes at peak rightward push
      await new Promise((r) => setTimeout(r, 100));
      if (!mountedRef.current) return;

      // 3. Arrow receives the collision force and JUMPS FORWARD out the right edge (within pill bounds)
      await arrowControls.start({
        x: [0, jumpDist],
        scale: [1, 1.12],
        transition: {
          duration: 0.16,
          ease: [0.16, 1, 0.3, 1],
        },
      });
      if (!mountedRef.current) return;

      // 4. Instantly teleport behind the text to the far left (back of the text)
      await arrowControls.start({
        x: -travelDist,
        scale: 0.92,
        transition: { duration: 0.01 },
      });
      if (!mountedRef.current) return;

      // 5. Crisp pause at the rear
      await new Promise((r) => setTimeout(r, 20));
      if (!mountedRef.current) return;

      // 6. Come back from the back of the text: glide smoothly across behind the text back to resting slot
      await arrowControls.start({
        x: 0,
        scale: 1,
        transition: {
          duration: 0.36,
          ease: [0.22, 1, 0.36, 1],
        },
      });
    } finally {
      isAnimatingRef.current = false;
    }
  }, [arrowControls, textControls]);

  // Automatic idle loop: Every 3.8 seconds, mascot peeks up and text/arrow executes push-jump loop
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!isHovered && mountedRef.current) {
        setIsLooping(true);
        playPushJumpAnimation();
        if (loopTimerRef.current) window.clearTimeout(loopTimerRef.current);
        loopTimerRef.current = window.setTimeout(() => {
          if (mountedRef.current) setIsLooping(false);
        }, 1400);
      }
    }, 3800);

    return () => {
      window.clearInterval(interval);
      if (loopTimerRef.current) window.clearTimeout(loopTimerRef.current);
    };
  }, [isHovered, playPushJumpAnimation]);

  const playPeekaboo = () => {
    if (!isSoundEnabled()) return;
    try {
      const audio = new Audio(peekabooUrl);
      audio.volume = 0.85;
      audio.play().catch(() => {});
    } catch {
      /* audio optional */
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playPushJumpAnimation();
    playPeekaboo();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleTap = () => {
    setIsHovered(true);
    triggerTap();
    playPeekaboo();
    playPushJumpAnimation();
    // Allow snappy animation to play visibly before navigating
    window.setTimeout(() => {
      if (mountedRef.current) onClick?.();
    }, 260);
  };

  const animState = isHovered ? "hover" : isLooping ? "peekLoop" : "resting";

  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-center justify-end overflow-visible select-none cursor-pointer group",
        disabled && "pointer-events-none opacity-70",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onTouchStart={handleTap}
      onClick={handleTap}
      role="button"
      aria-disabled={disabled || undefined}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleTap();
        }
      }}
      aria-label="Get started your booking with Mr. Bondz"
    >
      {/* 
        Layer 1 (Behind, z-index: 0): Mascot Head Illustration
        Using bottom clipping [clip-path:inset(-400px_-100px_0px_-100px)] anchored at bottom: 0 
        so NO chin or neck pixels can EVER peek below the bottom rim of the button!
      */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-visible [clip-path:inset(-400px_-100px_0px_-100px)]"
        aria-hidden="true"
      >
        <motion.div
          initial="resting"
          animate={animState}
          variants={mascotVariants}
          style={{ transformOrigin: "50% 85%" }}
          className="flex items-center justify-center origin-bottom"
        >
          <img
            src={mascotImg}
            alt="Mr. Bondz mascot"
            className="w-24 xs:w-28 sm:w-38 md:w-44 h-auto max-w-none select-none object-contain drop-shadow-md"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* 
        Layer 2 (Front, z-index: 10): Pill-shaped CTA Button
        Tactile realistic luxury finish: inner highlight, bevel depth, subtle gradient, and ring
      */}
      <motion.div
        ref={buttonRef}
        className="relative z-10 flex max-w-full items-center justify-between gap-2 xs:gap-3 sm:gap-5 rounded-full bg-gradient-to-b from-[#f55248] via-[#ee4339] to-[#de3429] px-4 xs:px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.18),0_12px_32px_rgba(241,69,59,0.36)] ring-1 ring-white/20 ring-inset overflow-hidden"
        animate={isHovered ? { scale: 1.02 } : isLooping ? { scale: 1.015 } : { scale: 1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated Text: Delivers the side push into the arrow badge */}
        <motion.span
          animate={textControls}
          initial={{ x: 0 }}
          className="relative z-20 font-display text-[0.74rem] xs:text-[0.84rem] sm:text-[1.04rem] md:text-[1.20rem] font-black uppercase tracking-wide text-white whitespace-nowrap [font-variation-settings:'wdth'_85] drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.45)] pointer-events-none"
        >
          GET STARTED YOUR BOOKING
        </motion.span>

        {/* Right Icon Accent: Tactile circular white badge pill with bold prominent arrow */}
        <motion.span
          animate={arrowControls}
          initial={{ x: 0, scale: 1 }}
          className="relative z-10 flex size-9 xs:size-10 sm:size-11 md:size-12.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-white to-[#fbf8f5] text-[#f1453b] shadow-[0_3px_10px_rgba(0,0,0,0.22),inset_0_1.5px_1px_rgba(255,255,255,0.95)] ring-1 ring-black/10 pointer-events-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 xs:size-5.5 sm:size-6.5 md:size-7 text-[#f1453b] drop-shadow-xs transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <line x1="3.5" y1="12" x2="20.5" y2="12" />
            <polyline points="13.5 5 20.5 12 13.5 19" />
          </svg>
        </motion.span>
      </motion.div>
    </div>
  );
}
