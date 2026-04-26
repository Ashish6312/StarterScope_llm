import { createContext, useContext, useState, ReactNode } from "react";
import type { Recommendation, ScanResult } from "@/utils/realBusinessAPI";

interface SearchContextValue {
  scan: ScanResult | null;
  setScan: (s: ScanResult | null) => void;
  selected: Recommendation | null;
  setSelected: (r: Recommendation | null) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [selected, setSelected] = useState<Recommendation | null>(null);
  return (
    <SearchContext.Provider value={{ scan, setScan, selected, setSelected }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside SearchProvider");
  return ctx;
}
