// AudioContext and Vibration Haptics Engine for Bondz Events
import { useSyncExternalStore } from "react";

let audioCtx: AudioContext | null = null;
const SOUND_STORAGE_KEY = "bondz-sound";
const soundListeners = new Set<() => void>();

function emitSoundChange() {
  for (const listener of soundListeners) {
    listener();
  }
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(SOUND_STORAGE_KEY);
  if (stored === null) return true; // Default ON
  return stored === "true";
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  emitSoundChange();
  if (enabled) {
    playSwitchSound(true);
  }
}

export function toggleSound(): boolean {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
}

function subscribeSound(callback: () => void) {
  soundListeners.add(callback);
  return () => {
    soundListeners.delete(callback);
  };
}

export function useSoundState(): { soundEnabled: boolean; toggleSound: () => boolean } {
  const soundEnabled = useSyncExternalStore(subscribeSound, isSoundEnabled, () => true);
  return { soundEnabled, toggleSound };
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a crisp, realistic tactile mechanical switch click
 */
export function playSwitchSound(turnedOn: boolean) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    if (turnedOn) {
      // Upward crisp chirp
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(840, t + 0.035);
    } else {
      // Downward subtle click
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.035);
    }

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.045);
  } catch {
    /* audio is optional */
  }
}

/**
 * Play a subtle, tactile mechanical "dhap" tap sound
 */
export function playTapSound() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.045);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    osc.start(t);
    osc.stop(t + 0.05);
  } catch {
    /* audio is optional */
  }
}

/**
 * Trigger physical haptics on mobile devices
 */
export function triggerHaptic(pattern: number | number[] = 12) {
  if (typeof window !== "undefined" && "navigator" in window && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Combined physical haptic + sound click
 */
export function triggerTap() {
  playTapSound();
  triggerHaptic(12);
}

/**
 * Rich celebratory major chord chimes
 */
export function playCelebrationAudio() {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const startTime = ctx.currentTime + idx * 0.08;
      const duration = 0.55;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.14, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  } catch {
    /* ignore */
  }
}
