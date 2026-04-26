import { motion } from "framer-motion";
import {
  Telescope,
  MapPin,
  Lightbulb,
  Map,
  Swords,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    Icon: Telescope,
    title: "AI Market Analysis",
    desc: "5-layer neural synthesis of real-time market data across search, social, and trade signals.",
    bg: "from-accent-emerald-light to-transparent",
    iconColor: "text-accent-emerald",
  },
  {
    Icon: MapPin,
    title: "Hyper-Local Intelligence",
    desc: "GPS + OSM verification ensures 100% real, on-the-ground locations — never stock data.",
    bg: "from-vivid-blue-light to-transparent",
    iconColor: "text-vivid-blue",
  },
  {
    Icon: Lightbulb,
    title: "Smart Recommendations",
    desc: "Ranked opportunities with ROI estimates in ₹, capital needs, and time-to-break-even.",
    bg: "from-vivid-amber/10 to-transparent",
    iconColor: "text-vivid-amber",
  },
  {
    Icon: Map,
    title: "Strategic Roadmaps",
    desc: "A full business plan with milestones, budget, and a phased launch timeline.",
    bg: "from-vivid-violet/10 to-transparent",
    iconColor: "text-vivid-violet",
  },
  {
    Icon: Swords,
    title: "Competitive Analysis",
    desc: "Live competitor density, gap mapping, and positioning insights for your micro-market.",
    bg: "from-vivid-rose/10 to-transparent",
    iconColor: "text-vivid-rose",
  },
  {
    Icon: ShieldCheck,
    title: "Alpha Vault",
    desc: "Save, archive, and revisit your intelligence nodes. Every scan becomes an asset.",
    bg: "from-accent-emerald-light to-transparent",
    iconColor: "text-accent-emerald",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow text-accent-emerald">◈ CAPABILITIES ◈</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary">
            Everything You Need to Decide
          </h2>
          <p className="mt-4 font-body text-base sm:text-lg text-text-secondary">
            Six core engines working in concert to give you decision-grade clarity.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -6 }}
              className="group p-7 rounded-2xl bg-background border border-border transition-all duration-200 hover:border-accent-emerald/25 hover:shadow-card-hover"
            >
              <div
                className={`w-13 h-13 w-[52px] h-[52px] rounded-xl bg-gradient-to-br ${f.bg} flex items-center justify-center`}
              >
                <f.Icon className={`w-6 h-6 ${f.iconColor}`} strokeWidth={2} />
              </div>
              <h3 className="mt-5 font-display font-semibold text-[17px] text-text-primary">
                {f.title}
              </h3>
              <p className="mt-2 font-body text-sm text-text-secondary leading-[1.65]">
                {f.desc}
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-accent-emerald text-[13px] font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
