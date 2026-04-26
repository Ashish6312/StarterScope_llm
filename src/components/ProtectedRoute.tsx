import { ReactNode } from "react";

/**
 * Auth UI is currently visual-only — this wrapper just renders children.
 * Replace with real session check when auth is wired.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
