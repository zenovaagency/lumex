import { getSession, getUsers } from "@/lib/db";

export type UserRole = "USER" | "ADMIN";

export function getCurrentUser() {
  return getSession();
}

export async function requireAuth() {
  const user = getSession();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireAdmin() {
  const user = getSession();
  if (!user) {
    throw new Error("Authentication required");
  }
  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return user;
}

export function hasRole(user: { role: string } | null, ...roles: UserRole[]): boolean {
  if (!user) return false;
  return roles.includes(user.role as UserRole);
}
