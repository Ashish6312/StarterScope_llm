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
  Tooltip,
} from "recharts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SsButton } from "@/components/ss/SsButton";
import { useSearch } from "@/context/SearchContext";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/utils/translations";

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
  { titleKey: "executiveSummary" as const, bodyKey: "executiveSummaryBody" as const },
  { titleKey: "marketOpportunity" as const, bodyKey: "marketOpportunityBody" as const },
  { titleKey: "businessModel" as const, bodyKey: "businessModelBody" as const },
  { titleKey: "marketingStrategy" as const, bodyKey: "marketingStrategyBody" as const },
  { titleKey: "riskMitigation" as const, bodyKey: "riskMitigationBody" as const },
  { titleKey: "launchTimeline" as const, bodyKey: "launchTimelineBody" as const },
];

export default function BusinessPlan() {
  const { selected } = useSearch();
  const { lang } = useLanguage();
  const { t } = useTranslation(lang);

  if (!selected) return <Navigate to="/dashboard" replace />;

  interface TooltipPayloadItem {
    name: string;
    value: string | number;
    color?: string;
    payload: {
      m: string;
      v: number;
    };
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-2.5 rounded-lg shadow-md font-mono text-xs">
          <p className="font-semibold text-text-primary mb-1">{payload[0].payload.m}</p>
          <p className="text-accent-emerald">
            {lang === "hi" ? "राजस्व" : "Revenue"}: <span className="font-bold">₹{payload[0].value}K</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="sticky top-16 z-40 bg-surface/80 backdrop-blur-xl border-b border-border no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-base sm:text-lg text-text-primary">
              {selected.name} — {t("businessPlanTitle")}
            </h1>
          </div>
          <div className="flex gap-2">
            <SsButton
              variant="ghost"
              size="sm"
              onClick={() => toast.success(lang === "hi" ? "वॉल्ट में सहेजा गया" : "Saved to vault")}
            >
              <Save className="w-4 h-4" /> {t("save")}
            </SsButton>
            <SsButton variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> {t("print")}
            </SsButton>
            <SsButton
              variant="primary"
              size="sm"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4" /> {t("exportPdf")}
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
          <section key={s.titleKey} className="glass-card p-6 sm:p-8">
            <h2 className="font-display font-bold text-xl text-text-primary border-l-4 border-accent-emerald pl-3">
              {t(s.titleKey)}
            </h2>
            <p className="mt-4 font-body text-base text-text-secondary leading-[1.8]">
              {t(s.bodyKey)}
            </p>
          </section>
        ))}

        <section className="glass-card p-6 sm:p-8">
          <h2 className="font-display font-bold text-xl text-text-primary border-l-4 border-accent-emerald pl-3">
            {t("financialProjections")}
          </h2>
          <p className="mt-4 font-body text-base text-text-secondary">
            {t("financialProjDesc")}
          </p>
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projection} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.04)" }} />
                <Bar dataKey="v" fill="hsl(var(--accent-emerald))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {sections.slice(3).map((s) => (
          <section key={s.titleKey} className="glass-card p-6 sm:p-8">
            <h2 className="font-display font-bold text-xl text-text-primary border-l-4 border-accent-emerald pl-3">
              {t(s.titleKey)}
            </h2>
            <p className="mt-4 font-body text-base text-text-secondary leading-[1.8]">
              {t(s.bodyKey)}
            </p>
          </section>
        ))}
      </motion.main>
      <Footer />
    </div>
  );
}
