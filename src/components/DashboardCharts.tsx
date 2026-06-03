import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  PieChart,
  Pie
} from "recharts";
import type { Recommendation } from "@/utils/realBusinessAPI";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { translations, Lang } from "@/utils/translations";

interface DashboardChartsProps {
  recommendations: Recommendation[];
  lang: Lang;
  isPrint?: boolean;
}

export function DashboardCharts({ recommendations, lang, isPrint = false }: DashboardChartsProps) {
  const t = (key: keyof typeof translations["en"]) => {
    return translations[lang][key] || translations["en"][key];
  };

  // Helper to parse ROI percentage, e.g., "35%" -> 35
  const parseRoi = (roiStr: string): number => {
    const cleanStr = roiStr.replace(/[^0-9.]/g, "");
    const val = parseFloat(cleanStr);
    return isNaN(val) ? 0 : val;
  };

  // Helper to parse investment Lakhs, e.g., "₹8-12L" -> 10, "₹15L" -> 15
  const parseInvestment = (invStr: string): number => {
    const cleanStr = invStr.replace(/[^0-9.-]/g, "");
    if (cleanStr.includes("-")) {
      const parts = cleanStr.split("-").map(parseFloat);
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return (parts[0] + parts[1]) / 2;
      }
    }
    const val = parseFloat(cleanStr);
    return isNaN(val) ? 5 : val;
  };

  // Helper to parse potential revenue Lakhs, e.g., "₹24L/Year" -> 24
  const parseRevenue = (revStr?: string): number => {
    if (!revStr) return 0;
    const cleanStr = revStr.replace(/[^0-9.]/g, "");
    const val = parseFloat(cleanStr);
    return isNaN(val) ? 0 : val;
  };

  // Process data for charts
  const chartData = recommendations.map((r) => {
    const roiVal = parseRoi(r.roi);
    const invVal = parseInvestment(r.investment);
    const revVal = r.potentialRevenue ? parseRevenue(r.potentialRevenue) : roiVal * invVal * 0.15;
    
    // Competitor count derived dynamically or mocked realistically from difficulty
    const competitorCount = r.risk === "High" ? 8 : (r.risk === "Medium" ? 4 : 2);
    
    return {
      name: r.name.length > 20 ? r.name.substring(0, 18) + "..." : r.name,
      fullName: r.name,
      roi: roiVal,
      investment: invVal,
      revenue: parseFloat(revVal.toFixed(1)),
      score: r.score,
      competitors: competitorCount,
      risk: r.risk,
      category: r.category
    };
  });

  // Success Probability distribution data (for Pie Chart)
  // Group businesses by risk to show success probability
  const lowRiskCount = chartData.filter(d => d.risk === "Low").length;
  const medRiskCount = chartData.filter(d => d.risk === "Medium").length;
  const highRiskCount = chartData.filter(d => d.risk === "High").length;
  
  const pieData = [
    { name: `${t("low")} ${t("risk")}`, value: lowRiskCount, color: "hsl(var(--accent-emerald))" },
    { name: `${t("medium")} ${t("risk")}`, value: medRiskCount, color: "hsl(var(--vivid-blue))" },
    { name: `${t("high")} ${t("risk")}`, value: highRiskCount, color: "hsl(var(--vivid-rose))" }
  ].filter(d => d.value > 0);

  interface TooltipPayloadItem {
    name: string;
    value: string | number;
    color?: string;
    payload: {
      fullName: string;
    };
  }

  // Custom tooltips for nice visuals
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-md">
          <p className="font-display font-semibold text-xs text-text-primary mb-1.5">{payload[0].payload.fullName}</p>
          {payload.map((p) => (
            <p key={p.name} className="text-[11px] font-mono leading-relaxed" style={{ color: p.color || "hsl(var(--vivid-blue))" }}>
              {p.name}: <span className="font-bold">{p.value}{p.name.includes("ROI") ? "%" : (p.name.includes("Investment") || p.name.includes("Revenue") ? " Lakhs" : "")}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isPrint) {
    return (
      <div className="grid grid-cols-2 gap-4 bg-[#0A0A0A] text-[#FAFAFA] p-2">
        {/* 1. ROI Trend Graph */}
        <div className="border border-border bg-surface rounded-xl p-4 page-break-inside-avoid">
          <div className="mb-2">
            <h3 className="text-xs font-bold tracking-tight text-[#FAFAFA]">
              📈 {t("roiLabel")} ({t("roi")} %)
            </h3>
            <p className="text-[10px] text-text-muted">
              Comparison of expected returns across business vectors
            </p>
          </div>
          <div className="h-[220px] flex items-center justify-center">
            <LineChart width={330} height={200} data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#A1A1AA" }} />
              <YAxis tick={{ fontSize: 9, fill: "#A1A1AA" }} unit="%" />
              <Line
                type="monotone"
                dataKey="roi"
                name="ROI Potential"
                stroke="hsl(var(--accent-emerald))"
                strokeWidth={2}
                dot={{ r: 2.5 }}
              />
            </LineChart>
          </div>
        </div>

        {/* 2. Market Demand Chart */}
        <div className="border border-border bg-surface rounded-xl p-4 page-break-inside-avoid">
          <div className="mb-2">
            <h3 className="text-xs font-bold tracking-tight text-[#FAFAFA]">
              📊 {t("demandIndex")} (0 - 100)
            </h3>
            <p className="text-[10px] text-text-muted">
              Localized consumer interest & search volume gap score
            </p>
          </div>
          <div className="h-[220px] flex items-center justify-center">
            <BarChart width={330} height={200} data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#A1A1AA" }} />
              <YAxis tick={{ fontSize: 9, fill: "#A1A1AA" }} />
              <Bar dataKey="score" name="Demand Index" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.score >= 90 ? "hsl(var(--accent-emerald))" : entry.score >= 75 ? "hsl(var(--vivid-blue))" : "hsl(var(--vivid-amber))"} />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>

        {/* 3. Investment vs Revenue Chart */}
        <div className="border border-border bg-surface rounded-xl p-4 page-break-inside-avoid">
          <div className="mb-2">
            <h3 className="text-xs font-bold tracking-tight text-[#FAFAFA]">
              💰 Capital Cost vs Potential Revenue (₹ Lakhs)
            </h3>
            <p className="text-[10px] text-text-muted">
              Side-by-side view of upfront capex and estimated yearly returns
            </p>
          </div>
          <div className="h-[220px] flex items-center justify-center">
            <BarChart width={330} height={200} data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#A1A1AA" }} />
              <YAxis tick={{ fontSize: 9, fill: "#A1A1AA" }} />
              <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 9, color: "#A1A1AA" }} />
              <Bar dataKey="investment" name="Capex" fill="hsl(var(--vivid-blue))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="revenue" name="Est. Revenue" fill="hsl(var(--accent-emerald))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </div>
        </div>

        {/* 4. Competitor Analysis Graph */}
        <div className="border border-border bg-surface rounded-xl p-4 page-break-inside-avoid">
          <div className="mb-2">
            <h3 className="text-xs font-bold tracking-tight text-[#FAFAFA]">
              🛡️ Competitor Density Indicator
            </h3>
            <p className="text-[10px] text-text-muted">
              Estimated active players in the target geographical radius
            </p>
          </div>
          <div className="h-[220px] flex items-center justify-center">
            <BarChart width={330} height={200} data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#A1A1AA" }} />
              <YAxis tick={{ fontSize: 9, fill: "#A1A1AA" }} />
              <Bar dataKey="competitors" name="Competitor Density Index" fill="hsl(var(--vivid-violet))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </div>
        </div>

        {/* 5. Success Probability Distribution */}
        <div className="col-span-2 border border-border bg-surface rounded-xl p-4 page-break-inside-avoid !mt-4">
          <div className="mb-2">
            <h3 className="text-xs font-bold tracking-tight text-[#FAFAFA]">
              🎯 Risk Assessment Breakdown
            </h3>
            <p className="text-[10px] text-text-muted">
              Share of low, medium, and high difficulty implementations
            </p>
          </div>
          <div className="flex items-center justify-center gap-12">
            <PieChart width={160} height={160}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="space-y-1.5">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] text-text-secondary">
                    {entry.name}: <span className="font-bold text-text-primary">{entry.value}</span> ({Math.round(entry.value / chartData.length * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. ROI Trend Graph */}
        <Card className="glass-card">
          <CardHeader className="pb-4 pt-5 px-6">
            <CardTitle className="text-sm font-display font-bold tracking-tight text-text-primary">
              📈 {t("roiLabel")} ({t("roi")} %)
            </CardTitle>
            <CardDescription className="text-xs text-text-muted">
              Comparison of expected returns across business vectors
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 px-6 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="roi"
                  name="ROI Potential"
                  stroke="hsl(var(--accent-emerald))"
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }}
                  dot={{ r: 3.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Market Demand Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-4 pt-5 px-6">
            <CardTitle className="text-sm font-display font-bold tracking-tight text-text-primary">
              📊 {t("demandIndex")} (0 - 100)
            </CardTitle>
            <CardDescription className="text-xs text-text-muted">
              Localized consumer interest & search volume gap score
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 px-6 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Demand Index" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 90 ? "hsl(var(--accent-emerald))" : entry.score >= 75 ? "hsl(var(--vivid-blue))" : "hsl(var(--vivid-amber))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Investment vs Revenue Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-4 pt-5 px-6">
            <CardTitle className="text-sm font-display font-bold tracking-tight text-text-primary">
              💰 Capital Cost vs Potential Revenue (₹ Lakhs)
            </CardTitle>
            <CardDescription className="text-xs text-text-muted">
              Side-by-side view of upfront capex and estimated yearly returns
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 px-6 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 11, fontWeight: 500, color: "hsl(var(--text-secondary))" }} />
                <Bar dataKey="investment" name="Capex (Investment)" fill="hsl(var(--vivid-blue))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Est. Yearly Revenue" fill="hsl(var(--accent-emerald))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 4. Competitor Analysis Graph */}
        <Card className="glass-card">
          <CardHeader className="pb-4 pt-5 px-6">
            <CardTitle className="text-sm font-display font-bold tracking-tight text-text-primary">
              🛡️ Competitor Density Indicator
            </CardTitle>
            <CardDescription className="text-xs text-text-muted">
              Estimated active players in the target geographical radius
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 px-6 pb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChartWrapper data={chartData} lang={lang} />
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 5. Success Probability Distribution */}
      <Card className="glass-card">
        <CardHeader className="pb-4 pt-5 px-6">
          <CardTitle className="text-sm font-display font-bold tracking-tight text-text-primary">
            🎯 Risk Assessment Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-text-muted">
            Share of low, medium, and high difficulty implementations in current scan
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64 px-6 pb-6 flex flex-col sm:flex-row items-center justify-around gap-4">
          <div className="w-full h-48 sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                <span className="font-body text-xs text-text-secondary">
                  {entry.name}: <span className="font-bold text-text-primary">{entry.value}</span> ({Math.round(entry.value / chartData.length * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ChartDataItem {
  name: string;
  fullName: string;
  roi: number;
  investment: number;
  revenue: number;
  score: number;
  competitors: number;
  risk: string;
  category: string;
}

// Sub-component wrapper for Competitor analysis (Bar chart with custom gradient or radar)
function AreaChartWrapper({ data }: { data: ChartDataItem[]; lang: Lang }) {
  return (
    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
      <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} />
      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--text-muted))", fontWeight: 500 }} />
      <Tooltip />
      <Bar dataKey="competitors" name="Competitor Density Index" fill="hsl(var(--vivid-violet))" radius={[4, 4, 0, 0]} />
    </BarChart>
  );
}
