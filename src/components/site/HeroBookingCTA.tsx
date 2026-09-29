import { motion, useAnimationControls, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import mascotWhite from "../../design-system/assets/icons/BONDZ_LOGO_ICON_DARK.png";
import mascotRed from "../../design-system/assets/icons/BONDZ_LOGO_ICON_-_LIGHT.png";
import { useTheme } from "../../design-system/lib/theme";
import { playPeekabooSound } from "../../lib/haptics";
import { cn } from "../../lib/utils";
import { Button } from "../../design-system/components/ui/Button";

export interface HeroBookingCTAProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const MotionButton = motion.create(Button);

/**
 * Head-anchored crop geometry, measured from the 2000x2000 mascot artwork.
 * The head spans x 424..1580 and y 155..~1320; the bottom of the spectacle
 * frames sits at y ~1155. The clip window is sized so that translating the
 * mascot to y = -15 lands the spectacle frames exactly on the button's top rim.
 */
const SRC = 2000;
const HEAD_LEFT = 424;
const HEAD_TOP = 155;
const HEAD_WIDTH = 1156;
const SPECTACLE_BOTTOM = 1155;
const PEEK_Y = -15;

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

  // Head window sizing, derived from the measured artwork landmarks.
  const headWidth = isMobile ? 128 : 176;
  const scale = headWidth / HEAD_WIDTH;
  const windowHeight = (SPECTACLE_BOTTOM - HEAD_TOP) * scale - PEEK_Y * -1;
  const restY = isMobile ? 48 : 68;

  const mascotVariants: Variants = {
    resting: {
      y: restY,
      scale: 0.9,
      opacity: 0,
      rotate: 0,
      transition: { y: { type: "spring", stiffness: 360, damping: 22 }, opacity: { duration: 0.18 }, scale: { duration: 0.22 } },
    },
    hover: {
      y: PEEK_Y,
      scale: 1,
      opacity: 1,
      rotate: [0, 10, 10, 0],
      transition: {
        y: { type: "spring", stiffness: 360, damping: 22 },
        scale: { type: "spring", stiffness: 360, damping: 22 },
        opacity: { duration: 0.15 },
        rotate: { times: [0, 0.45, 0.75, 1], duration: 0.48, ease: "easeInOut" },
      },
    },
    peekLoop: {
      y: [restY, PEEK_Y, PEEK_Y, restY],
      scale: [0.9, 1, 1, 0.9],
      opacity: [0, 1, 1, 0],
      rotate: [0, 10, 10, 0],
      transition: { times: [0, 0.22, 0.72, 1], duration: 1.6, ease: [0.16, 1, 0.3, 1] },
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

  const clearLoop = useCallback(() => {
    if (loopTimerRef.current !== null) {
      window.clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    setIsLooping(false);
  }, []);

  // Automatic idle peek every 3.8s. Skipped entirely while hovered so the
  // loop variant and the hover variant can never drive the mascot at once.
  useEffect(() => {
    if (reducedMotion || disabled || isHovered) return;
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
  }, [isHovered, playPushJumpAnimation, reducedMotion, disabled]);

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
    void playPushJumpAnimation();
    launchTimerRef.current = window.setTimeout(() => {
      if (mountedRef.current) onClick?.();
    }, reducedMotion ? 0 : 260);
  };

  const animState = reducedMotion ? "resting" : isHovered ? "hover" : isLooping ? "peekLoop" : "resting";

  return (
    <div className={cn("relative inline-flex max-w-full flex-col items-center justify-end overflow-visible select-none", className)}>
      {/* Peekaboo layer: bottom edge sits on the button's top rim, clipped there. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-full z-0 flex justify-center overflow-visible [clip-path:inset(-400px_-100px_0px_-100px)]"
        style={{ height: windowHeight }}
        aria-hidden="true"
      >
        <motion.div
          initial="resting"
          animate={animState}
          variants={mascotVariants}
          style={{ transformOrigin: "50% 100%", width: headWidth, height: windowHeight, position: "relative" }}
          className="overflow-visible"
        >
          <img
            src={mascotImg}
            alt=""
            draggable={false}
            className="pointer-events-none absolute max-w-none select-none object-contain drop-shadow-md"
            style={{ width: SRC * scale, left: -HEAD_LEFT * scale, top: -HEAD_TOP * scale }}
          />
        </motion.div>
      </div>
      <MotionButton
        ref={buttonRef}
        variant="primary"
        size="lg"
        disabled={disabled}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        onClick={handleTap}
        className="bondz-hero-cta relative z-10 flex min-h-14 max-w-full items-center justify-between gap-2 overflow-hidden rounded-full px-4 py-3.5 font-sans text-white ring-1 ring-inset ring-white/20 sm:gap-5 sm:px-9 sm:py-4"
        animate={reducedMotion ? { scale: 1 } : isHovered ? { scale: 1.02 } : isLooping ? { scale: 1.015 } : { scale: 1 }}
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      >
        <motion.span animate={textControls} className="whitespace-nowrap font-sans text-[0.62rem] font-black uppercase tracking-wider text-white sm:text-sm sm:tracking-widest md:text-base">
          GET STARTED YOUR BOOKING
        </motion.span>
        <motion.span animate={arrowControls} aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-white shadow-md sm:size-9 md:size-10">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4 sm:size-5">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="#f1453b" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </MotionButton>
    </div>
  );
}
