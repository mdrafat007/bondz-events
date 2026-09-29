import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
export interface AppShellProps extends HTMLAttributes<HTMLDivElement> { header?: ReactNode; footer?: ReactNode; children: ReactNode }
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell({ header, footer, children, className, ...props }, ref) {
  return <div ref={ref} className={cn("flex h-dvh flex-col overflow-hidden bg-canvas font-sans text-ink transition-colors duration-300", className)} {...props}>
    {header && <div className="shrink-0">{header}</div>}
    <main className="relative min-h-0 flex-1 overflow-hidden">{children}</main>
    {footer && <div className="shrink-0">{footer}</div>}
  </div>;
});
