import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Download, FileText } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSearch } from "@/context/SearchContext";
import { SsButton } from "@/components/ss/SsButton";
import { SsBadge } from "@/components/ss/SsBadge";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/utils/translations";

const competitors = [
  { name: "Spice Junction", distance: "0.4 km", type: "Cloud Kitchen", status: "Active" },
  { name: "Roti Box", distance: "1.2 km", type: "Tiffin Service", status: "Active" },
  { name: "FreshBowl", distance: "2.1 km", type: "Healthy Meals", status: "Closed" },
];

export default function BusinessDetails() {
  const { selected } = useSearch();
  const { lang } = useLanguage();
  const { t } = useTranslation(lang);

  if (!selected) return <Navigate to="/dashboard" replace />;

  const radarData = [
    { dim: t("marketSize"), value: 90 },
    { dim: t("competition"), value: 60 },
    { dim: t("growthRate"), value: 85 },
    { dim: t("easeOfEntry"), value: 75 },
    { dim: t("profitability"), value: 88 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 font-body text-sm text-text-secondary hover:text-text-primary transition-colors no-print"
        >
          <ArrowLeft className="w-4 h-4" /> {t("backToResults")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card overflow-hidden">
              <div className="h-1 bg-gradient-tier-top" />
              <div className="p-8">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary">
                      {selected.name}
                    </h1>
                    <span className="mt-2 inline-block font-mono text-xs text-text-muted">
                      {selected.category}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full border-[3px] border-accent-emerald flex items-center justify-center">
                      <span className="font-mono text-2xl font-bold text-accent-emerald">
                        {selected.score}
                      </span>
                    </div>
                    <span className="mt-1 text-[10px] font-mono text-text-muted uppercase tracking-wider">
                      / 100
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <SsBadge key={t}>{t}</SsBadge>
                  ))}
                </div>
                <p className="mt-6 font-body text-base text-text-secondary leading-[1.8]">
                  {selected.description} {lang === "hi" 
                    ? "यह सिफारिश सत्यापित सूक्ष्म-बाजार संकेतों और सहकर्मी-सत्यापित मांग पैटर्न पर आधारित है। हमारा 5-स्तरीय इंजन निर्णय-ग्रेड आउटपुट देने के लिए खोज प्रवृत्तियों, ओएसएम व्यावसायिक घनत्व और उपभोक्ता व्यवहार को क्रॉस-रेफरेंस करता है।"
                    : "This recommendation is anchored to verified micro-market signals and peer-validated demand patterns. Our 5-layer engine cross-references search trends, OSM business density, and consumer behavior to produce decision-grade output."}
                </p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display font-bold text-lg text-text-primary">
                {t("marketAnalysis")}
              </h2>
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="dim"
                      tick={{ fill: "hsl(var(--text-secondary))", fontSize: 12 }}
                    />
                    <Radar
                      dataKey="value"
                      stroke="hsl(var(--accent-emerald))"
                      fill="hsl(var(--accent-emerald))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display font-bold text-lg text-text-primary">
                {t("competitiveLandscape")}
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="font-mono text-[11px] text-text-muted uppercase tracking-widest">
                    <tr>
                      <th className="py-2 pr-4">{t("compName")}</th>
                      <th className="py-2 pr-4">{t("compDistance")}</th>
                      <th className="py-2 pr-4">{t("compType")}</th>
                      <th className="py-2">{t("compStatus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map((c) => (
                      <tr key={c.name} className="border-t border-border">
                        <td className="py-3 pr-4 font-body text-sm text-text-primary">{c.name}</td>
                        <td className="py-3 pr-4 font-mono text-sm text-text-secondary">{c.distance}</td>
                        <td className="py-3 pr-4 font-body text-sm text-text-secondary">{c.type}</td>
                        <td className="py-3">
                          <SsBadge tone={c.status === "Active" ? "emerald" : "rose"}>
                            {c.status === "Active" ? t("compActive") : t("compClosed")}
                          </SsBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selected.keySuccessFactors && selected.keySuccessFactors.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-display font-bold text-lg text-text-primary">
                  {t("keySuccessFactors")}
                </h2>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-text-secondary">
                  {selected.keySuccessFactors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {selected.sixMonthPlan && selected.sixMonthPlan.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-display font-bold text-lg text-text-primary">
                  {t("sixMonthPlan")}
                </h2>
                <div className="mt-4 space-y-3">
                  {selected.sixMonthPlan.map((s, i) => (
                    <div key={i} className="flex gap-4 items-start pb-3 border-b border-border/40 last:border-0 last:pb-0">
                      <span className="font-mono text-xs font-bold text-accent-emerald bg-accent-emerald-light px-2.5 py-1 rounded-lg">
                        {s.month}
                      </span>
                      <span className="text-sm text-text-secondary leading-relaxed">
                        {s.goal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-base text-text-primary">
                {t("financialSummary")}
              </h3>
              <ul className="mt-4 space-y-4">
                {[
                  { label: t("investmentRequired"), v: selected.investment },
                  { label: t("potentialRevenue"), v: selected.potentialRevenue || "₹2.5L – 4L" },
                  { label: t("roiTimeframe"), v: selected.roi },
                  { label: t("paybackPeriod"), v: selected.paybackPeriod || "12 Months" },
                ].map((m) => (
                  <li key={m.label}>
                    <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                      {m.label}
                    </div>
                    <div className="mt-1 font-body font-bold text-lg text-text-primary">
                      {m.v}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display font-bold text-base text-text-primary">
                {t("riskAssessment")}
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  { tone: "emerald" as const, label: t("marketDemand"), risk: t("low"), desc: lang === "hi" ? "निरंतर, बढ़ती हुई।" : "Sustained, growing." },
                  { tone: "amber" as const, label: t("operationalCost"), risk: t("medium"), desc: lang === "hi" ? "पैमाने के साथ प्रबंधनीय।" : "Manageable with scale." },
                  { tone: "emerald" as const, label: t("regulatory"), risk: t("low"), desc: lang === "hi" ? "केवल मानक अनुपालन।" : "Standard compliance only." },
                ].map((r) => (
                  <li key={r.label}>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-text-primary">{r.label}</span>
                      <SsBadge tone={r.tone}>{r.risk}</SsBadge>
                    </div>
                    <p className="mt-1 font-body text-xs text-text-muted">{r.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 bg-accent-emerald-light border-accent-emerald/20 no-print">
              <h3 className="font-display font-bold text-base text-text-primary">
                {t("readyToStart")}
              </h3>
              <p className="mt-1 font-body text-sm text-text-secondary">
                {t("readyToStartDesc")}
              </p>
              <Link to="/business-plan" className="block mt-4">
                <SsButton variant="primary" className="w-full">
                  <FileText className="w-4 h-4" /> {t("generatePlan")}
                </SsButton>
              </Link>
              <SsButton
                variant="ghost"
                className="w-full mt-2"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4" /> {t("downloadPdf")}
              </SsButton>
            </div>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}
