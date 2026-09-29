import { forwardRef, type ImgHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import lightLogo from "../../assets/logos/BONDZ-EVENTS-NAVLOGO.png";
import darkLogo from "../../assets/logos/BONDZ-EVENTS-NAV-Dark-LOGO.png";
import lightIcon from "../../assets/icons/BONDZ_LOGO_ICON_-_LIGHT.png";
import darkIcon from "../../assets/icons/BONDZ_LOGO_ICON_DARK.png";
const imageVariants = cva("block w-auto object-contain select-none", { variants: { size: { sm: "h-7 sm:h-8", md: "h-8 sm:h-9 md:h-11", lg: "h-12 sm:h-14" } }, defaultVariants: { size: "md" } });
export interface BrandLockupProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet">, VariantProps<typeof imageVariants> { variant?: "wordmark" | "icon"; theme?: "auto" | "light" | "dark" }
export const BrandLockup = forwardRef<HTMLSpanElement, BrandLockupProps>(function BrandLockup({ variant = "wordmark", theme = "auto", size, className, alt = "Bondz Events by Mr. Bondz", ...props }, ref) {
  const light = variant === "icon" ? lightIcon : lightLogo;
  const dark = variant === "icon" ? darkIcon : darkLogo;
  const imageClass = cn(imageVariants({ size }), className);
  return <span ref={ref} className="inline-flex items-center">
    {theme !== "dark" && <img src={light} alt={alt} className={cn(imageClass, theme === "auto" && "dark:hidden")} {...props} />}
    {theme !== "light" && <img src={dark} alt={theme === "auto" ? "" : alt} aria-hidden={theme === "auto" ? true : undefined} className={cn(imageClass, theme === "auto" && "hidden dark:block")} {...props} />}
  </span>;
});
