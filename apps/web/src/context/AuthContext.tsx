import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, clearToken, getStoredUser, setStoredUser, setToken } from "../services/api";

export type User = {
  id: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  businessType?: string;
  preferredCurrency?: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (payload: {
    fullName: string;
    identifier: string;
    password: string;
    businessType: string;
  }) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: String(raw.id),
    fullName: String(raw.fullName || raw.full_name || "Kolo User"),
    email: (raw.email as string) ?? null,
    phone: (raw.phone as string) ?? null,
    businessType: String(raw.businessType || raw.business_type || ""),
    preferredCurrency: String(raw.preferredCurrency || raw.preferred_currency || "NGN")
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored && localStorage.getItem("kolo_token")) {
      setUser(stored);
    }
    setLoading(false);
  }, []);

  const register = async (payload: {
    fullName: string;
    identifier: string;
    password: string;
    businessType: string;
  }) => {
    const hasEmail = payload.identifier.includes("@");
    const body = {
      fullName: payload.fullName.trim(),
      email: hasEmail ? payload.identifier.trim() : null,
      phone: hasEmail ? null : payload.identifier.trim(),
      password: payload.password,
      businessType: payload.businessType,
      preferredCurrency: "NGN"
    };

    const result = await api.register(body);
    setToken(result.token);
    const nextUser = normalizeUser(result.user);
    setStoredUser(nextUser);
    setUser(nextUser);
  };

  const login = async (identifier: string, password: string) => {
    const result = await api.login({ identifier: identifier.trim(), password });
    setToken(result.token);
    const nextUser = normalizeUser(result.user);
    setStoredUser(nextUser);
    setUser(nextUser);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user && localStorage.getItem("kolo_token")),
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
