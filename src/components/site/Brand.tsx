import brandLockup from "@/assets/brand-lockup.png";
import brandLockupDark from "@/assets/brand-lockup-dark.png";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function Lockup({ className, dark }: { className?: string; dark?: boolean }) {
  const { theme } = useTheme();
  const isDark = dark ?? theme === "dark";
  return (
    <img
      src={isDark ? brandLockupDark : brandLockup}
      alt="Bondz Events - by Mr. Bondz"
      className={cn("h-7 sm:h-8 md:h-9 w-auto select-none object-contain transition-opacity duration-200", className)}
      draggable={false}
    />
  );
}

export function StatusLine({ className }: { className?: string }) {
  return (
    <span className={cn("eyebrow inline-flex items-center gap-2 whitespace-nowrap", className)}>
      <span className="live-dot size-1.5 rounded-full bg-success" aria-hidden />
      Solo Event Organizer · 16 Years · 700+ Celebrations
    </span>
  );
}

export function Ticker({
  children,
  dir = "left",
  className,
}: {
  children: React.ReactNode;
  dir?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={cn("group relative w-full overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]", className)}>
      <div className={cn("flex w-max gap-3 py-1.5 items-center transition-all group-hover:[animation-play-state:paused]", dir === "left" ? "ticker-marquee-left" : "ticker-marquee-right")}>
        <div className="flex shrink-0 items-center gap-3">{children}</div>
        <div className="flex shrink-0 items-center gap-3" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
