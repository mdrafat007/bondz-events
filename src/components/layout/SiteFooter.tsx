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
        "h-auto min-h-8 flex-wrap justify-center gap-x-3 gap-y-0.5 py-1 text-center sm:justify-between sm:gap-4 sm:py-0 sm:text-left",
        "[&_button]:whitespace-normal [&_span]:whitespace-normal",
        className,
      )}
    />
  );
}
