"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import {
  authenticateUser,
  getSession,
  setSession,
  clearSession,
  registerUser,
  getUserById,
  getUserByEmail,
} from "@/lib/db";

export type UserRole = "USER" | "ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: UserRole;
  phone: string;
  createdAt: string;
}

interface AuthContextType {
  user: SessionUser | null;
  status: "authenticated" | "unauthenticated" | "loading";
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: SessionUser }>;
  signOut: () => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  refreshUser: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  signIn: async () => ({ ok: false, error: "Not initialized" }),
  signOut: async () => {},
  register: async () => ({ ok: false, error: "Not initialized" }),
  refreshUser: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<"authenticated" | "unauthenticated" | "loading">("loading");

  const refreshUser = useCallback(() => {
    const session = getSession();
    if (session) {
      const fresh = getUserById(session.id);
      if (fresh) {
        const safeUser = { ...fresh };
        delete (safeUser as any).password;
        setUser(safeUser as unknown as SessionUser);
        setSession(safeUser as unknown as SessionUser);
        setStatus("authenticated");
        return;
      }
    }
    setUser(null);
    clearSession();
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = authenticateUser(email, password);
    if (!result) {
      return { ok: false, error: "Invalid email or password" };
    }
    setSession(result as SessionUser);
    setUser(result as SessionUser);
    setStatus("authenticated");
    return { ok: true, user: result as SessionUser };
  }, []);

  const signOut = useCallback(async () => {
    clearSession();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    const existing = getUserByEmail(data.email);
    if (existing) {
      return { ok: false, error: "An account with this email already exists" };
    }
    const newUser = registerUser(data);
    setSession(newUser as SessionUser);
    setUser(newUser as SessionUser);
    setStatus("authenticated");
    return { ok: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        signIn,
        signOut,
        register,
        refreshUser,
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
