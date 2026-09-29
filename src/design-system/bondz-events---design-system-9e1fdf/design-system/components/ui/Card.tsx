import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
const cardVariants = cva("rounded-card border border-hairline bg-surface text-ink", {
  variants: { variant: { flat: "", elevated: "card-shadow", subtle: "soft-shadow", outlined: "bg-transparent" }, size: { sm: "p-4", md: "p-4 sm:p-5 md:p-6", lg: "p-6 md:p-8" } },
  defaultVariants: { variant: "flat", size: "md" },
});
export interface CardProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof cardVariants> {}
export const Card = forwardRef<HTMLElement, CardProps>(function Card({ className, variant, size, ...props }, ref) {
  return <article ref={ref} className={cn(cardVariants({ variant, size }), className)} {...props} />;
});
