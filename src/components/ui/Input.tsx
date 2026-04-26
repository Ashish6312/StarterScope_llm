import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, rightIcon, className, ...rest },
  ref
) {
  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full h-12 rounded-xl border border-border bg-elevated text-text-primary placeholder:text-text-muted text-sm font-body transition-colors",
          "focus:outline-none focus:border-accent-emerald focus:bg-surface focus:ring-4 focus:ring-accent-emerald/10",
          leftIcon ? "pl-10" : "pl-4",
          rightIcon ? "pr-10" : "pr-4",
          className
        )}
        {...rest}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
          {rightIcon}
        </div>
      )}
    </div>
  );
});
