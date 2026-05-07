import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSubscription } from "@/context/SubscriptionContext";
import { SsButton } from "@/components/ss/SsButton";
import { SsInput } from "@/components/ss/SsInput";
import { ChevronRight, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { plan, scansUsed, scanLimit } = useSubscription();
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">Profile</span>
          </div>
          <h1 className="mt-2 font-display font-extrabold text-3xl text-text-primary">Your Profile</h1>
        </div>
      </div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6"
      >
        {/* Identity */}
        <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-brand flex items-center justify-center text-white font-display font-bold text-2xl">
              JS
            </div>
            <span className="mt-3 text-[11px] font-mono px-2 py-0.5 rounded-md bg-accent-emerald-light text-accent-emerald border border-accent-emerald/20">
              Active
            </span>
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-text-primary">Jayesh Sharma</h2>
            <p className="mt-1 font-mono text-[13px] text-text-muted">jayesh@starterscope.com</p>
            <p className="mt-2 font-body text-sm text-text-secondary">Joined April 2024</p>
          </div>
        </div>

        {/* Subscription */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1 h-5 bg-accent-emerald rounded-full" />
            <h3 className="font-display font-semibold text-base text-text-primary">Subscription</h3>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 rounded-full bg-accent-emerald-light text-accent-emerald border border-accent-emerald/30">
                {planLabel} Plan
              </span>
              <p className="mt-3 font-body text-sm text-text-secondary">
                {scansUsed} of {scanLimit === Infinity ? "∞" : scanLimit} scans used this month
              </p>
            </div>
            <SsButton variant="outline" size="sm" onClick={() => toast.info("Upgrade flow coming soon")}>
              Upgrade
            </SsButton>
          </div>
        </div>

        {/* Edit form */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-5 bg-accent-emerald rounded-full" />
            <h3 className="font-display font-semibold text-base text-text-primary">Edit Profile</h3>
          </div>
          <div>
            <label className="font-mono text-[11px] uppercase tracking-widest text-text-muted">Display Name</label>
            <SsInput defaultValue="Jayesh Sharma" className="mt-2" />
          </div>
          <div>
            <label className="font-mono text-[11px] uppercase tracking-widest text-text-muted">Email</label>
            <SsInput defaultValue="jayesh@starterscope.com" type="email" className="mt-2" />
          </div>
          <div className="flex justify-end pt-2">
            <SsButton variant="primary" onClick={() => toast.success("Profile saved")}>
              Save Changes
            </SsButton>
          </div>
        </div>

        {/* Saved */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1 h-5 bg-accent-emerald rounded-full" />
            <h3 className="font-display font-semibold text-base text-text-primary">Saved Businesses</h3>
          </div>
          <ul className="divide-y divide-border">
            {["Cloud Kitchen / Bhopal", "EV Charging Hub / Indore", "EdTech Coaching / Pune"].map((b) => (
              <li key={b} className="flex items-center justify-between py-3 px-3 -mx-3 rounded-lg hover:bg-elevated">
                <div className="flex items-center gap-3">
                  <span className="font-body text-sm text-text-primary">{b}</span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-accent-emerald-light text-accent-emerald">
                    94
                  </span>
                </div>
                <button
                  onClick={() => toast.success("Removed from vault")}
                  className="text-text-muted hover:text-vivid-rose transition-colors p-1"
                  aria-label="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
}
