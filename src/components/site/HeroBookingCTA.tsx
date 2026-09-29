import { motion, useAnimationControls, type Variants } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import mascotWhite from "../../design-system/assets/icons/BONDZ_LOGO_ICON_DARK.png";
import mascotRed from "../../design-system/assets/icons/BONDZ_LOGO_ICON_-_LIGHT.png";
import { useTheme } from "../../design-system/lib/theme";
import { playPeekabooSound, triggerTap } from "../../lib/haptics";
import { cn } from "../../lib/utils";

export interface HeroBookingCTAProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function HeroBookingCTA({ onClick, className, disabled }: HeroBookingCTAProps) {
  const { theme } = useTheme();
  const mascotImg = theme === "dark" ? mascotWhite : mascotRed;
  const [isHovered, setIsHovered] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 640 : false));
  const loopTimerRef = useRef<number | null>(null);
  const launchTimerRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const isAnimatingRef = useRef(false);
  const isLaunchingRef = useRef(false);

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
      if (launchTimerRef.current !== null) window.clearTimeout(launchTimerRef.current);
    };
  }, []);

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

  const playPushJumpAnimation = useCallback(async () => {
    if (isAnimatingRef.current || !mountedRef.current) return;
    isAnimatingRef.current = true;
    try {
      const btn = buttonRef.current;
      const btnWidth = btn ? btn.offsetWidth : 280;
      const mobile = window.innerWidth < 640;
      const jumpDist = mobile ? Math.min(50, btnWidth * 0.22) : 96;
      const travelDist = btn ? Math.max(140, btnWidth - 52) : 240;

      void textControls.start({
        x: mobile ? [0, -3, 10, 1, 0] : [0, -5, 16, 2, 0],
        transition: { times: [0, 0.16, 0.38, 0.75, 1], duration: 0.34, ease: "easeInOut" },
      });

      await new Promise((resolve) => setTimeout(resolve, 100));
      if (!mountedRef.current) return;

      await arrowControls.start({
        x: [0, jumpDist],
        scale: [1, 1.12],
        transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
      });
      if (!mountedRef.current) return;

      await arrowControls.start({ x: -travelDist, scale: 0.92, transition: { duration: 0.01 } });
      if (!mountedRef.current) return;

      await new Promise((resolve) => setTimeout(resolve, 20));
      if (!mountedRef.current) return;

      await arrowControls.start({
        x: 0,
        scale: 1,
        transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
      });
    } finally {
      isAnimatingRef.current = false;
    }
  }, [arrowControls, textControls]);

  const clearLoop = useCallback(() => {
    if (loopTimerRef.current !== null) {
      window.clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    setIsLooping(false);
  }, []);

  useEffect(() => {
    if (disabled || isHovered) return;
    const interval = window.setInterval(() => {
      if (!mountedRef.current) return;
      setIsLooping(true);
      void playPushJumpAnimation();
      if (loopTimerRef.current !== null) window.clearTimeout(loopTimerRef.current);
      loopTimerRef.current = window.setTimeout(() => {
        if (mountedRef.current) setIsLooping(false);
        loopTimerRef.current = null;
      }, 1700);
    }, 3800);

    return () => {
      window.clearInterval(interval);
      if (loopTimerRef.current !== null) window.clearTimeout(loopTimerRef.current);
    };
  }, [isHovered, playPushJumpAnimation, disabled]);

  const handleEnter = () => {
    clearLoop();
    setIsHovered(true);
    void playPushJumpAnimation();
    playPeekabooSound();
  };

  const handleLeave = () => setIsHovered(false);

  const handleTap = () => {
    if (disabled || isLaunchingRef.current) return;
    isLaunchingRef.current = true;
    clearLoop();
    setIsHovered(true);
    triggerTap();
    void playPushJumpAnimation();
    launchTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) onClick?.();
    }, 260);
  };

  const animState = isHovered ? "hover" : isLooping ? "peekLoop" : "resting";

  return (
    <div
      className={cn("relative inline-flex max-w-full flex-col items-center justify-end overflow-visible select-none cursor-pointer group", className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onTouchStart={handleTap}
      onClick={handleTap}
      role="button"
      tabIndex={0}
      aria-label="Get started your booking with Mr. Bondz"
    >
      {/* Layer 1: Mascot Head anchored behind button */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-visible [clip-path:inset(-400px_-100px_0px_-100px)]"
        aria-hidden="true"
      >
        <motion.div
          initial="resting"
          animate={animState}
          variants={mascotVariants}
          style={{ transformOrigin: "50% 85%" }}
          className="flex origin-bottom items-center justify-center"
        >
          <img
            src={mascotImg}
            alt="Mr. Bondz mascot"
            draggable={false}
            className="w-24 xs:w-28 sm:w-38 md:w-44 h-auto max-w-none select-none object-contain drop-shadow-md"
          />
        </motion.div>
      </div>

      {/* Layer 2: Tactile Luxury Pill Button */}
      <motion.div
        ref={buttonRef}
        animate={isHovered ? { scale: 1.02 } : isLooping ? { scale: 1.015 } : { scale: 1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bondz-hero-cta relative z-10 flex min-h-14 max-w-full items-center justify-between gap-3 sm:gap-6 rounded-full bg-gradient-to-b from-[#f55248] via-[#ee4339] to-[#de3429] px-6 sm:px-9 py-3.5 sm:py-4.5 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.18),0_12px_32px_rgba(241,69,59,0.36)] ring-1 ring-white/20 ring-inset overflow-hidden"
      >
        <motion.span
          animate={textControls}
          className="whitespace-nowrap font-sans text-xs sm:text-sm md:text-base font-black tracking-wider uppercase text-white"
        >
          GET STARTED YOUR BOOKING
        </motion.span>
        <motion.span
          animate={arrowControls}
          aria-hidden="true"
          className="grid size-8 sm:size-9 md:size-10 shrink-0 place-items-center rounded-full bg-white shadow-md text-primary font-black"
        >
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4 sm:size-5">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="#f1453b" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </motion.div>
    </div>
  );
}

