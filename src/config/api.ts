const API_BASE =
  (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
  "https://starterscope-api.onrender.com";

export const API_BASE_URL = API_BASE;

export const endpoints = {
  recommendations: `${API_BASE}/api/recommendations`,
  businessSearch: `${API_BASE}/api/businesses/search`,
  businessScrape: `${API_BASE}/api/businesses/scrape`,
  businessPlan: `${API_BASE}/api/business-plan`,
  userProfile: `${API_BASE}/api/users/profile`,
  savedBusinesses: `${API_BASE}/api/saved-businesses`,
  contact: `${API_BASE}/api/contact`,
};
