import peekabooAsset from "../assets/peekaboo-sound.mp3";
import cheersAsset from "../assets/BONDZ_EVENTS-CHEERS_AUDIO.mp3";
import { isSoundEnabled } from "./sound-state";

let audioContext: AudioContext | undefined;
function getContext() {
  if (typeof window === "undefined") return;
  audioContext ??= new window.AudioContext();
  if (audioContext.state === "suspended") void audioContext.resume().catch(() => {});
  return audioContext;
}
function tone(frequency: number, duration: number, type: OscillatorType = "sine", delay = 0, endFrequency?: number) {
  const context = getContext();
  if (!context || !isSoundEnabled()) return;
  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
  gain.gain.setValueAtTime(0.065, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}
function playFile(src: string, fallback: () => void) {
  if (!isSoundEnabled() || typeof Audio === "undefined") return;
  const audio = new Audio(src);
  audio.volume = 0.65;
  void audio.play().catch(fallback);
}
export function triggerHaptic(pattern: number | number[] = 10) {
  if (typeof navigator !== "undefined") navigator.vibrate?.(pattern);
}
export function playTapSound() { tone(140, 0.045, "triangle", 0, 38); }
export function triggerTap() { playTapSound(); triggerHaptic(12); }
export function playSwitchSound(on: boolean) { if (on) tone(320, 0.035, "sine", 0, 840); }
export function playPeekabooSound() { playFile(peekabooAsset, playTapSound); }
export function playCelebrationSound() {
  const synth = () => [523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) => tone(frequency, 0.45, "triangle", i * 0.09));
  playFile(cheersAsset, synth);
  triggerHaptic([30, 40, 50]);
}
