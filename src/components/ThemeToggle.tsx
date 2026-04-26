import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-elevated" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="w-10 h-10 rounded-full bg-elevated border border-border flex items-center justify-center transition-colors hover:border-accent-emerald/40"
    >
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun className="w-[18px] h-[18px] text-vivid-amber fill-vivid-amber" />
        ) : (
          <Moon className="w-[18px] h-[18px] text-text-secondary" />
        )}
      </motion.div>
    </motion.button>
  );
}
