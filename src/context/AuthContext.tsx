import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { API_BASE_URL } from "@/config/api";

export type AuthUser = {
  id: number | string;
  email: string;
  name?: string | null;
  image_url?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (params: { email: string; password: string }) => Promise<AuthUser>;
  signUp: (params: { name: string; email: string; password: string }) => Promise<AuthUser>;
  googleSignIn: (payload: any) => Promise<AuthUser>;
  signOut: () => void;
};

const STORAGE_KEY = "ss.auth.user";
const AuthContext = createContext<AuthContextValue | null>(null);

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      detail = (data?.detail as string) || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }
  return (await res.json()) as T;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: !!user,
      async signIn({ email, password }) {
        const u = await postJson<AuthUser>(`${API_BASE_URL}/api/auth/signin`, { email, password });
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        return u;
      },
      async signUp({ name, email, password }) {
        const u = await postJson<AuthUser>(`${API_BASE_URL}/api/auth/signup`, { name, email, password });
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        return u;
      },
      async googleSignIn(token) {
        // Decode JWT token from Google (if we were using CredentialResponse)
        // But since we fetch from Google API, token might just be the user object.
        // Let's accept a user payload directly.
        const payload = token;
        
        const u = await postJson<AuthUser>(`${API_BASE_URL}/api/auth/sync`, { 
          email: payload.email,
          name: payload.name,
          image_url: payload.picture || payload.image_url
        });
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        return u;
      },
      signOut() {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

