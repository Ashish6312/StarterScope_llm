import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SsButton } from "@/components/ss/SsButton";
import { cn } from "@/lib/utils";

interface PlanDef {
  name: string;
  price: { monthly: number; annual: number };
  desc: string;
  features: { label: string; included: boolean }[];
  cta: string;
  variant: "secondary" | "primary" | "blue";
  highlight?: "popular" | "value";
  border: string;
  bg: string;
}

const plans: PlanDef[] = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    desc: "Get started with intelligence basics.",
    features: [
      { label: "3 scans / month", included: true },
      { label: "Basic recommendations", included: true },
      { label: "Community support", included: true },
      { label: "PDF export", included: false },
      { label: "Business plan", included: false },
    ],
    cta: "Start Free",
    variant: "secondary",
    border: "border border-border",
    bg: "bg-surface",
  },
  {
    name: "Starter",
    price: { monthly: 499, annual: 399 },
    desc: "For active founders validating ideas.",
    features: [
      { label: "30 scans / month", included: true },
      { label: "Full recommendations", included: true },
      { label: "PDF export", included: true },
      { label: "Business plan", included: true },
      { label: "Priority support", included: true },
    ],
    cta: "Get Starter",
    variant: "primary",
    highlight: "popular",
    border: "border-2 border-accent-emerald",
    bg: "bg-gradient-to-br from-accent-emerald-light to-vivid-blue-light dark:bg-elevated dark:from-elevated dark:to-elevated",
  },
  {
    name: "Professional",
    price: { monthly: 1499, annual: 1199 },
    desc: "For agencies and serial entrepreneurs.",
    features: [
      { label: "Unlimited scans", included: true },
      { label: "All Starter features", included: true },
      { label: "API access", included: true },
      { label: "Dedicated support", included: true },
      { label: "Custom reports", included: true },
    ],
    cta: "Go Pro",
    variant: "blue",
    highlight: "value",
    border: "border border-vivid-blue/40",
    bg: "bg-surface",
  },
];

export function PricingSection({ standalone = false }: { standalone?: boolean }) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <section
      id="pricing"
      className={cn(
        "py-24",
        standalone ? "bg-background" : "bg-surface border-y border-border"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow text-accent-emerald">◈ PRICING ◈</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 font-body text-base sm:text-lg text-text-secondary">
            Start free. Scale when you're ready.
          </p>

          <div className="mt-8 inline-flex items-center gap-3">
            <div className="bg-elevated rounded-full p-1 flex">
              <button
                onClick={() => setBilling("monthly")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  billing === "monthly"
                    ? "bg-accent-emerald text-accent-emerald-foreground"
                    : "text-text-secondary"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  billing === "annual"
                    ? "bg-accent-emerald text-accent-emerald-foreground"
                    : "text-text-secondary"
                )}
              >
                Annual
              </button>
            </div>
            {billing === "annual" && (
              <span className="text-xs font-mono px-2 py-1 rounded-md bg-vivid-amber/10 text-vivid-amber border border-vivid-amber/20">
                Save 20%
              </span>
            )}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-5 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={p.highlight !== "popular" ? { y: -4 } : undefined}
              className={cn(
                "relative p-8 rounded-2xl",
                p.border,
                p.bg,
                p.highlight === "popular" && "lg:scale-[1.04] shadow-card-hover"
              )}
            >
              {p.highlight === "popular" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent-emerald text-accent-emerald-foreground text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              {p.highlight === "value" && (
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-mono text-vivid-blue uppercase tracking-widest">
                    Best Value
                  </span>
                </div>
              )}

              <h3 className="font-display font-bold text-xl text-text-primary">
                {p.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display font-extrabold text-[42px] text-text-primary">
                  ₹{p.price[billing].toLocaleString()}
                </span>
                <span className="font-body text-base text-text-muted">/mo</span>
              </div>
              <p className="mt-1 font-body text-sm text-text-muted">{p.desc}</p>

              <div className="my-6 h-px bg-border" />

              <ul className="space-y-3">
                {p.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-3">
                    {f.included ? (
                      <Check className="w-4 h-4 text-accent-emerald mt-0.5 flex-shrink-0" strokeWidth={3} />
                    ) : (
                      <X className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={cn(
                        "font-body text-sm",
                        f.included
                          ? "text-text-secondary"
                          : "text-text-muted line-through"
                      )}
                    >
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/dashboard" className="block mt-8">
                <SsButton variant={p.variant} className="w-full">
                  {p.cta}
                </SsButton>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
