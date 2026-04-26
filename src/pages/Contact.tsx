import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SsButton } from "@/components/ss/SsButton";
import { SsInput } from "@/components/ss/SsInput";
import { toast } from "sonner";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow text-accent-emerald">◈ GET IN TOUCH ◈</span>
          <h1 className="mt-4 font-display font-extrabold text-4xl text-text-primary">
            Let's Build Together
          </h1>
          <p className="mt-3 font-body text-lg text-text-secondary">
            Questions, partnerships, or feedback — we read every message.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { Icon: Mail, label: "Email", v: "team@cravingcode.dev" },
            { Icon: Phone, label: "Phone", v: "+91 98 7654 3210" },
            { Icon: MapPin, label: "HQ", v: "Bhopal, India" },
          ].map((c) => (
            <div key={c.label} className="glass-card p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent-emerald-light flex items-center justify-center">
                <c.Icon className="w-5 h-5 text-accent-emerald" />
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-text-muted">
                {c.label}
              </p>
              <p className="mt-1 font-body text-sm text-text-primary font-medium">{c.v}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              toast.success("Message sent! We'll reply within 24h.");
            }, 800);
          }}
          className="glass-card p-6 sm:p-8 mt-8 space-y-4 max-w-2xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SsInput placeholder="Your name" required />
            <SsInput type="email" placeholder="Email address" required />
          </div>
          <SsInput placeholder="Subject" />
          <textarea
            placeholder="Tell us about your project..."
            rows={5}
            required
            className="w-full rounded-xl border border-border bg-elevated text-text-primary placeholder:text-text-muted text-sm font-body p-4 focus:outline-none focus:border-accent-emerald focus:bg-surface focus:ring-4 focus:ring-accent-emerald/10 transition-colors"
          />
          <div className="flex justify-end">
            <SsButton type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </SsButton>
          </div>
        </form>
      </motion.main>
      <Footer />
    </div>
  );
}
