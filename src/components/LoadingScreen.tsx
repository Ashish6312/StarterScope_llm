import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

const stages = [
  { label: "Initializing scouting swarm...", color: "text-accent-emerald" },
  { label: "Gathering market signals...", color: "text-vivid-blue" },
  { label: "Running neural synthesis...", color: "text-vivid-amber" },
  { label: "Verifying with OSM database...", color: "text-accent-emerald" },
  { label: "Generating strategic roadmap...", color: "text-vivid-blue" },
];

export function LoadingScreen() {
  return (
    <div className="space-y-8">
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-elevated">
        <div className="absolute inset-y-0 w-1/3 bg-gradient-brand animate-scan-line" />
      </div>

      <div className="space-y-3">
        <p className="font-mono text-[13px] text-accent-emerald uppercase tracking-widest">
          Activating intelligence engine...
        </p>
        <ul className="space-y-2">
          {stages.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.4, duration: 0.3 }}
              className="flex items-center gap-3 font-mono text-[13px]"
            >
              <span className={`${s.color}`}>◉</span>
              <span className="text-text-secondary">{s.label}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-14 w-14 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
