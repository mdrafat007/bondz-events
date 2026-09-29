import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> { variant?: "standard" | "action" }

export const SiteFooter = forwardRef<HTMLElement, SiteFooterProps>(function SiteFooter({ className, children, ...props }, ref) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer ref={ref} className={cn("flex h-8 shrink-0 items-center justify-between gap-4 px-4 text-ink/55 md:px-8 bg-transparent", className)} {...props}>
        {children ?? (
          <>
            <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink/55 truncate">
              © 2026 BONDZ EVENTS - BY MR. BONDZ
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink/55 hover:text-ink underline-offset-4 hover:underline cursor-pointer transition-colors whitespace-nowrap"
            >
              CANCELLATION & RESCHEDULING POLICY
            </button>
          </>
        )}
      </footer>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[85dvh] overflow-hidden rounded-2xl border border-hairline bg-surface-light shadow-popover">
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <div>
                <span className="font-mono text-[0.66rem] font-bold uppercase tracking-widest text-primary">Policy</span>
                <h3 className="font-serif text-3xl italic text-ink">Cancellation & Rescheduling</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full border border-hairline text-subtle hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="scroll-quiet max-h-[60dvh] overflow-y-auto px-6 py-5 space-y-4 text-sm text-subtle">
              <div className="border-b border-hairline pb-3">
                <p className="font-bold text-ink">01 · Rescheduling Policy</p>
                <p className="mt-1 text-xs leading-relaxed text-subtle">Rescheduling within the same day costs nothing ($0 fee). Rescheduling within 3 days incurs a 5% fee to re-align subcontractor and vendor schedules.</p>
              </div>
              <div className="border-b border-hairline pb-3">
                <p className="font-bold text-ink">02 · Cancellation Policy</p>
                <p className="mt-1 text-xs leading-relaxed text-subtle">Same-day cancellation offers a 100% full refund. Cancellations made after the booking day forfeit the 25% deposit, which is non-refundable to protect committed vendor blocks.</p>
              </div>
              <div>
                <p className="font-bold text-ink">03 · Availability & Weather Guarantee</p>
                <p className="mt-1 text-xs leading-relaxed text-subtle">Every date locked was verified in real-time across Mr. Bondz, your venue, and all assigned subcontractors with zero double-booking risk.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
