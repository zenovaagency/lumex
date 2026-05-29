"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Badge, Separator } from "@/components/ui";
import { formatPrice } from "@/lib/utils";

const stats = [
  {
    label: "Total Revenue",
    value: formatPrice(45231),
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900",
  },
  {
    label: "Total Orders",
    value: "1,245",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900",
  },
  {
    label: "Total Customers",
    value: "892",
    change: "+18.7%",
    trend: "up",
    icon: Users,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900",
  },
  {
    label: "Low Stock Items",
    value: "6",
    change: "+2 this week",
    trend: "down",
    icon: Package,
    color: "text-red-600 bg-red-100 dark:bg-red-900",
  },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Sarah Johnson", total: 345, status: "DELIVERED", date: "2 hours ago" },
  { id: "#ORD-002", customer: "Marcus Chen", total: 189, status: "SHIPPED", date: "5 hours ago" },
  { id: "#ORD-003", customer: "Emma Williams", total: 524, status: "PROCESSING", date: "1 day ago" },
  { id: "#ORD-004", customer: "James Park", total: 95, status: "PENDING", date: "2 days ago" },
  { id: "#ORD-005", customer: "Lisa Anderson", total: 678, status: "PROCESSING", date: "2 days ago" },
];

const topProducts = [
  { name: "Premium Cotton Tee", sales: 234, revenue: 15912, trend: "+12%" },
  { name: "Minimalist Watch", sales: 189, revenue: 47061, trend: "+8%" },
  { name: "Leather Crossbody Bag", sales: 156, revenue: 29484, trend: "+15%" },
  { name: "Wool Blend Blazer", sales: 98, revenue: 28910, trend: "+5%" },
  { name: "Cashmere Crew Neck", sales: 87, revenue: 17226, trend: "+10%" },
];

export function AdminOverview() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Your store at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          Live
        </div>
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
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">
                    vs last month
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer} &middot; {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {formatPrice(order.total)}
                    </span>
                    <Badge
                      variant={
                        order.status === "DELIVERED"
                          ? "success"
                          : order.status === "SHIPPED"
                            ? "warning"
                            : order.status === "PROCESSING"
                              ? "secondary"
                              : "outline"
                      }
                      className="text-[10px]"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatPrice(product.revenue)}
                    </p>
                    <p className="flex items-center gap-0.5 text-xs text-emerald-500">
                      <ArrowUpRight className="h-3 w-3" />
                      {product.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
