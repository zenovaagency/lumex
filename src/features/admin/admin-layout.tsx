"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ChevronRight,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_SIDEBAR } from "@/lib/constants";
import { iconMap } from "@/components/ui/icons";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="skeleton h-8 w-48 rounded-xl" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 rounded-2xl bg-destructive/10 p-6">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            You need administrator privileges to access this area.
          </p>
          <Link href="/">
            <Button className="mt-8">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-5">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary p-2">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Store Management</p>
              </div>
            </div>
            <div className="space-y-1">
              {ADMIN_SIDEBAR.map((item) => {
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
                      {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
        <main className="lg:col-span-4">
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
