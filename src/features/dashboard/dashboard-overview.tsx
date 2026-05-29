"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";

const stats = [
  {
    label: "Total Orders",
    value: "12",
    change: "+2 this month",
    icon: ShoppingBag,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900",
  },
  {
    label: "Total Spent",
    value: formatPrice(1249),
    change: "+$230 this month",
    icon: DollarSign,
    color: "text-green-600 bg-green-100 dark:bg-green-900",
  },
  {
    label: "Wishlist",
    value: "8",
    change: "3 items on sale",
    icon: Package,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900",
  },
  {
    label: "Reviews",
    value: "5",
    change: "2 pending",
    icon: Users,
    color: "text-orange-600 bg-orange-100 dark:bg-orange-900",
  },
];

const recentOrders = [
  {
    id: "ORD-A1B2C3D4",
    date: new Date("2025-12-15"),
    total: 345,
    status: "DELIVERED",
    items: 2,
  },
  {
    id: "ORD-E5F6G7H8",
    date: new Date("2025-12-10"),
    total: 189,
    status: "SHIPPED",
    items: 1,
  },
  {
    id: "ORD-I9J0K1L2",
    date: new Date("2025-12-05"),
    total: 524,
    status: "PROCESSING",
    items: 3,
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here&apos;s your activity summary.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`rounded-xl p-2 ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl bg-muted/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-background p-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(order.date)} &middot; {order.items} items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.total)}</p>
                  <Badge
                    variant={
                      order.status === "DELIVERED"
                        ? "success"
                        : order.status === "SHIPPED"
                          ? "warning"
                          : "secondary"
                    }
                    className="mt-1"
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
