import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "blue" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent-emerald text-accent-emerald-foreground hover:bg-accent-emerald-dark hover:-translate-y-[2px] hover:shadow-glow-emerald",
  secondary:
    "border-2 border-border text-text-secondary hover:border-accent-emerald/40 hover:text-text-primary hover:bg-accent-emerald-light",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-elevated",
  blue: "bg-vivid-blue text-white hover:opacity-90 hover:-translate-y-[2px]",
  outline:
    "border border-accent-emerald text-accent-emerald hover:bg-accent-emerald-light",
  danger:
    "bg-vivid-rose text-white hover:opacity-90",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] rounded-lg",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-14 px-8 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-body font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-emerald/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
