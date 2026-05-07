const envApiBase = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL;

// In local development, default to the local FastAPI server.
// In production, default to the hosted API unless overridden by VITE_API_URL.
const API_BASE =
  envApiBase || (import.meta.env.DEV ? "http://localhost:8000" : "https://starterscope-api.onrender.com");

export const API_BASE_URL = API_BASE;

export const endpoints = {
  recommendations: `${API_BASE}/api/recommendations`,
  businessSearch: `${API_BASE}/api/businesses/search`,
  businessScrape: `${API_BASE}/api/businesses/scrape`,
  businessPlan: `${API_BASE}/api/business-plan`,
  // Note: backend uses `/api/users/{email}/profile`; callers should append `/${email}/profile`.
  userProfile: `${API_BASE}/api/users`,
  savedBusinesses: `${API_BASE}/api/saved-businesses`,
  contact: `${API_BASE}/api/contact`,
};
