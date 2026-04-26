import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Download, Save, Printer } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SsButton } from "@/components/ss/SsButton";
import { useSearch } from "@/context/SearchContext";
import { toast } from "sonner";

const projection = [
  { m: "M1", v: 80 },
  { m: "M2", v: 110 },
  { m: "M3", v: 140 },
  { m: "M4", v: 180 },
  { m: "M5", v: 220 },
  { m: "M6", v: 260 },
  { m: "M7", v: 300 },
  { m: "M8", v: 340 },
  { m: "M9", v: 380 },
];

const sections = [
  {
    title: "Executive Summary",
    body: "An end-to-end venture brief synthesizing 5 layers of market intelligence into an investor-ready summary. The opportunity is anchored by validated demand, defensible positioning, and a low capital threshold.",
  },
  {
    title: "Market Opportunity",
    body: "The local TAM is estimated using verified business density and consumer search data. Year-over-year growth in the segment exceeds the national baseline by 2.3×, signaling early-cycle entry.",
  },
  {
    title: "Business Model",
    body: "Revenue streams are diversified across direct-to-consumer orders, B2B partnerships, and subscription tiers. Gross margins target 42-58% with operating leverage emerging at month 6.",
  },
  {
    title: "Marketing Strategy",
    body: "Hyper-local performance marketing (Google + Meta) anchored by referral loops and aggregator partnerships. Content engine focused on local SEO and creator collaborations.",
  },
  {
    title: "Risk Mitigation",
    body: "Primary risks (operational, supply chain, regulatory) are addressed through phased onboarding, redundant suppliers, and pre-launch compliance. Insurance and reserve capital cover 6 months of fixed costs.",
  },
  {
    title: "Launch Timeline",
    body: "12-month phased launch: validation (M1-2), setup (M3-4), soft launch (M5), public launch (M6), growth (M7-12). Detailed milestones in the Roadmap module.",
  },
];

export default function BusinessPlan() {
  const { selected } = useSearch();
  if (!selected) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="sticky top-16 z-40 bg-surface/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-base sm:text-lg text-text-primary">
              {selected.name} — Business Plan
            </h1>
          </div>
          <div className="flex gap-2">
            <SsButton variant="ghost" size="sm" onClick={() => toast.success("Saved to vault")}>
              <Save className="w-4 h-4" /> Save
            </SsButton>
            <SsButton variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print
            </SsButton>
            <SsButton variant="primary" size="sm" onClick={() => toast.info("PDF export coming soon")}>
              <Download className="w-4 h-4" /> Export PDF
            </SsButton>
          </div>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6"
      >
        {sections.slice(0, 3).map((s) => (
          <section key={s.title} className="glass-card p-6 sm:p-8">
            <h2 className="font-display font-bold text-xl text-text-primary border-l-4 border-accent-emerald pl-3">
              {s.title}
            </h2>
            <p className="mt-4 font-body text-base text-text-secondary leading-[1.8]">
              {s.body}
            </p>
          </section>
        ))}

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-display font-bold text-xl text-text-primary border-l-4 border-accent-emerald pl-3">
            Financial Projections
          </h2>
          <p className="mt-4 font-body text-base text-text-secondary">
            Estimated monthly revenue (₹ thousands) over the first 9 months.
          </p>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projection}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="m" stroke="hsl(var(--text-muted))" fontSize={12} />
                <YAxis stroke="hsl(var(--text-muted))" fontSize={12} />
                <Bar dataKey="v" fill="hsl(var(--accent-emerald))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {sections.slice(3).map((s) => (
          <section key={s.title} className="glass-card p-6 sm:p-8">
            <h2 className="font-display font-bold text-xl text-text-primary border-l-4 border-accent-emerald pl-3">
              {s.title}
            </h2>
            <p className="mt-4 font-body text-base text-text-secondary leading-[1.8]">
              {s.body}
            </p>
          </section>
        ))}
      </motion.main>
      <Footer />
    </div>
  );
}
