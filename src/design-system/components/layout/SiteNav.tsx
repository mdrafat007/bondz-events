import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { triggerTap } from "../../lib/haptics";
import { Button } from "../ui/Button";
import { BrandLockup } from "../ui/BrandLockup";
import { ThemeSoundToggle } from "../ui/ThemeSoundToggle";

export interface SiteNavItem { label: string; href?: string; active?: boolean }
export interface SiteNavProps extends HTMLAttributes<HTMLElement> { items?: SiteNavItem[]; brandHref?: string; action?: ReactNode }
export const SiteNav = forwardRef<HTMLElement, SiteNavProps>(function SiteNav({ items = [], brandHref = "/", action, className, ...props }, ref) {
  const [open, setOpen] = useState(false);
  return <header ref={ref} className={cn("relative z-20 h-16 shrink-0 border-b border-hairline bg-canvas sm:h-20 lg:h-22", className)} {...props}>
    <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
      <a href={brandHref} aria-label="Bondz Events home" onClick={triggerTap} className="shrink-0 rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><BrandLockup size="sm" className="w-28 sm:w-36 xl:w-40" /></a>
      <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-3 xl:gap-5 lg:flex">
        {items.map((item, i) => item.href ? <a key={item.label} href={item.href} onClick={triggerTap} aria-current={item.active ? "page" : undefined} className={cn("group relative whitespace-nowrap py-3 text-[0.65rem] font-extrabold uppercase text-ink transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary xl:text-xs", item.active && "text-primary") }><span className="absolute -top-1 -left-2 font-serif text-sm italic text-primary">{String(i + 1).padStart(2, "0")}</span>{item.label}<span className={cn("absolute right-0 bottom-1 left-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100", item.active && "scale-x-100")} /></a> : <span key={item.label} className="relative whitespace-nowrap py-3 text-[0.65rem] font-bold uppercase text-subtle xl:text-xs"><span className="absolute -top-1 -left-2 font-serif text-sm italic text-primary">{String(i + 1).padStart(2, "0")}</span>{item.label}</span>)}
      </nav>
      <div className="hidden shrink-0 items-center gap-2 lg:flex"><ThemeSoundToggle />{action}</div>
      <div className="flex shrink-0 items-center gap-2 lg:hidden">{!open && <ThemeSoundToggle variant="icons" />}<Button variant="outline" size="sm" aria-expanded={open} aria-controls="bondz-mobile-nav" onClick={() => setOpen(!open)}>{open ? "✕ CLOSE" : "☰ MENU"}</Button></div>
    </div>
    {open && <div id="bondz-mobile-nav" className="scroll-quiet popover-shadow absolute inset-x-0 top-full max-h-[82vh] overflow-y-auto border-b border-hairline bg-canvas p-4 lg:hidden">
      <nav aria-label="Mobile navigation" className="divide-y divide-hairline">{items.map((item, i) => item.href ? <a key={item.label} href={item.href} aria-current={item.active ? "page" : undefined} onClick={triggerTap} className="flex min-h-14 items-center gap-4 font-extrabold uppercase text-ink focus-visible:outline-2 focus-visible:outline-primary"><span className="font-serif text-lg italic text-primary">{String(i + 1).padStart(2, "0")}</span>{item.label}<span className="ml-auto" aria-hidden="true">→</span></a> : <span key={item.label} className="flex min-h-14 items-center gap-4 font-extrabold uppercase text-subtle"><span className="font-serif text-lg italic text-primary">{String(i + 1).padStart(2, "0")}</span>{item.label}</span>)}</nav>
      <ThemeSoundToggle className="mt-4 justify-center border-t border-hairline pt-4" />
    </div>}
  </header>;
});
