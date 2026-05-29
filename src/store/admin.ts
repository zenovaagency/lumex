import { create } from "zustand";
import { categories as mockCategories, featuredProducts as mockProducts } from "@/lib/mock-data";
import type { CartItem } from "@/types";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  items: { name: string; qty: number; price: number }[];
  date: Date;
}

interface AdminProduct {
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
}

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

interface AdminCoupon {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder: number | null;
  uses: number;
  maxUses: number | null;
  active: boolean;
}

interface AdminPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
}

interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
  status: "Active" | "Inactive";
}

interface AdminSettings {
  storeName: string;
  supportEmail: string;
  currency: string;
  maintenanceMode: boolean;
  guestCheckout: boolean;
  automaticTax: boolean;
}

interface AdminState {
  orders: AdminOrder[];
  products: AdminProduct[];
  categories: AdminCategory[];
  coupons: AdminCoupon[];
  pages: AdminPage[];
  customers: AdminCustomer[];
  settings: AdminSettings;

  setOrders: (orders: AdminOrder[]) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addProduct: (product: AdminProduct) => void;
  updateProduct: (id: string, data: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (cat: AdminCategory) => void;
  updateCategory: (id: string, data: Partial<AdminCategory>) => void;
  deleteCategory: (id: string) => void;
  addCoupon: (coupon: AdminCoupon) => void;
  updateCoupon: (code: string, data: Partial<AdminCoupon>) => void;
  deleteCoupon: (code: string) => void;
  addPage: (page: AdminPage) => void;
  updatePage: (id: string, data: Partial<AdminPage>) => void;
  deletePage: (id: string) => void;
  updateSettings: (data: Partial<AdminSettings>) => void;
}

const initialOrders: AdminOrder[] = [
  { id: "#ORD-001", customer: "Sarah Johnson", email: "sarah@example.com", total: 345, status: "DELIVERED", items: [{ name: "Premium Cotton Tee", qty: 2, price: 68 }, { name: "Leather Crossbody Bag", qty: 1, price: 189 }], date: new Date() },
  { id: "#ORD-002", customer: "Marcus Chen", email: "marcus@example.com", total: 189, status: "SHIPPED", items: [{ name: "Minimalist Watch", qty: 1, price: 189 }], date: new Date() },
  { id: "#ORD-003", customer: "Emma Williams", email: "emma@example.com", total: 524, status: "PROCESSING", items: [{ name: "Wool Blend Blazer", qty: 1, price: 295 }, { name: "Cashmere Crew Neck", qty: 1, price: 198 }], date: new Date() },
  { id: "#ORD-004", customer: "James Park", email: "james@example.com", total: 95, status: "PENDING", items: [{ name: "Silk Scarf", qty: 1, price: 95 }], date: new Date() },
  { id: "#ORD-005", customer: "Lisa Anderson", email: "lisa@example.com", total: 678, status: "PROCESSING", items: [{ name: "Italian Leather Sneakers", qty: 1, price: 345 }, { name: "Ceramic Pour-Over Set", qty: 2, price: 85 }], date: new Date() },
];

const initialCustomers: AdminCustomer[] = [
  { id: "cust-1", name: "Sarah Johnson", email: "sarah@example.com", orders: 12, totalSpent: 1249, joined: "Jan 2025", status: "Active" },
  { id: "cust-2", name: "Marcus Chen", email: "marcus@example.com", orders: 8, totalSpent: 892, joined: "Mar 2025", status: "Active" },
  { id: "cust-3", name: "Emma Williams", email: "emma@example.com", orders: 5, totalSpent: 1567, joined: "Jun 2025", status: "Active" },
  { id: "cust-4", name: "James Park", email: "james@example.com", orders: 3, totalSpent: 345, joined: "Sep 2025", status: "Inactive" },
  { id: "cust-5", name: "Lisa Anderson", email: "lisa@example.com", orders: 15, totalSpent: 2341, joined: "Nov 2024", status: "Active" },
];

const initialCoupons: AdminCoupon[] = [
  { code: "WELCOME20", type: "PERCENTAGE", value: 20, minOrder: 50, uses: 145, maxUses: 500, active: true },
  { code: "FREESHIP", type: "FIXED", value: 9.99, minOrder: 75, uses: 67, maxUses: null, active: true },
  { code: "SUMMER25", type: "PERCENTAGE", value: 25, minOrder: 100, uses: 34, maxUses: 200, active: true },
  { code: "VIP10", type: "FIXED", value: 10, minOrder: null, uses: 12, maxUses: 100, active: false },
];

const initialPages: AdminPage[] = [
  { id: "page-1", title: "About Us", slug: "about", content: "About LUXE...", published: true },
  { id: "page-2", title: "Contact", slug: "contact", content: "Contact us...", published: true },
  { id: "page-3", title: "FAQ", slug: "faq", content: "Frequently asked questions...", published: false },
  { id: "page-4", title: "Shipping & Returns", slug: "shipping", content: "Shipping policy...", published: true },
  { id: "page-5", title: "Privacy Policy", slug: "privacy", content: "Privacy policy...", published: true },
];

const initialSettings: AdminSettings = {
  storeName: "LUXE",
  supportEmail: "support@luxe.com",
  currency: "USD",
  maintenanceMode: false,
  guestCheckout: true,
  automaticTax: true,
};

export const useAdminStore = create<AdminState>()((set) => ({
  orders: initialOrders,
  products: mockProducts as AdminProduct[],
  categories: mockCategories as AdminCategory[],
  coupons: initialCoupons,
  pages: initialPages,
  customers: initialCustomers,
  settings: initialSettings,

  setOrders: (orders) => set({ orders }),
  updateOrderStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
  addProduct: (product) =>
    set((state) => ({ products: [product, ...state.products] })),
  updateProduct: (id, data) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deleteProduct: (id) =>
    set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  addCategory: (cat) =>
    set((state) => ({ categories: [cat, ...state.categories] })),
  updateCategory: (id, data) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  deleteCategory: (id) =>
    set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),
  addCoupon: (coupon) =>
    set((state) => ({ coupons: [coupon, ...state.coupons] })),
  updateCoupon: (code, data) =>
    set((state) => ({
      coupons: state.coupons.map((c) => (c.code === code ? { ...c, ...data } : c)),
    })),
  deleteCoupon: (code) =>
    set((state) => ({ coupons: state.coupons.filter((c) => c.code !== code) })),
  addPage: (page) =>
    set((state) => ({ pages: [page, ...state.pages] })),
  updatePage: (id, data) =>
    set((state) => ({
      pages: state.pages.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deletePage: (id) =>
    set((state) => ({ pages: state.pages.filter((p) => p.id !== id) })),
  updateSettings: (data) =>
    set((state) => ({ settings: { ...state.settings, ...data } })),
}));

export type { AdminOrder, AdminProduct, AdminCategory, AdminCoupon, AdminPage, AdminCustomer, AdminSettings, OrderStatus };
