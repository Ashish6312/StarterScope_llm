import { endpoints } from "@/config/api";

export interface Recommendation {
  id: string;
  name: string;
  category: string;
  score: number;
  description: string;
  tags: string[];
  investment: string;
  roi: string;
  risk: "Low" | "Medium" | "High";
  lat?: number;
  lng?: number;
}

export interface ScanResult {
  location: string;
  scannedAt: string;
  recommendations: Recommendation[];
}

/**
 * Mock fallback used when the live API is unreachable. Real data
 * comes from the backend at endpoints.recommendations.
 */
const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    name: "Cloud Kitchen / Dark Restaurant",
    category: "Food & Beverage",
    score: 94,
    description:
      "High-demand delivery-first kitchen model with low overhead and rapid scaling potential. Ideal for tier-2 cities with growing food delivery penetration.",
    tags: ["low-capital", "trending", "high-margin"],
    investment: "₹8-12L",
    roi: "14 months",
    risk: "Low",
  },
  {
    id: "2",
    name: "EdTech Coaching Centre",
    category: "Education",
    score: 88,
    description:
      "Hybrid coaching model targeting JEE/NEET aspirants with proven local demand and recurring revenue from monthly subscriptions.",
    tags: ["high-demand", "recurring", "scalable"],
    investment: "₹15-20L",
    roi: "18 months",
    risk: "Medium",
  },
  {
    id: "3",
    name: "EV Charging Hub",
    category: "Clean Energy",
    score: 82,
    description:
      "Government-backed infrastructure play with long-term moat. Strategic location near highway intersection with low existing competition.",
    tags: ["govt-backed", "long-term", "infrastructure"],
    investment: "₹25-35L",
    roi: "30 months",
    risk: "Medium",
  },
  {
    id: "4",
    name: "Boutique Co-Working Space",
    category: "Real Estate",
    score: 76,
    description:
      "Premium flexible workspace targeting freelancers and remote teams. Membership model with predictable monthly revenue.",
    tags: ["recurring", "premium"],
    investment: "₹20-30L",
    roi: "24 months",
    risk: "Medium",
  },
];

function normalizeRisk(val: unknown): Recommendation["risk"] {
  if (val === "Low" || val === "Medium" || val === "High") return val;
  if (typeof val === "string") {
    const v = val.toLowerCase();
    if (v.includes("low")) return "Low";
    if (v.includes("high")) return "High";
  }
  return "Medium";
}

function normalizeRecommendation(raw: unknown, idx: number): Recommendation | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const name =
    (typeof r.name === "string" && r.name) ||
    (typeof r.title === "string" && r.title) ||
    (typeof r.business_name === "string" && r.business_name) ||
    `Opportunity ${idx + 1}`;

  const category =
    (typeof r.category === "string" && r.category) ||
    (typeof r.industry === "string" && r.industry) ||
    "Business";

  const scoreNum =
    typeof r.score === "number"
      ? r.score
      : typeof r.score === "string"
      ? Number(r.score)
      : typeof r.opportunity_score === "number"
      ? r.opportunity_score
      : typeof r.opportunity_score === "string"
      ? Number(r.opportunity_score)
      : 75;

  const score = Number.isFinite(scoreNum) ? Math.max(0, Math.min(100, Math.round(scoreNum))) : 75;

  const description =
    (typeof r.description === "string" && r.description) ||
    (typeof r.summary === "string" && r.summary) ||
    "No description available yet.";

  const tagsRaw = r.tags ?? r.tag_list ?? r.keywords;
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.filter((t): t is string => typeof t === "string").slice(0, 8)
    : typeof tagsRaw === "string"
    ? tagsRaw
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];

  const investment =
    (typeof r.investment === "string" && r.investment) ||
    (typeof r.funding_required === "string" && r.funding_required) ||
    (typeof r.capital_required === "string" && r.capital_required) ||
    "—";

  const roi =
    (typeof r.roi === "string" && r.roi) ||
    (typeof r.payback_period === "string" && r.payback_period) ||
    (typeof r.be_period === "string" && r.be_period) ||
    "—";

  const risk = normalizeRisk(r.risk ?? r.risk_level);

  const id =
    (typeof r.id === "string" && r.id) ||
    (typeof r.id === "number" && String(r.id)) ||
    (typeof r.saved_id === "string" && r.saved_id) ||
    `${idx + 1}-${name}`.toLowerCase().replace(/\s+/g, "-").slice(0, 64);

  const lat = typeof r.lat === "number" ? r.lat : typeof r.latitude === "number" ? (r.latitude as number) : undefined;
  const lng = typeof r.lng === "number" ? r.lng : typeof r.longitude === "number" ? (r.longitude as number) : undefined;

  return { id, name, category, score, description, tags, investment, roi, risk, lat, lng };
}

export async function fetchRecommendations(location: string): Promise<ScanResult> {
  try {
    const res = await fetch(endpoints.recommendations, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Backend expects `area` (not `location`)
      body: JSON.stringify({ area: location }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    // Backend may return slightly different shapes — normalize defensively.
    const rawRecs = Array.isArray(data?.recommendations)
      ? (data.recommendations as unknown[])
      : Array.isArray(data)
      ? (data as unknown[])
      : [];

    const recs = rawRecs.map((r, i) => normalizeRecommendation(r, i)).filter((x): x is Recommendation => !!x);
    return {
      location,
      scannedAt: new Date().toISOString(),
      recommendations: recs.length ? recs : mockRecommendations,
    };
  } catch {
    // Graceful fallback so the UI still demonstrates the flow.
    return {
      location,
      scannedAt: new Date().toISOString(),
      recommendations: mockRecommendations,
    };
  }
}
