import { createContext, useContext, useState, ReactNode } from "react";

export type Plan = "free" | "starter" | "professional";

interface SubscriptionContextValue {
  plan: Plan;
  setPlan: (p: Plan) => void;
  scansUsed: number;
  scanLimit: number;
}

const PLAN_LIMITS: Record<Plan, number> = {
  free: 3,
  starter: 30,
  professional: Infinity,
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>("free");
  const [scansUsed] = useState(1);
  return (
    <SubscriptionContext.Provider
      value={{ plan, setPlan, scansUsed, scanLimit: PLAN_LIMITS[plan] }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used inside SubscriptionProvider");
  return ctx;
}
