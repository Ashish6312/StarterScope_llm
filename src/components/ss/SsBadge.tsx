import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "emerald" | "blue" | "amber" | "rose" | "violet";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-elevated text-text-secondary border-border",
  emerald: "bg-accent-emerald-light text-accent-emerald border-accent-emerald/20",
  blue: "bg-vivid-blue-light text-vivid-blue border-vivid-blue/20",
  amber: "bg-vivid-amber/10 text-vivid-amber border-vivid-amber/20",
  rose: "bg-vivid-rose/10 text-vivid-rose border-vivid-rose/20",
  violet: "bg-vivid-violet/10 text-vivid-violet border-vivid-violet/20",
};

export function SsBadge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-lg font-mono text-[11px]",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
