import { create } from "zustand";

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "shipping" | "payment" | "alert" | "info";
  read: boolean;
  time: string;
}

interface Profile {
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
  location: string;
  birthday: string;
  memberSince: string;
}

interface DashboardOrderItem {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface DashboardOrder {
  id: string;
  date: string;
  status: string;
  payment: string;
  shipping: string;
  total: number;
  items: DashboardOrderItem[];
}

interface DashboardState {
  addresses: Address[];
  notifications: Notification[];
  profile: Profile;
  orders: DashboardOrder[];
  addAddress: (addr: Address) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  deleteNotification: (id: string) => void;
  updateProfile: (data: Partial<Profile>) => void;
}

const initialAddresses: Address[] = [
  { id: "1", label: "Home", street: "123 Main Street", city: "San Francisco", state: "CA", zip: "94105", country: "US", isDefault: true },
  { id: "2", label: "Work", street: "456 Market Street", city: "San Francisco", state: "CA", zip: "94107", country: "US", isDefault: false },
];

const initialNotifications: Notification[] = [
  { id: "n1", title: "Order Shipped", message: "Your order #ORD-A1B2C3D4 has been shipped.", type: "shipping", read: false, time: "2 hours ago" },
  { id: "n2", title: "Flash Sale Alert", message: "Get 25% off on all accessories!", type: "alert", read: false, time: "1 day ago" },
  { id: "n3", title: "Order Delivered", message: "Your order #ORD-E5F6G7H8 has been delivered.", type: "order", read: true, time: "2 days ago" },
  { id: "n4", title: "Payment Confirmed", message: "Payment for order #ORD-X1Y2Z3 has been confirmed.", type: "payment", read: true, time: "3 days ago" },
  { id: "n5", title: "New Collection", message: "Explore our new summer collection.", type: "info", read: false, time: "5 days ago" },
];

const initialProfile: Profile = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  photoUrl: "",
  location: "San Francisco, USA",
  birthday: "1990-01-15",
  memberSince: "January 2025",
};

const initialOrders: DashboardOrder[] = [
  { id: "#ORD-001", date: "May 15, 2026", status: "delivered", payment: "Visa **** 4242", shipping: "Standard", total: 345, items: [{ name: "Premium Cotton Tee", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&q=80", price: 68, quantity: 2 }, { name: "Leather Crossbody Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80", price: 189, quantity: 1 }] },
  { id: "#ORD-002", date: "May 10, 2026", status: "shipped", payment: "PayPal", shipping: "Express", total: 189, items: [{ name: "Minimalist Watch", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&q=80", price: 189, quantity: 1 }] },
  { id: "#ORD-003", date: "May 5, 2026", status: "processing", payment: "Mastercard **** 9876", shipping: "Standard", total: 524, items: [{ name: "Wool Blend Blazer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", price: 295, quantity: 1 }, { name: "Cashmere Crew Neck", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&q=80", price: 198, quantity: 1 }] },
  { id: "#ORD-004", date: "Apr 28, 2026", status: "cancelled", payment: "Visa **** 1111", shipping: "Standard", total: 95, items: [{ name: "Silk Scarf", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100&q=80", price: 95, quantity: 1 }] },
];

export const useDashboardStore = create<DashboardState>()((set) => ({
  addresses: initialAddresses,
  notifications: initialNotifications,
  profile: initialProfile,
  orders: initialOrders,

  addAddress: (addr) =>
    set((state) => ({ addresses: [...state.addresses, addr] })),
  updateAddress: (id, data) =>
    set((state) => ({
      addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...data } : a)),
    })),
  deleteAddress: (id) =>
    set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  updateProfile: (data) =>
    set((state) => ({ profile: { ...state.profile, ...data } })),
}));

export type { Address, Notification, Profile, DashboardOrder, DashboardOrderItem };
