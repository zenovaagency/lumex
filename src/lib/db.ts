import seedData from "@/data/db.json";
import type { User } from "@/types";

type Role = "USER" | "ADMIN";

interface SeedUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  image: string | null;
  phone: string;
  createdAt: string;
}

interface SeedData {
  users: SeedUser[];
  categories: { id: string; name: string; slug: string; description: string; image: string; productCount: number }[];
  products: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    comparePrice: number | null;
    image: string;
    images: string[];
    rating: number;
    reviewCount: number;
    category: string;
    isNew: boolean;
    isTrending: boolean;
  }[];
  orders: any[];
}

const DB_KEY = "luxe-db";
const SESSION_KEY = "luxe-session";

function getStore(): SeedData {
  if (typeof window === "undefined") {
    return seedData as SeedData;
  }
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    try { return JSON.parse(raw) as SeedData; } catch { /* fall through */ }
  }
  localStorage.setItem(DB_KEY, JSON.stringify(seedData));
  return seedData as SeedData;
}

function saveStore(data: SeedData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }
}

export function getUsers(): SeedUser[] {
  return getStore().users;
}

export function getUserByEmail(email: string): SeedUser | undefined {
  return getStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): SeedUser | undefined {
  return getStore().users.find((u) => u.id === id);
}

export function authenticateUser(email: string, password: string): Omit<SeedUser, "password"> | null {
  const user = getUserByEmail(email);
  if (!user || user.password !== password) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function registerUser(data: { name: string; email: string; password: string }): Omit<SeedUser, "password"> {
  const store = getStore();
  const maxId = store.users.reduce((max, u) => Math.max(max, Number(u.id.split("-")[1] || 0)), 0);
  const newUser: SeedUser = {
    id: `user-${maxId + 1}`,
    email: data.email.toLowerCase(),
    password: data.password,
    name: data.name,
    role: "USER",
    image: null,
    phone: "",
    createdAt: new Date().toISOString(),
  };
  store.users.push(newUser);
  saveStore(store);
  const { password: _, ...safeUser } = newUser;
  return safeUser;
}

export function updateUser(id: string, updates: Partial<SeedUser>): Omit<SeedUser, "password"> | null {
  const store = getStore();
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  store.users[idx] = { ...store.users[idx], ...updates };
  saveStore(store);
  const { password: _, ...safeUser } = store.users[idx];
  return safeUser;
}

export function getSession(): Omit<SeedUser, "password"> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setSession(user: Omit<SeedUser, "password">) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function hasRole(user: Omit<SeedUser, "password"> | null, ...roles: Role[]): boolean {
  if (!user) return false;
  return roles.includes(user.role as Role);
}

export function requireRole(user: Omit<SeedUser, "password"> | null, ...roles: Role[]): boolean {
  return hasRole(user, ...roles);
}

export type { Role, SeedUser, SeedData };
