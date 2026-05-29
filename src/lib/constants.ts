export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Sale", href: "/shop?sort=sale" },
] as const;

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Most Popular", value: "popular" },
] as const;

export const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "Over $200", min: 200, max: undefined },
] as const;

export const RATINGS = [5, 4, 3, 2, 1] as const;

export const ITEMS_PER_PAGE = 12;

export const SHIPPING_COST = 9.99;
export const FREE_SHIPPING_THRESHOLD = 100;

export const SITE_CONFIG = {
  name: "LUXE",
  tagline: "Premium Essentials for the Modern Life",
  description:
    "Discover our curated collection of premium products designed for those who appreciate quality and craftsmanship.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og.jpg",
  links: {
    twitter: "https://twitter.com/luxe",
    instagram: "https://instagram.com/luxe",
    facebook: "https://facebook.com/luxe",
  },
} as const;

export const REVIEW_CATEGORIES = [
  { label: "All", value: "all" },
  { label: "5 Star", value: "5" },
  { label: "4 Star", value: "4" },
  { label: "3 Star", value: "3" },
  { label: "2 Star", value: "2" },
  { label: "1 Star", value: "1" },
  { label: "With Photos", value: "photos" },
] as const;

export const DASHBOARD_SIDEBAR = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: "ShoppingBag",
  },
  {
    label: "Wishlist",
    href: "/dashboard/wishlist",
    icon: "Heart",
  },
  {
    label: "Addresses",
    href: "/dashboard/addresses",
    icon: "MapPin",
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: "User",
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: "Bell",
  },
] as const;

export const ADMIN_SIDEBAR = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "LayoutDashboard",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: "ShoppingBag",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: "Package",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: "FolderTree",
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: "Users",
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: "Percent",
  },
  {
    label: "Pages",
    href: "/admin/pages",
    icon: "FileText",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "Settings",
  },
] as const;
