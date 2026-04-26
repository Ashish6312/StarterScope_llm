import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookmarkPlus,
  FileText,
} from "lucide-react";
import type { Recommendation } from "@/utils/realBusinessAPI";
import { SsButton } from "@/components/ss/SsButton";
import { SsBadge } from "@/components/ss/SsBadge";
import { useSearch } from "@/context/SearchContext";
import { toast } from "sonner";

function scoreBar(score: number) {
  if (score >= 90) return "bg-gradient-tier-top";
  if (score >= 75) return "bg-gradient-tier-mid";
  return "bg-gradient-tier-low";
}
function scoreColor(score: number) {
  if (score >= 90) return "border-accent-emerald text-accent-emerald";
  if (score >= 75) return "border-vivid-blue text-vivid-blue";
  return "border-vivid-amber text-vivid-amber";
}
function riskTone(risk: Recommendation["risk"]): "emerald" | "amber" | "rose" {
  if (risk === "Low") return "emerald";
  if (risk === "Medium") return "amber";
  return "rose";
}

export function EnhancedRecommendationCard({
  rec,
  index,
}: {
  rec: Recommendation;
  index: number;
}) {
  const { setSelected } = useSearch();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl overflow-hidden border border-border bg-surface shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className={`h-1 w-full ${scoreBar(rec.score)}`} />
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-lg text-text-primary leading-tight">
              {rec.name}
            </h3>
            <span className="mt-1 inline-block font-mono text-[11px] bg-elevated text-text-muted px-2 py-0.5 rounded">
              {rec.category}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 rounded-full border-[3px] flex items-center justify-center ${scoreColor(
                rec.score
              )}`}
            >
              <span className="font-mono text-base font-bold">{rec.score}</span>
            </div>
            <span className="mt-1 text-[10px] text-text-muted uppercase tracking-wider">
              Score
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {rec.tags.map((t) => (
            <SsBadge key={t} tone="neutral">
              {t}
            </SsBadge>
          ))}
        </div>

        <p className="mt-3 font-body text-sm text-text-secondary leading-[1.65] line-clamp-3">
          {rec.description}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { value: rec.investment, label: "Investment" },
            { value: rec.roi, label: "ROI" },
            { value: rec.risk, label: "Risk" },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-elevated rounded-xl p-3 text-center border border-border"
            >
              <div className="font-mono text-sm text-text-primary font-medium">
                {m.label === "Risk" ? (
                  <SsBadge tone={riskTone(rec.risk)} className="!py-0.5">
                    {rec.risk}
                  </SsBadge>
                ) : (
                  m.value
                )}
              </div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <SsButton
            variant="ghost"
            size="sm"
            onClick={() => toast.success(`Saved ${rec.name} to vault`)}
          >
            <BookmarkPlus className="w-4 h-4" /> Save
          </SsButton>
          <Link to="/business-details" onClick={() => setSelected(rec)}>
            <SsButton variant="primary" size="sm">
              Details <ArrowRight className="w-4 h-4" />
            </SsButton>
          </Link>
          <Link to="/business-plan" onClick={() => setSelected(rec)}>
            <SsButton variant="blue" size="sm">
              <FileText className="w-4 h-4" /> Plan
            </SsButton>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
