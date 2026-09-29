import { useEffect, useState } from "react";
import { CANCELLATION_POLICY } from "@/lib/bondz-data";

export function PolicyDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <span onClick={() => setOpen(true)} className="min-w-0 cursor-pointer">
        {children}
      </span>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cancellation and rescheduling policy"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-xs sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[88dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border hairline bg-surface-light text-ink shadow-2xl sm:rounded-2xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b hairline px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <p className="eyebrow text-primary">Policy</p>
                <h2 className="display mt-1 text-xl sm:text-2xl">Cancellation &amp; Rescheduling</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border hairline bg-surface font-bold text-ink/70 transition-colors hover:bg-canvas hover:text-ink"
              >
                ✕
              </button>
            </div>
            <ol className="scroll-quiet min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-6">
              {CANCELLATION_POLICY.map((t, i) => (
                <li key={t.t} className="grid grid-cols-[1.6rem_minmax(0,1fr)] gap-2 border-b hairline py-3 last:border-0">
                  <span className="text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{t.t}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink/70">{t.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 border-t border-hairline/60 bg-canvas px-4 py-1.5 text-ink/55 transition-colors duration-300 md:px-8">
      <span className="eyebrow truncate">
        © 2026 Bondz Events<span className="hidden sm:inline"> · by Mr. Bondz</span>
      </span>
      <PolicyDialog>
        <button
          type="button"
          className="eyebrow shrink-0 underline-offset-4 hover:text-ink hover:underline"
        >
          Cancellation<span className="hidden sm:inline"> &amp; Rescheduling</span>
        </button>
      </PolicyDialog>
    </footer>
  );
}
