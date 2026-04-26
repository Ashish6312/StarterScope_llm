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

export async function fetchRecommendations(location: string): Promise<ScanResult> {
  try {
    const res = await fetch(endpoints.recommendations, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    // Backend may return slightly different shapes — normalize defensively.
    const recs: Recommendation[] = Array.isArray(data?.recommendations)
      ? data.recommendations
      : Array.isArray(data)
      ? data
      : mockRecommendations;
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
