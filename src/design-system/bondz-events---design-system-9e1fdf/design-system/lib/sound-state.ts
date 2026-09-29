import { useSyncExternalStore } from "react";

const KEY = "bondz-sound";
const listeners = new Set<() => void>();
let enabled = true;
let initialized = false;

function readSound() {
  if (!initialized && typeof window !== "undefined") {
    try { enabled = window.localStorage.getItem(KEY) !== "false"; } catch { /* Storage may be blocked. */ }
    initialized = true;
  }
  return enabled;
}
export function isSoundEnabled() { return readSound(); }
export function setSoundEnabled(value: boolean) {
  readSound();
  if (enabled === value) return;
  enabled = value;
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, String(value)); } catch { /* Keep in-memory preference. */ }
  }
  listeners.forEach((listener) => listener());
}
export function toggleSound() { setSoundEnabled(!isSoundEnabled()); }
export function useSoundState() {
  return useSyncExternalStore((listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, readSound, () => true);
}
