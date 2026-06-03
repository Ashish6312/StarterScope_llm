import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Download,
  ChevronRight,
  Lightbulb,
  Sliders,
  Globe,
  RefreshCw,
  BarChart3,
  Eye,
  BookOpen,
  LayoutGrid,
  FolderHeart,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SsButton } from "@/components/ss/SsButton";
import { SsInput } from "@/components/ss/SsInput";
import { SsBadge } from "@/components/ss/SsBadge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingScreen } from "@/components/LoadingScreen";
import { EnhancedRecommendationCard } from "@/components/EnhancedRecommendationCard";
import { fetchRecommendations } from "@/utils/realBusinessAPI";
import type { Recommendation } from "@/utils/realBusinessAPI";
import { useSearch } from "@/context/SearchContext";
import { toast } from "sonner";
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete";
import { useLanguage } from "@/context/LanguageContext";
import { translations, useTranslation, translateTime, translateCategory } from "@/utils/translations";
import { DashboardCharts } from "@/components/DashboardCharts";
import { CompareModal } from "@/components/CompareModal";
import { OnboardingHints } from "@/components/OnboardingHints";
import { SavedAnalytics } from "@/components/SavedAnalytics";
import { API_BASE_URL } from "@/config/api";

const recentScans = [
  { name: "Bhopal, MP", time: "Just now" },
  { name: "Indore, MP", time: "2 hours ago" },
  { name: "Pune, MH", time: "Yesterday" }
];

export default function DashboardPage() {
  const { scan, setScan } = useSearch();
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation(lang);

  const [location, setLocation] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  
  // Input elements refs for Places autocomplete
  const [sidebarInput, setSidebarInput] = useState<HTMLInputElement | null>(null);
  const [mobileInput, setMobileInput] = useState<HTMLInputElement | null>(null);

  // Active tab state: "opportunities" | "analytics" | "vault"
  const [activeTab, setActiveTab] = useState<"opportunities" | "analytics" | "vault">("opportunities");

  // Filter States
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [roiFilter, setRoiFilter] = useState<number>(0);
  const [riskFilters, setRiskFilters] = useState<string[]>([]);
  const [seasonalFilter, setSeasonalFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Comparison selection States
  const [selectedForCompare, setSelectedForCompare] = useState<Recommendation[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Alpha Vault (Saved Ideas) synced with localStorage
  const [savedVault, setSavedVault] = useState<Recommendation[]>(() => {
    try {
      const raw = localStorage.getItem("ss.saved.vault");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const onPlaceSelected = useCallback((label: string) => {
    setLocation(label);
  }, []);

  useGooglePlacesAutocomplete({ input: sidebarInput, onPlaceSelected });
  useGooglePlacesAutocomplete({ input: mobileInput, onPlaceSelected });

  // Handle Location Scan via REST + parallel WebSocket updates
  const runScan = async () => {
    if (!location.trim()) {
      toast.error(lang === "hi" ? "कृपया एक स्थान दर्ज करें" : "Please enter a location");
      return;
    }
    setLoading(false); // Make sure it's reset
    setLoading(true);
    setScan(null);
    setProgressMessage("Starting our expert market scan...");

    // Parallel connection to live WebSocket server progress manager
    let socket: WebSocket | null = null;
    try {
      let wsUrl = "ws://localhost:8000/ws/analysis";
      if (API_BASE_URL.startsWith("http")) {
        wsUrl = API_BASE_URL.replace(/^http/, "ws") + "/ws/analysis";
      }
      
      socket = new WebSocket(wsUrl);
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type === "analysis_progress" && data.message) {
            setProgressMessage(data.message);
          }
        } catch {
          // ignore JSON parse error
        }
      };
    } catch (e) {
      console.warn("Could not initiate telemetry WebSocket connection:", e);
    }

    try {
      const result = await fetchRecommendations(location.trim(), businessType.trim());
      setScan(result);
      // Reset active tab to opportunities on new scan
      setActiveTab("opportunities");
      toast.success(
        lang === "hi"
          ? `${result.recommendations.length} नए अवसर मिले हैं!`
          : `Found ${result.recommendations.length} strategic opportunities`
      );
    } catch {
      toast.error(lang === "hi" ? "स्कैन विफल रहा - कृपया पुन: प्रयास करें" : "Scan failed — please retry");
    } finally {
      setLoading(false);
      setProgressMessage("");
      if (socket) {
        try {
          socket.close();
        } catch {
          // ignore socket close errors
        }
      }
    }
  };

  // Helper to parse investment Lakhs for filter matching, e.g. "₹8-12L" -> average 10
  const parseInvestment = (invStr: string): number => {
    const cleanStr = invStr.replace(/[^0-9.-]/g, "");
    if (cleanStr.includes("-")) {
      const parts = cleanStr.split("-").map(parseFloat);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return (parts[0] + parts[1]) / 2;
      }
    }
    const val = parseFloat(cleanStr);
    return isNaN(val) ? 0 : val;
  };

  // Helper to parse ROI percentage for filter matching, e.g. "35%" -> 35
  const parseRoi = (roiStr: string): number => {
    const cleanStr = roiStr.replace(/[^0-9.]/g, "");
    const val = parseFloat(cleanStr);
    return isNaN(val) ? 0 : val;
  };

  // Get dynamic unique categories present in the active scan recommendations
  const activeCategories = scan
    ? ["all", ...new Set(scan.recommendations.map((r) => r.category))]
    : ["all"];

  // Core filter computation
  const filteredRecommendations = scan
    ? scan.recommendations.filter((r) => {
        // 1. Budget Filter
        const capex = parseInvestment(r.investment); // in Lakhs
        if (budgetFilter !== "all") {
          if (budgetFilter === "10k" && capex > 0.1) return false;
          if (budgetFilter === "50k" && capex > 0.5) return false;
          if (budgetFilter === "1l" && capex > 1) return false;
          if (budgetFilter === "10l" && capex > 10) return false;
        }

        // 2. ROI Filter
        const roiVal = parseRoi(r.roi);
        if (roiVal < roiFilter) return false;

        // 3. Risk Filter
        if (riskFilters.length > 0 && !riskFilters.includes(r.risk)) return false;

        // 4. Seasonal Filter
        if (seasonalFilter !== "all") {
          const isSeasonal = !!r.is_seasonal;
          if (seasonalFilter === "seasonal" && !isSeasonal) return false;
          if (seasonalFilter === "evergreen" && isSeasonal) return false;
        }

        // 5. Category Filter
        if (categoryFilter !== "all" && r.category !== categoryFilter) return false;

        return true;
      })
    : [];

  // Toggle Save to Vault
  const handleSaveToVault = (rec: Recommendation) => {
    const isSaved = savedVault.some((r) => r.id === rec.id);
    let updated: Recommendation[];
    if (isSaved) {
      updated = savedVault.filter((r) => r.id !== rec.id);
      toast.info(lang === "hi" ? "अल्फा वॉल्ट से हटाया गया" : "Removed from Alpha Vault");
    } else {
      updated = [...savedVault, rec];
      toast.success(lang === "hi" ? "अल्फा वॉल्ट में सहेजा गया" : "Saved to Alpha Vault");
    }
    setSavedVault(updated);
    localStorage.setItem("ss.saved.vault", JSON.stringify(updated));
  };

  // Toggle Compare Selection
  const handleToggleCompare = (rec: Recommendation) => {
    setSelectedForCompare((prev) => {
      const isSelected = prev.some((r) => r.id === rec.id);
      if (isSelected) {
        return prev.filter((r) => r.id !== rec.id);
      } else {
        if (prev.length >= 3) {
          toast.warning(
            lang === "hi"
              ? "आप एक बार में अधिकतम 3 व्यवसायों की तुलना कर सकते हैं।"
              : "You can compare a maximum of 3 businesses side-by-side."
          );
          return prev;
        }
        return [...prev, rec];
      }
    });
  };

  // Print PDF Trigger
  const handleExportPDF = () => {
    window.print();
  };



  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">
      {/* Screen Only View */}
      <div className="flex-1 flex flex-col no-print">
        <Navbar />

        {/* Dashboard Sub-Header */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-[9px] text-text-muted uppercase tracking-widest">
                <span>{t("home")}</span>
                <ChevronRight className="w-2.5 h-2.5" />
                <span className="text-text-primary font-semibold">{t("dashboard")}</span>
              </div>
              <h1 className="mt-1.5 font-display font-bold text-2xl sm:text-3xl text-text-primary tracking-tight">
                {t("dashboardTitle")}
              </h1>
              <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
                {t("dashboardSubtitle")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-x-hidden">
          {/* SIDEBAR FOR NEW SCANS */}
          <aside className="hidden lg:flex flex-col w-[320px] bg-surface border-r border-border sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-6 border-b border-border bg-gradient-to-b from-background/40 to-transparent">
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3 font-black">
                ⚡ {t("newScan")}
              </p>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-secondary font-bold uppercase tracking-wider block ml-1">
                    📍 {lang === "hi" ? "लक्षित स्थान" : "Target Location"}
                  </label>
                  <SsInput
                    ref={setSidebarInput}
                    leftIcon={<MapPin className="w-4 h-4 text-accent-emerald" />}
                    placeholder={t("enterCity")}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runScan()}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-secondary font-bold uppercase tracking-wider block ml-1">
                    💡 {lang === "hi" ? "आला अवधारणा (Niche)" : "Niche Concept"}
                  </label>
                  <SsInput
                    leftIcon={<Lightbulb className="w-4 h-4 text-vivid-amber" />}
                    placeholder={t("businessIdea")}
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runScan()}
                  />
                </div>
              </div>
              <SsButton
                variant="primary"
                className="w-full mt-4 h-11 bg-gradient-brand shadow-glow-emerald border-0 font-bold hover:scale-[1.01] active:scale-[0.99] transition-all"
                onClick={runScan}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> {t("scanning")}
                  </span>
                ) : (
                  t("runAnalysis")
                )}
              </SsButton>
            </div>

            {/* Recent Scans list */}
            <div className="p-6">
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3.5 font-black">
                📂 {t("recentScans")}
              </p>
              <ul className="space-y-2">
                {recentScans.map((s, i) => (
                  <li key={s.name}>
                    <button
                      onClick={() => {
                        setLocation(s.name);
                        setBusinessType("");
                        toast.info(lang === "hi" ? `लक्षित स्थान बदला गया: ${s.name}` : `Updated scan target: ${s.name}`);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between hover:bg-elevated/80 transition-colors border-l-2 bg-surface/50 border border-border/40 ${
                        i === 0 ? "border-l-accent-emerald" : "border-l-transparent"
                      }`}
                    >
                      <div>
                        <div className="font-body text-xs font-bold text-text-primary">
                          {s.name}
                        </div>
                        <div className="font-mono text-[10px] text-text-muted mt-0.5">
                          {translateTime(s.time, lang)}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* MAIN BODY AREA */}
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 min-w-0"
          >
            <div className="max-w-[90rem] mx-auto w-full p-4 sm:p-6 lg:p-8">
              {/* Onboarding Assistant */}
              <div>
                <OnboardingHints lang={lang} />
              </div>

              {/* Mobile Scan Form */}
              <div className="lg:hidden glass-card p-5 mb-6 space-y-3.5">
                <SsInput
                  ref={setMobileInput}
                  leftIcon={<MapPin className="w-4 h-4 text-accent-emerald" />}
                  placeholder={t("enterCity")}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runScan()}
                />
                <SsInput
                  leftIcon={<Lightbulb className="w-4 h-4 text-vivid-amber" />}
                  placeholder={t("businessIdea")}
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runScan()}
                />
                <SsButton
                  variant="primary"
                  className="w-full h-11 bg-gradient-brand shadow-glow-emerald border-0 font-bold"
                  onClick={runScan}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> {t("scanning")}
                    </span>
                  ) : (
                    t("runAnalysis")
                  )}
                </SsButton>
              </div>

              {/* Loading screen with live WebSocket telemetry progress message */}
              {loading && <LoadingScreen progressMessage={progressMessage} />}

              {/* Empty State */}
              {!loading && !scan && (
                <div>
                  <EmptyState
                    icon={<Search className="w-12 h-12 text-accent-emerald animate-pulse" />}
                    title={t("emptyStateTitle")}
                    description={t("emptyStateDesc")}
                  />
                </div>
              )}

              {/* Dashboard Content Tabs */}
              {!loading && scan && (
                <div className="space-y-6">
                  
                  {/* Active scan info & global action bar */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4 border-b border-border pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="live-dot" />
                        <h2 className="font-display font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
                          {scan.location} {lang === "hi" ? "आला अंतर रिपोर्ट" : "Niche Gap Report"}
                        </h2>
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-text-muted">
                        📍 {scan.location} {scan.businessType && ` · 💡 ${scan.businessType}`} · {lang === "hi" ? "अभी स्कैन किया गया" : "Scanned just now"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <SsBadge tone="emerald" className="font-mono py-1 px-3 rounded-lg text-xs font-bold border border-accent-emerald/20">
                        {scan.recommendations.length} {t("opportunities")}
                      </SsBadge>
                      <SsButton
                        variant="outline"
                        size="sm"
                        onClick={handleExportPDF}
                        className="h-10 text-xs font-bold border-border shadow-sm hover:border-vivid-blue/30"
                      >
                        <Download className="w-4 h-4 text-vivid-blue" /> {t("export")}
                      </SsButton>
                    </div>
                  </div>

                  {/* Dashboard Tabs Bar */}
                  <div className="flex border-b border-border gap-6 text-sm font-medium mb-6">
                    {[
                      { id: "opportunities" as const, label: t("opportunities"), icon: <LayoutGrid className="w-4 h-4" /> },
                      { id: "analytics" as const, label: t("analytics"), icon: <BarChart3 className="w-4 h-4" /> },
                      { id: "vault" as const, label: t("saved"), icon: <FolderHeart className="w-4 h-4" /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 font-display font-semibold transition-all relative -mb-[2px] ${
                          activeTab === tab.id
                            ? "border-accent-emerald text-accent-emerald font-bold"
                            : "border-transparent text-text-muted hover:text-text-primary"
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                        {tab.id === "vault" && savedVault.length > 0 && (
                          <span className="w-4 h-4 rounded-full bg-accent-emerald text-black font-mono text-[9px] font-bold flex items-center justify-center">
                            {savedVault.length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* TAB 1: OPPORTUNITIES GRID */}
                  {activeTab === "opportunities" && (
                    <div className="space-y-6">
                      {/* Advanced filter Row */}
                      <div className="border border-border bg-surface rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Sliders className="w-3.5 h-3.5 text-vivid-blue" />
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-text-primary">
                            {t("filters")}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                          {/* Category filter */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider block ml-0.5">
                              {t("category")}
                            </label>
                            <select
                              value={categoryFilter}
                              onChange={(e) => setCategoryFilter(e.target.value)}
                              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text-primary font-medium focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald/20 transition-all cursor-pointer"
                            >
                              <option value="all">{t("all")}</option>
                              {activeCategories.filter(c => c !== "all").map((cat) => (
                                <option key={cat} value={cat}>
                                  {translateCategory(cat, lang)}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Budget filter */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider block ml-0.5">
                              {t("budget")}
                            </label>
                            <select
                              value={budgetFilter}
                              onChange={(e) => setBudgetFilter(e.target.value)}
                              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text-primary font-medium focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald/20 transition-all cursor-pointer"
                            >
                              <option value="all">{t("all")}</option>
                              <option value="10k">{lang === "hi" ? "₹10 हज़ार से कम" : "Under ₹10K"}</option>
                              <option value="50k">{lang === "hi" ? "₹50 हज़ार से कम" : "Under ₹50K"}</option>
                              <option value="1l">{lang === "hi" ? "₹1 लाख से कम" : "Under ₹1L"}</option>
                              <option value="10l">{lang === "hi" ? "₹10 लाख से कम" : "Under ₹10L"}</option>
                            </select>
                          </div>

                          {/* ROI filter slider */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider block ml-0.5">
                                {t("roi")}
                              </label>
                              <span className="font-mono text-[10px] font-bold text-accent-emerald">{roiFilter}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={roiFilter}
                              onChange={(e) => setRoiFilter(Number(e.target.value))}
                              className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent-emerald mt-2.5"
                            />
                          </div>

                          {/* Risk filter */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider block ml-0.5 mb-1.5">
                              {t("riskLabel")}
                            </label>
                            <div className="flex gap-1">
                              {["Low", "Medium", "High"].map((r) => {
                                const isChecked = riskFilters.includes(r);
                                return (
                                  <button
                                    key={r}
                                    onClick={() => {
                                      setRiskFilters((prev) =>
                                        isChecked ? prev.filter((x) => x !== r) : [...prev, r]
                                      );
                                    }}
                                    className={`px-2.5 py-1.5 rounded-lg font-mono text-[9px] font-bold border transition-all ${
                                      isChecked
                                        ? "bg-accent-emerald text-white border-accent-emerald shadow-sm"
                                        : "bg-surface border-border text-text-muted hover:text-text-primary hover:border-border"
                                    }`}
                                  >
                                    {r === "Low" ? t("low") : r === "Medium" ? t("medium") : t("high")}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Seasonal filter */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider block ml-0.5">
                              {t("seasonal")}
                            </label>
                            <select
                              value={seasonalFilter}
                              onChange={(e) => setSeasonalFilter(e.target.value)}
                              className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text-primary font-medium focus:outline-none focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald/20 transition-all cursor-pointer"
                            >
                              <option value="all">{t("all")}</option>
                              <option value="seasonal">{t("seasonalOnly")}</option>
                              <option value="evergreen">{t("evergreenOnly")}</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations grid */}
                      {filteredRecommendations.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {filteredRecommendations.map((r, i) => (
                            <div key={r.id}>
                              <EnhancedRecommendationCard
                                rec={r}
                                index={i}
                                lang={lang}
                                isSelectedForCompare={selectedForCompare.some((x) => x.id === r.id)}
                                onToggleCompare={() => handleToggleCompare(r)}
                                onSaveToVault={() => handleSaveToVault(r)}
                                isSaved={savedVault.some((x) => x.id === r.id)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12">
                          <EmptyState
                            icon={<AlertTriangle className="w-10 h-10 text-vivid-amber" />}
                            title={t("noResultsTitle")}
                            description={t("noResultsDesc")}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: REAL-TIME RECHARTS ANALYTICS */}
                  {activeTab === "analytics" && (
                    <div>
                      <DashboardCharts recommendations={scan.recommendations} lang={lang} />
                    </div>
                  )}

                  {/* TAB 3: ALPHA VAULT (SAVED BUSINESSES) */}
                  {activeTab === "vault" && (
                    <div className="space-y-6">
                      <SavedAnalytics savedItems={savedVault} lang={lang} />
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {savedVault.map((r, i) => (
                          <EnhancedRecommendationCard
                            key={r.id}
                            rec={r}
                            index={i}
                            lang={lang}
                            isSelectedForCompare={selectedForCompare.some((x) => x.id === r.id)}
                            onToggleCompare={() => handleToggleCompare(r)}
                            onSaveToVault={() => handleSaveToVault(r)}
                            isSaved={true}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.main>
        </div>

        {/* FLOATING COMPARISON ACTION TRAY */}
        {selectedForCompare.length > 0 && activeTab !== "vault" && !loading && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-surface/95 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-float flex items-center justify-between gap-5 w-[90vw] max-w-lg animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-sm">
                {selectedForCompare.length}
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs text-text-primary">
                  {t("comparisonMode")}
                </h4>
                <p className="text-[10px] text-text-muted mt-0.5">
                  {selectedForCompare.length < 2
                    ? lang === "hi" ? "कम से कम 2 चुनें" : "Select at least 2 to compare"
                    : t("compareUpTo3")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SsButton
                variant="ghost"
                size="xs"
                onClick={() => setSelectedForCompare([])}
                className="text-text-muted hover:text-text-primary text-[10px]"
              >
                {lang === "hi" ? "साफ़ करें" : "Clear"}
              </SsButton>
              <SsButton
                variant="emerald"
                size="xs"
                onClick={() => {
                  if (selectedForCompare.length < 2) {
                    toast.warning(
                      lang === "hi"
                        ? "तुलना के लिए कम से कम 2 व्यवसाय चुनें।"
                        : "Please select at least 2 businesses to compare."
                    );
                    return;
                  }
                  setCompareModalOpen(true);
                }}
                className={`text-[10px] font-black h-8 shadow-sm ${
                  selectedForCompare.length < 2
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105 active:scale-95"
                }`}
              >
                {t("compare")} <ChevronRight className="w-3.5 h-3.5" />
              </SsButton>
            </div>
          </div>
        )}

        {/* Side-by-Side Compare Modal */}
        <CompareModal
          isOpen={compareModalOpen}
          onClose={() => setCompareModalOpen(false)}
          selectedRecs={selectedForCompare}
          lang={lang}
        />

        <Footer />
      </div>

      {/* Dedicated Print Only View with Diagrams and Search Details */}
      <div className="hidden print:block dark w-full p-6 space-y-8 bg-[#0A0A0A] text-[#FAFAFA]">
        <div className="text-center border-b-2 border-[#242427] pb-6 mb-6">
          <h1 className="font-display font-black text-3xl uppercase tracking-wider">{t("pdfHeader")}</h1>
          <p className="font-mono text-xs text-slate-500 mt-2">
            {t("pdfGeneratedAt")}: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 max-w-xl mx-auto italic">{t("pdfDisclaimer")}</p>
          {scan && (
            <div className="mt-4 font-mono text-xs font-bold bg-[#18181B] text-[#FAFAFA] p-2.5 inline-block rounded border border-[#242427]">
              📍 Location: {scan.location} {scan.businessType && ` | Concept: ${scan.businessType}`}
            </div>
          )}
        </div>

        {/* Always Print Diagrams */}
        {scan && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-[#FAFAFA] border-b border-[#242427] pb-2">
              📊 Market Intelligence Diagrams
            </h2>
            <div>
              <DashboardCharts recommendations={scan.recommendations} lang={lang} isPrint={true} />
            </div>
          </div>
        )}

        {/* Always Print Opportunities List */}
        {scan && (
          <div className="space-y-6 !mt-10" style={{ pageBreakBefore: "always" }}>
            <h2 className="font-display font-bold text-xl text-[#FAFAFA] border-b border-[#242427] pb-2">
              💡 Strategic Opportunities
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {scan.recommendations.map((r, i) => (
                <div key={r.id} className="border border-[#242427] rounded-xl p-5 bg-[#18181B] page-break-inside-avoid">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display font-bold text-sm text-[#FAFAFA]">{r.name}</h3>
                    <span className="font-mono text-[10px] font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20 animate-none">
                      Score: {r.score}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] text-[#A1A1AA] mt-1 uppercase tracking-wider">
                    {r.category} | ROI: {r.roi} | Capex: {r.investment}
                  </p>
                  <p className="text-xs text-[#D4D4D8] mt-3 leading-relaxed">{r.description}</p>
                  {r.keySuccessFactors && r.keySuccessFactors.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-display font-bold text-[10px] text-[#FAFAFA] uppercase tracking-wider">Key Success Factors:</h4>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[10px] text-[#A1A1AA]">
                        {r.keySuccessFactors.slice(0, 3).map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
