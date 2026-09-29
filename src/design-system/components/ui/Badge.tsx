import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
const badgeVariants = cva("inline-flex items-center justify-center rounded-control border px-2.5 py-1 font-sans text-[0.65rem] font-extrabold uppercase tracking-widest", {
  variants: { variant: { accent: "border-primary bg-primary text-surface-light", neutral: "border-hairline bg-surface-light text-ink", outline: "border-primary text-primary", muted: "border-hairline bg-surface text-subtle" }, size: { sm: "text-[0.6rem] px-2 py-0.5", md: "text-[0.65rem] px-2.5 py-1" } },
  defaultVariants: { variant: "neutral", size: "md" },
});
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ className, variant, size, ...props }, ref) {
  return <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />;
});
