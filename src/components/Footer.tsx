import { Link } from "react-router-dom";
import { Hexagon, Github, Linkedin, Twitter } from "lucide-react";

const productLinks = [
  { label: "Features", to: "/#features" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Pricing", to: "/acquisition-tiers" },
  { label: "Roadmap", to: "/roadmap" },
];

const companyLinks = [
  { label: "About", to: "/#about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy", to: "/contact" },
  { label: "Terms", to: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border relative">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-emerald via-transparent to-vivid-blue" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center gap-2">
              <Hexagon className="w-7 h-7 text-accent-emerald fill-accent-emerald/20" strokeWidth={2.5} />
              <div className="flex items-baseline gap-0.5 font-semibold text-lg">
                <span className="font-body text-text-primary">Starter</span>
                <span className="font-display font-extrabold text-accent-emerald">Scope</span>
              </div>
            </Link>
            <p className="font-body text-[15px] text-text-secondary mt-4 max-w-xs leading-relaxed">
              Neural intelligence for the next generation of Indian entrepreneurs.
            </p>
            <div className="mt-6 space-y-1">
              <p className="font-mono text-xs text-text-muted">Built with ♥ by Team JAVA</p>
              <p className="font-mono text-xs text-text-muted">
                Cravingcode Technologies Pvt. Ltd.
              </p>
            </div>
          </div>

          {/* Product */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-sm text-text-primary mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="font-body text-sm text-text-secondary hover:text-text-primary hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-sm text-text-primary mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="font-body text-sm text-text-secondary hover:text-text-primary hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-3">
            <h4 className="font-display font-semibold text-sm text-text-primary mb-4">Connect</h4>
            <div className="flex gap-3">
              {[
                { Icon: Github, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Twitter, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-full bg-elevated border border-border flex items-center justify-center text-text-secondary transition-all hover:bg-accent-emerald-light hover:text-accent-emerald hover:border-accent-emerald/30"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 mt-12 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-xs text-text-muted">
            © 2025 Cravingcode Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="font-body text-xs text-text-muted">
            Privacy Policy · Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}
