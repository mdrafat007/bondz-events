import { useEffect, useRef } from "react";

/** Lightweight canvas confetti burst; colors are read from the Bondz theme variables. */
export function Confetti({ fire }: { fire: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!fire || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const css = getComputedStyle(document.documentElement);
    const colors = ["--bondz-primary", "--bondz-ink", "--bondz-status", "--bondz-review"].map((v) => css.getPropertyValue(v).trim()).filter(Boolean);
    const w = (canvas.width = canvas.offsetWidth);
    const h = (canvas.height = canvas.offsetHeight);
    const parts = Array.from({ length: 180 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.3, y: h * 0.35,
      vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 4,
      s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      c: colors[Math.floor(Math.random() * colors.length)] ?? "currentColor",
    }));
    let raf = 0; let frame = 0;
    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.vy += 0.38; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - frame / 200);
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
      }
      if (frame < 200) raf = requestAnimationFrame(tick); else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fire]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-50 h-full w-full" />;
}
