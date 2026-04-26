import { forwardRef, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: "default" | "glass" | "accent" | "elevated";
  hover?: boolean;
  children: ReactNode;
}

const variantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-surface border border-border shadow-card",
  glass: "bg-surface/80 backdrop-blur-xl border border-border",
  accent: "bg-accent-emerald-light border border-accent-emerald/20",
  elevated: "bg-elevated border border-border shadow-lg",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", hover = false, className, children, ...rest },
  ref
) {
  return (
    <motion.div
      ref={ref}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "rounded-2xl",
        variantClasses[variant],
        hover && "hover:shadow-card-hover transition-shadow",
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
});
