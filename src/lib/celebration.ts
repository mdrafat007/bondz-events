// Confirmation soundscape: a synthetic tactile flourish lands first, then the
// recorded human cheer follows. Both respect the bondz-sound preference.
import cheersUrl from "@/assets/audio/BONDZ_EVENTS-CHEERS_AUDIO.mp3";
import { isSoundEnabled, playConfirmFlourish, triggerHaptic } from "./haptics";

const FLOURISH_LEAD_MS = 480;
const CHEER_PLAY_MS = 6300;

let current: HTMLAudioElement | null = null;
let fade: number | null = null;

export function stopCelebration() {
  if (fade) window.clearInterval(fade);
  fade = null;
  if (current) {
    current.pause();
    current = null;
  }
}

function fadeOut(audio: HTMLAudioElement) {
  fade = window.setInterval(() => {
    if (audio.volume > 0.08) audio.volume = Math.max(0, audio.volume - 0.1);
    else {
      audio.pause();
      if (fade) window.clearInterval(fade);
      fade = null;
    }
  }, 80);
}

/** Plays the tactile confirm, then the human cheer. Returns a cleanup function. */
export function playCelebrationSequence(): () => void {
  if (typeof window === "undefined") return () => {};
  triggerHaptic([35, 60, 45, 60, 80]);
  if (!isSoundEnabled()) return () => {};
  playConfirmFlourish();
  const timers: number[] = [];
  timers.push(
    window.setTimeout(() => {
      stopCelebration();
      // Physical vibration synced with the cheer. Android devices rumble;
      // iOS and desktops ignore the Vibration API safely (silent fallback).
      triggerHaptic([60, 80, 45, 80, 45, 80, 120]);
      try {
        const audio = new Audio(cheersUrl);
        audio.volume = 0.9;
        current = audio;
        void audio.play().catch(() => {});
        timers.push(window.setTimeout(() => fadeOut(audio), CHEER_PLAY_MS));
      } catch {
        /* audio is a nice-to-have */
      }
    }, FLOURISH_LEAD_MS),
  );
  return () => {
    timers.forEach((t) => window.clearTimeout(t));
    stopCelebration();
  };
}
