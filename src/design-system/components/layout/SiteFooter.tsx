import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
export interface SiteFooterProps extends HTMLAttributes<HTMLElement> { variant?: "standard" | "action" }
export const SiteFooter = forwardRef<HTMLElement, SiteFooterProps>(function SiteFooter({ variant = "standard", className, children, ...props }, ref) {
  return <footer ref={ref} className={cn("shrink-0 border-t border-hairline bg-canvas/95 px-4 py-3 text-xs text-subtle backdrop-blur-md sm:px-6", variant === "action" && "py-3 sm:py-4", className)} {...props}>
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">{children ?? <><span>© Bondz Events</span><span>By Mr. Bondz · 16 years · 700+ celebrations</span></>}</div>
  </footer>;
});
