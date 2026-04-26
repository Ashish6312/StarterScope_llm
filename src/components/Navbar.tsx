import { useEffect, useState } from "react";
import { Link, NavLink as RRNavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Hexagon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SsButton } from "./ss/SsButton";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Features", to: "/#features" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Pricing", to: "/acquisition-tiers" },
  { label: "Dashboard", to: "/dashboard" },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <motion.div whileHover={{ rotate: 30, scale: 1.1 }} transition={{ duration: 0.3 }}>
        <Hexagon className="w-7 h-7 text-accent-emerald fill-accent-emerald/20" strokeWidth={2.5} />
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="flex items-baseline gap-0.5 font-semibold text-lg"
      >
        <span className="font-body text-text-primary">Starter</span>
        <span className="font-display font-extrabold text-accent-emerald">Scope</span>
      </motion.div>
    </Link>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-border"
          : "bg-background/60 border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <RRNavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative font-body text-sm transition-colors duration-200",
                  isActive
                    ? "text-accent-emerald"
                    : "text-text-secondary hover:text-text-primary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent-emerald"
                    />
                  )}
                </>
              )}
            </RRNavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link to="/auth" className="hidden sm:inline-flex">
            <SsButton variant="ghost" size="sm">
              Sign In
            </SsButton>
          </Link>
          <Link to="/dashboard" className="hidden sm:inline-flex">
            <SsButton variant="primary" size="sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </SsButton>
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden w-10 h-10 rounded-full bg-elevated border border-border flex items-center justify-center"
          >
            <Menu className="w-5 h-5 text-text-primary" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-surface border-l border-border z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-border">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-text-primary" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center px-6 h-14 text-text-primary font-body text-base border-l-2 border-transparent hover:border-accent-emerald hover:bg-elevated transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-border space-y-3">
                <Link to="/auth" className="block">
                  <SsButton variant="secondary" className="w-full">
                    Sign In
                  </SsButton>
                </Link>
                <Link to="/dashboard" className="block">
                  <SsButton variant="primary" className="w-full">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </SsButton>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
