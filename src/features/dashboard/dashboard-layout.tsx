"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-provider";
import {
  LayoutDashboard,
  ChevronRight,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { DASHBOARD_SIDEBAR } from "@/lib/constants";
import { iconMap } from "@/components/ui/icons";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Package className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Sign in required</h2>
        <p className="mt-2 text-muted-foreground">
          Please sign in to access your dashboard.
        </p>
        <Link href="/login">
          <Button className="mt-6">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-1">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                {user.name || "User"}
              </p>
            </div>
            {DASHBOARD_SIDEBAR.map((item) => {
              const isActive = pathname === item.href;
              const Icon = iconMap[item.icon] || LayoutDashboard;
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </aside>
        <main className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
