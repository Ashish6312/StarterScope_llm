import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Download, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SsButton } from "@/components/ss/SsButton";
import { SsInput } from "@/components/ss/SsInput";
import { SsBadge } from "@/components/ss/SsBadge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingScreen } from "@/components/LoadingScreen";
import { EnhancedRecommendationCard } from "@/components/EnhancedRecommendationCard";
import { fetchRecommendations } from "@/utils/realBusinessAPI";
import { useSearch } from "@/context/SearchContext";
import { toast } from "sonner";
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete";

const recentScans = [
  { name: "Bhopal, MP", time: "Just now" },
  { name: "Indore, MP", time: "2 hours ago" },
  { name: "Pune, MH", time: "Yesterday" },
];

export default function DashboardPage() {
  const { scan, setScan } = useSearch();
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarInput, setSidebarInput] = useState<HTMLInputElement | null>(null);
  const [mobileInput, setMobileInput] = useState<HTMLInputElement | null>(null);

  const onPlaceSelected = useCallback((label: string) => {
    setLocation(label);
  }, []);

  useGooglePlacesAutocomplete({ input: sidebarInput, onPlaceSelected });
  useGooglePlacesAutocomplete({ input: mobileInput, onPlaceSelected });

  const runScan = async () => {
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }
    setLoading(true);
    setScan(null);
    try {
      const result = await fetchRecommendations(location.trim());
      setScan(result);
      toast.success(`Found ${result.recommendations.length} opportunities`);
    } catch {
      toast.error("Scan failed — please retry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Page header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">Dashboard</span>
          </div>
          <h1 className="mt-2 font-display font-extrabold text-2xl sm:text-3xl text-text-primary">
            Strategic Intelligence Dashboard
          </h1>
        </div>
      </div>

      <div className="flex-1 flex overflow-x-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-[300px] bg-surface border-r border-border sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="p-6 border-b border-border">
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-3">
              New Scan
            </p>
            <SsInput
              ref={setSidebarInput}
              leftIcon={<MapPin className="w-4 h-4" />}
              placeholder="Enter city or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runScan()}
            />
            <SsButton
              variant="primary"
              className="w-full mt-3"
              onClick={runScan}
              disabled={loading}
            >
              {loading ? "Scanning..." : "Run Analysis"}
            </SsButton>
          </div>
          <div className="p-6">
            <p className="font-mono text-[11px] text-text-muted uppercase tracking-widest mb-3">
              Recent Scans
            </p>
            <ul className="space-y-1">
              {recentScans.map((s, i) => (
                <li key={s.name}>
                  <button
                    onClick={() => setLocation(s.name)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between hover:bg-elevated transition-colors border-l-2 ${
                      i === 0 ? "border-accent-emerald" : "border-transparent"
                    }`}
                  >
                    <div>
                      <div className="font-body text-sm text-text-primary">
                        {s.name}
                      </div>
                      <div className="font-mono text-[11px] text-text-muted">
                        {s.time}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 min-w-0"
        >
          <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
            {/* Mobile scan form */}
            <div className="lg:hidden glass-card p-4 mb-6 space-y-3">
              <SsInput
                ref={setMobileInput}
                leftIcon={<MapPin className="w-4 h-4" />}
                placeholder="Enter city or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runScan()}
              />
              <SsButton
                variant="primary"
                className="w-full"
                onClick={runScan}
                disabled={loading}
              >
                {loading ? "Scanning..." : "Run Analysis"}
              </SsButton>
            </div>

            {loading && <LoadingScreen />}

            {!loading && !scan && (
              <EmptyState
                icon={<Search className="w-10 h-10 text-accent-emerald" />}
                title="Ready to Find Your Opportunity?"
                description="Start by entering a location to activate the intelligence engine."
              />
            )}

            {!loading && scan && (
              <div>
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-text-primary">
                      Intelligence Report
                    </h2>
                    <p className="mt-1 font-mono text-xs text-text-muted">
                      📍 {scan.location} · Scanned just now
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SsBadge tone="emerald">
                      {scan.recommendations.length} opportunities
                    </SsBadge>
                    <SsButton
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info("PDF export coming soon")}
                    >
                      <Download className="w-4 h-4" /> Export
                    </SsButton>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {scan.recommendations.map((r, i) => (
                    <EnhancedRecommendationCard key={r.id} rec={r} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.main>
      </div>

      <Footer />
    </div>
  );
}
