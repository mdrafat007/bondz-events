import { useState } from "react";
import { TERMS } from "@/lib/bondz-data";

export function PolicyDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </span>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[85dvh] overflow-hidden rounded-2xl border hairline bg-surface-light text-ink shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b hairline px-6 py-5">
              <div>
                <p className="eyebrow text-primary">Policy</p>
                <h2 className="display mt-1 text-3xl sm:text-4xl text-ink">Cancellation & Rescheduling</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
                className="flex size-8 items-center justify-center rounded-full border hairline bg-surface hover:bg-canvas text-ink/70 hover:text-ink transition-colors font-bold"
              >
                ✕
              </button>
            </div>
            <ol className="scroll-quiet max-h-[60dvh] overflow-y-auto px-6 py-4">
              {TERMS.map((t, i) => (
                <li key={t.t} className="grid grid-cols-[2rem_1fr] gap-2 border-b hairline py-3 last:border-0">
                  <span className="text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-semibold text-ink">{t.t}</p>
                    <p className="mt-1 text-sm text-ink/70">{t.b}</p>
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
    <footer className="flex h-8 shrink-0 items-center justify-between gap-4 px-4 text-ink/55 md:px-8 border-t border-hairline/60 bg-canvas transition-colors duration-300">
      <span className="eyebrow truncate">© 2026 Bondz Events - by Mr. Bondz</span>
      <PolicyDialog>
        <button type="button" className="eyebrow underline-offset-4 hover:text-ink hover:underline cursor-pointer">
          Cancellation & Rescheduling Policy
        </button>
      </PolicyDialog>
    </footer>
  );
}
