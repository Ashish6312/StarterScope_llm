import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingSection } from "@/components/landing/PricingSection";
import { Check, X } from "lucide-react";

const featureRows = [
  ["Monthly Scans", "3", "30", "Unlimited"],
  ["AI Recommendations", true, true, true],
  ["PDF Export", false, true, true],
  ["Business Plan", false, true, true],
  ["Competitive Analysis", false, true, true],
  ["Alpha Vault", false, true, true],
  ["API Access", false, false, true],
  ["Priority Support", false, false, true],
] as const;

function Cell({ v }: { v: string | boolean }) {
  if (typeof v === "boolean") {
    return v ? (
      <Check className="w-5 h-5 text-accent-emerald inline-block" strokeWidth={3} />
    ) : (
      <X className="w-5 h-5 text-text-muted inline-block" />
    );
  }
  return <span className="font-mono text-sm text-text-primary">{v}</span>;
}

export default function AcquisitionTiers() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1"
      >
        <div className="text-center max-w-2xl mx-auto px-4 pt-16">
          <span className="eyebrow text-accent-emerald">◈ PLANS ◈</span>
          <h1 className="mt-4 font-display font-extrabold text-4xl sm:text-5xl text-text-primary">
            Choose Your Intelligence Plan
          </h1>
          <p className="mt-4 font-body text-lg text-text-secondary">
            Transparent pricing built for Indian entrepreneurs.
          </p>
        </div>

        <PricingSection standalone />

        {/* Comparison table */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-display font-bold text-2xl text-text-primary mb-8">
              Feature Comparison
            </h2>
            <div className="rounded-2xl overflow-hidden border border-border">
              <div className="bg-elevated px-6 py-4 grid grid-cols-4 gap-2 font-display font-semibold text-sm text-text-primary">
                <span>Feature</span>
                <span className="text-center">Free</span>
                <span className="text-center">Starter</span>
                <span className="text-center">Pro</span>
              </div>
              {featureRows.map((row, i) => (
                <div
                  key={row[0]}
                  className={`px-6 py-4 grid grid-cols-4 gap-2 items-center ${
                    i % 2 === 0 ? "bg-surface" : "bg-background"
                  }`}
                >
                  <span className="font-body text-sm text-text-primary">{row[0]}</span>
                  <span className="text-center"><Cell v={row[1]} /></span>
                  <span className="text-center"><Cell v={row[2]} /></span>
                  <span className="text-center"><Cell v={row[3]} /></span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.main>
      <Footer />
    </div>
  );
}
