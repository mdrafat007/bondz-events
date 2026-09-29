import { motion, useAnimationControls, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import mascotWhite from "../../design-system/assets/icons/BONDZ_LOGO_ICON_DARK.png";
import mascotRed from "../../design-system/assets/icons/BONDZ_LOGO_ICON_-_LIGHT.png";
import { useTheme } from "../../lib/theme";
import { playPeekabooSound } from "../../lib/haptics";
import { cn } from "../../lib/utils";
import { Button } from "../../design-system/components/ui/Button";

export interface HeroBookingCTAProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const MotionButton = motion.create(Button);

export function HeroBookingCTA({ onClick, className, disabled }: HeroBookingCTAProps) {
  const { theme } = useTheme();
  const mascotImg = theme === "dark" ? mascotWhite : mascotRed;
  const [isHovered, setIsHovered] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const loopTimerRef = useRef<number | null>(null);
  const launchTimerRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mountedRef = useRef(true);
  const isAnimatingRef = useRef(false);
  const isLaunchingRef = useRef(false);
  const reducedMotion = useReducedMotion();
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
    resting: { y: restY, rotate: 0, transition: { y: { duration: 0.28, ease: [0.25, 1, 0.5, 1] } } },
    hover: {
      y: peekY, rotate: [0, 10, 10, 0],
      transition: {
        y: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
        rotate: { times: [0, 0.45, 0.75, 1], duration: 0.48, ease: "easeInOut" },
      },
    },
    peekLoop: {
      y: [restY, peekY, peekY, restY], rotate: [0, 10, 10, 0],
      transition: { times: [0, 0.25, 0.75, 1], duration: 1.35, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const playPushJumpAnimation = useCallback(async () => {
    if (isAnimatingRef.current || !mountedRef.current || reducedMotion) return;
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
      await arrowControls.start({ x: [0, jumpDist], scale: [1, 1.12], transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] } });
      if (!mountedRef.current) return;
      await arrowControls.start({ x: -travelDist, scale: 0.92, transition: { duration: 0.01 } });
      if (!mountedRef.current) return;
      await new Promise((resolve) => setTimeout(resolve, 20));
      if (!mountedRef.current) return;
      await arrowControls.start({ x: 0, scale: 1, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } });
    } finally {
      isAnimatingRef.current = false;
    }
  }, [arrowControls, textControls, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || disabled) return;
    const interval = window.setInterval(() => {
      if (!isHovered && mountedRef.current) {
        setIsLooping(true);
        void playPushJumpAnimation();
        if (loopTimerRef.current !== null) window.clearTimeout(loopTimerRef.current);
        loopTimerRef.current = window.setTimeout(() => {
          if (mountedRef.current) setIsLooping(false);
        }, 1400);
      }
    }, 3800);
    return () => {
      window.clearInterval(interval);
      if (loopTimerRef.current !== null) window.clearTimeout(loopTimerRef.current);
    };
  }, [isHovered, playPushJumpAnimation, reducedMotion, disabled]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    void playPushJumpAnimation();
    playPeekabooSound();
  };

  const handleTap = () => {
    if (disabled || isLaunchingRef.current) return;
    isLaunchingRef.current = true;
    setIsHovered(true);
    void playPushJumpAnimation();
    launchTimerRef.current = window.setTimeout(() => { if (mountedRef.current) onClick?.(); }, reducedMotion ? 0 : 260);
  };

  const animState = reducedMotion ? "resting" : isHovered ? "hover" : isLooping ? "peekLoop" : "resting";

  return (
    <div className={cn("relative inline-flex max-w-full flex-col items-center justify-end overflow-visible select-none", className)}>
      <div className="pointer-events-none absolute inset-x-0 bottom-full z-0 flex justify-center overflow-visible [clip-path:inset(-400px_-100px_0px_-100px)]" aria-hidden="true">
        <motion.div initial="resting" animate={animState} variants={mascotVariants} style={{ transformOrigin: "50% 85%" }} className="flex origin-bottom items-center justify-center">
          <img src={mascotImg} alt="" className="h-auto w-28 max-w-none select-none object-contain drop-shadow-md sm:w-36 md:w-44" draggable={false} />
        </motion.div>
      </div>
      <MotionButton
        ref={buttonRef}
        variant="primary"
        size="lg"
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={handleMouseEnter}
        onBlur={() => setIsHovered(false)}
        onClick={handleTap}
        className="bondz-hero-cta relative z-10 flex min-h-14 max-w-full items-center justify-between gap-2 overflow-hidden rounded-full px-4 py-3.5 font-sans text-white ring-1 ring-inset ring-white/20 sm:gap-5 sm:px-9 sm:py-4"
        animate={reducedMotion ? { scale: 1 } : isHovered ? { scale: 1.02 } : isLooping ? { scale: 1.015 } : { scale: 1 }}
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      >
        <motion.span animate={textControls} className="whitespace-nowrap font-sans text-[0.62rem] font-black uppercase text-white sm:text-sm md:text-base">
          GET STARTED YOUR BOOKING
        </motion.span>
        <motion.span animate={arrowControls} aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-base font-black text-primary shadow-md sm:size-9 sm:text-lg md:size-10">
          →
        </motion.span>
      </MotionButton>
    </div>
  );
}