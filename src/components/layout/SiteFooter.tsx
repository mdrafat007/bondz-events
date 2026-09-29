import { SiteFooter as BaseSiteFooter } from "@/design-system/bondz-events---design-system-9e1fdf";
import type { SiteFooterProps } from "@/design-system/bondz-events---design-system-9e1fdf/design-system/components/layout/SiteFooter";
import { cn } from "../../lib/utils";

/**
 * Preview-only wrapper: keeps the design-system footer skin, but lets the bar
 * wrap and breathe on narrow screens instead of truncating its two labels.
 */
export function SiteFooter({ className, ...props }: SiteFooterProps) {
  return (
    <BaseSiteFooter
      {...props}
      className={cn(
        "h-auto min-h-8 flex-wrap justify-center gap-x-3 gap-y-0.5 px-3 py-1 text-center sm:justify-between sm:gap-4 sm:px-6 sm:py-0 sm:text-left",
        "[&_button]:text-[0.5rem] [&_button]:tracking-[0.12em] [&_span]:text-[0.5rem] [&_span]:tracking-[0.12em]",
        "sm:[&_button]:text-[0.6rem] sm:[&_span]:text-[0.6rem] lg:[&_button]:text-[0.66rem] lg:[&_span]:text-[0.66rem]",
        className,
      )}
    />
  );
}
