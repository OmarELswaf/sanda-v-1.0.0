import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, LoginPayload, RegisterPayload } from "@/api/auth";
import type { User, UserRole } from "@/api/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // demo helper while no backend
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("sanda_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading] = useState(false);

  const persist = (u: User | null, token?: string) => {
    setUser(u);
    if (u) localStorage.setItem("sanda_user", JSON.stringify(u));
    else localStorage.removeItem("sanda_user");
    if (token) localStorage.setItem("sanda_token", token);
  };

  const login = async (payload: LoginPayload) => {
    const { user: u, token } = await authApi.login(payload);
    persist(u, token);
    return u;
  };

  const register = async (payload: RegisterPayload) => {
    const { user: u, token } = await authApi.register(payload);
    persist(u, token);
    return u;
  };

  const logout = () => {
    persist(null);
    localStorage.removeItem("sanda_token");
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    persist(updated);
  };

  useEffect(() => {
    // restore from token in real backend
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, switchRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
