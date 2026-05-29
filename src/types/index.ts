export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export interface ExtendedUser extends User {
  id: string;
  role: "USER" | "ADMIN" | "MODERATOR";
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  variant?: {
    id: string;
    name: string;
    sku: string;
  } | null;
  maxQuantity: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brand?: string;
  onSale?: boolean;
  newArrivals?: boolean;
  trending?: boolean;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: { url: string; alt: string | null }[];
  categories: { id: string; name: string; slug: string }[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  quantity: number;
  discount: number | null;
  createdAt: Date;
}

export interface ProductDetail extends ProductListItem {
  shortDescription: string | null;
  sku: string;
  barcode: string | null;
  tags: string[];
  brand: string | null;
  material: string | null;
  weight: number | null;
  dimensions: string | null;
  variants: {
    id: string;
    name: string;
    sku: string;
    price: number | null;
    quantity: number;
    isAvailable: boolean;
    options: Record<string, string> | null;
  }[];
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    user: { name: string | null; image: string | null };
    createdAt: Date;
  }[];
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  createdAt: Date;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockItems: number;
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  recentOrders: OrderSummary[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
}
