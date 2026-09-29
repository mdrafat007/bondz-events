export type Mood = "idle" | "happy" | "think";
export type BotSignal = { mood?: Mood; tip?: string };

export function signalBot(s: BotSignal) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<BotSignal>("bondz:bot", { detail: s }));
}
