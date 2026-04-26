import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function LiveDemo() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1/3 orb-emerald pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow text-accent-emerald">◈ LIVE INTELLIGENCE ◈</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary">
            See It In Action
          </h2>
          <p className="mt-4 font-body text-base sm:text-lg text-text-secondary">
            Real market data. Real verification. Real opportunities.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Real market data, not templates",
              "Verified against OSM business registry",
              "Financial estimates in Indian Rupees ₹",
              "Exportable PDF strategic report",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-accent-emerald-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-accent-emerald" strokeWidth={3} />
                </span>
                <span className="font-body text-[15px] text-text-secondary">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-border shadow-float"
        >
          <div className="bg-elevated px-4 py-3 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-vivid-rose" />
              <span className="w-3 h-3 rounded-full bg-vivid-amber" />
              <span className="w-3 h-3 rounded-full bg-accent-emerald" />
            </div>
            <span className="font-mono text-xs text-text-muted">
              starterscope — intelligence-scan
            </span>
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="font-mono text-[11px] text-accent-emerald font-semibold">
                LIVE
              </span>
            </div>
          </div>

          <div className="bg-surface p-6 font-mono text-sm space-y-2.5">
            <p className="text-text-muted">$ scanning location...</p>
            <p className="text-accent-emerald">
              ▶ Bhopal, Madhya Pradesh, India
            </p>
            <p className="text-text-muted">$ running 5-layer analysis...</p>
            <div className="h-2 w-full rounded-full bg-elevated overflow-hidden">
              <div className="h-full w-full bg-gradient-brand relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan-line" />
              </div>
            </div>
            <p className="text-accent-emerald">✓ Neural synthesis complete (2.3s)</p>

            <div className="border-t border-border my-3" />
            <p className="text-text-muted text-[10px] tracking-widest">
              TOP OPPORTUNITIES
            </p>

            {[
              {
                name: "Cloud Kitchen / Dark Restaurant",
                tags: "low-capital · trending",
                score: 94,
                color: "border-accent-emerald text-accent-emerald",
                bar: "bg-accent-emerald w-[94%]",
                dot: "bg-accent-emerald",
              },
              {
                name: "EdTech Coaching Centre",
                tags: "high-demand · recurring",
                score: 88,
                color: "border-vivid-blue text-vivid-blue",
                bar: "bg-vivid-blue w-[88%]",
                dot: "bg-vivid-blue",
              },
              {
                name: "EV Charging Hub",
                tags: "govt-backed · long-term",
                score: 82,
                color: "border-vivid-amber text-vivid-amber",
                bar: "bg-vivid-amber w-[82%]",
                dot: "bg-vivid-amber",
              },
            ].map((r, i) => (
              <div
                key={r.name}
                className="py-3 border-b border-border last:border-0 flex items-start justify-between gap-3"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                    <span className="font-body font-medium text-[14px] text-text-primary truncate">
                      {r.name}
                    </span>
                  </div>
                  <p className="mt-1 ml-4 text-[10px] text-text-muted">{r.tags}</p>
                  <div className="mt-2 ml-4 h-1 w-[90%] rounded-full bg-elevated overflow-hidden">
                    <div className={`h-full rounded-full ${r.bar}`} />
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${r.color}`}
                >
                  <span className="font-mono text-[13px] font-bold">{r.score}</span>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-accent-emerald-light text-accent-emerald border border-accent-emerald/20">
                Rising Demand ▲
              </span>
              <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-vivid-blue-light text-vivid-blue border border-vivid-blue/20">
                Low Competition ↓
              </span>
              <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-vivid-amber/10 text-vivid-amber border border-vivid-amber/20">
                ₹ India-Ready
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
