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
  const navLink = (item: SiteNavItem, i: number, mobile: boolean) => item.href ? <a key={item.label} href={item.href} aria-current={item.active ? "page" : undefined} onClick={(event) => { triggerTap(); onNavigate?.(event, item); if (!event.defaultPrevented) setOpen(false); }} className={cn("group relative font-extrabold uppercase text-ink transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", mobile ? "flex min-h-14 items-center gap-4 pl-5 text-sm" : "whitespace-nowrap py-3 text-[0.57rem] xl:text-[0.68rem]", item.active && "text-primary") }><span className={cn("font-serif italic text-primary", mobile ? "text-xl" : "absolute -left-3 -top-3 text-sm")}>{String(i + 1).padStart(2, "0")}</span>{item.label}{mobile ? <span className="ml-auto" aria-hidden="true">↗</span> : <span className={cn("absolute bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100", item.active && "scale-x-100")} />}</a> : null;
  return <header ref={ref} className={cn("relative z-20 h-16 shrink-0 border-b border-hairline bg-canvas sm:h-20 lg:h-22", className)} {...props}>
    <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
      <a href={brandHref} aria-label="Bondz Events home" onClick={triggerTap} className="shrink-0 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><BrandLockup size="sm" className="w-28 sm:w-32 xl:w-40" /></a>
      <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-4 xl:gap-6 lg:flex">
        {items.map((item, i) => navLink(item, i, false))}
      </nav>
      <div className="hidden shrink-0 items-center gap-2 lg:flex"><ThemeSoundToggle variant="icons" />{action}</div>
      <div className="flex shrink-0 items-center gap-2 lg:hidden"><Button variant="outline" size="sm" aria-expanded={open} aria-controls="bondz-mobile-nav" onClick={() => setOpen(!open)}>{open ? "✕ CLOSE" : "☰ MENU"}</Button></div>
    </div>
    {open && <div id="bondz-mobile-nav" className="scroll-quiet popover-shadow absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-hairline bg-canvas px-4 pb-4 pt-2 lg:hidden">
      <nav aria-label="Mobile navigation" className="divide-y divide-hairline">{items.map((item, i) => navLink(item, i, true))}</nav>
      <ThemeSoundToggle className="mt-4 justify-center border-t border-hairline pt-4" />
    </div>}
  </header>;
});
