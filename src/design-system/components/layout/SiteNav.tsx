import { forwardRef, useState, type HTMLAttributes, type ReactNode, type MouseEvent } from "react";
import { cn } from "../../lib/utils";
import { triggerTap } from "../../lib/haptics";
import { Button } from "../ui/Button";
import { BrandLockup } from "../ui/BrandLockup";
import { ThemeSoundToggle } from "../ui/ThemeSoundToggle";

export interface SiteNavItem { label: string; href?: string; active?: boolean }
export interface SiteNavProps extends HTMLAttributes<HTMLElement> { items?: SiteNavItem[]; brandHref?: string; action?: ReactNode; onNavigate?: (event: MouseEvent<HTMLAnchorElement>, item: SiteNavItem) => void }

export const SiteNav = forwardRef<HTMLElement, SiteNavProps>(function SiteNav({ items = [], brandHref = "/", action, onNavigate, className, ...props }, ref) {
  const [open, setOpen] = useState(false);

  const navLink = (item: SiteNavItem, i: number, mobile: boolean) =>
    item.href ? (
      <a
        key={item.label}
        href={item.href}
        aria-current={item.active ? "page" : undefined}
        onClick={(event) => {
          triggerTap();
          onNavigate?.(event, item);
          if (!event.defaultPrevented) setOpen(false);
        }}
        className={cn(
          "group relative flex items-center font-sans font-black uppercase tracking-tight transition-colors [font-variation-settings:'wdth'_85] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          mobile
            ? "min-h-14 items-center gap-4 pl-5 text-sm text-ink hover:text-primary"
            : "px-2.5 xl:px-3 py-2 text-[0.82rem] xl:text-[0.92rem] text-ink/85 hover:text-ink",
          item.active && "!text-ink font-black",
        )}
      >
        <span className="relative inline-flex items-center">
          <span
            className={cn(
              "font-serif italic font-bold text-primary select-none pointer-events-none drop-shadow-xs",
              mobile ? "text-xl mr-2" : "absolute -top-2.5 -left-2.5 text-[0.78rem] xl:text-[0.84rem]",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{item.label}</span>
          <span
            className={cn(
              "absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-primary transition-transform duration-300",
              item.active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            )}
          />
        </span>
        {mobile && <span className="ml-auto text-ink/40" aria-hidden="true">↗</span>}
      </a>
    ) : null;

  return (
    <header ref={ref} className={cn("relative z-30 h-16 shrink-0 border-b border-hairline bg-canvas sm:h-20 lg:h-22", className)} {...props}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
        <a href={brandHref} aria-label="Bondz Events home" onClick={triggerTap} className="shrink-0 rounded-control transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <BrandLockup className="h-8 sm:h-9 md:h-11 w-auto" />
        </a>

        <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-2 xl:gap-4 lg:flex">
          {items.map((item, i) => navLink(item, i, false))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <ThemeSoundToggle />
          {action}
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <ThemeSoundToggle />
          <Button variant="outline" size="sm" aria-expanded={open} aria-controls="bondz-mobile-nav" onClick={() => setOpen(!open)}>
            {open ? "✕ CLOSE" : "☰ MENU"}
          </Button>
        </div>
      </div>

      {open && (
        <div id="bondz-mobile-nav" className="scroll-quiet popover-shadow absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-hairline bg-canvas px-4 pb-4 pt-2 lg:hidden">
          <nav aria-label="Mobile navigation" className="divide-y divide-hairline">
            {items.map((item, i) => navLink(item, i, true))}
          </nav>
        </div>
      )}
    </header>
  );
});
