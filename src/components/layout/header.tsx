"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-provider";
import { useTheme } from "next-themes";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Settings,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useUIStore } from "@/store/ui";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { SearchModal } from "@/components/layout/search-modal";

export function Header() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openCart,
    openSearch,
  } = useUIStore();
  const cartCount = getItemCount();
  const currentUser = user;

  return (
    <>
      <header className="fixed top-0 z-40 w-full border-b border-border/40 glass">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter"
              onClick={closeMobileMenu}
            >
              {SITE_CONFIG.name}
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearch}
              className="hidden md:inline-flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:inline-flex"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {currentUser ? (
              <Link href="/dashboard/wishlist" className="hidden md:block">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </Link>
            ) : null}

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>

            <div className="hidden md:flex items-center gap-2">
              {currentUser ? (
                <>
                  {currentUser.role === "ADMIN" && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-semibold text-primary">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => signOut()}>
                    <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="default" size="sm" className="rounded-xl">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-16 z-30 glass md:hidden"
          >
            <nav className="flex flex-col gap-2 p-6 pt-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-3 text-lg font-medium transition-colors hover:bg-accent"
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-4 h-px bg-border" />
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition-colors hover:bg-accent"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <button
                onClick={openSearch}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition-colors hover:bg-accent"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
              {currentUser ? (
                <>
                  <Link
                    href="/dashboard/wishlist"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition-colors hover:bg-accent"
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist ({wishlistItems.length})
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition-colors hover:bg-accent"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition-colors hover:bg-accent"
                  >
                    <Package className="h-5 w-5" />
                    Orders
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg transition-colors hover:bg-accent"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  {currentUser.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-semibold text-primary transition-colors hover:bg-accent"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Admin Panel
                    </Link>
                  )}
                  <div className="my-4 h-px bg-border" />
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <Button className="w-full rounded-xl" size="lg">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl"
                      size="lg"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
      <SearchModal />
    </>
  );
}
