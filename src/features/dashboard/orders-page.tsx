"use client";

import { motion } from "framer-motion";
import { Package, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { formatPrice, formatDate } from "@/lib/utils";

const orders = [
  {
    id: "ORD-A1B2C3D4",
    date: new Date("2025-12-15"),
    total: 345,
    status: "DELIVERED",
    items: [
      { name: "Premium Cotton Tee", qty: 2, price: 68 },
      { name: "Leather Crossbody Bag", qty: 1, price: 189 },
    ],
  },
  {
    id: "ORD-E5F6G7H8",
    date: new Date("2025-12-10"),
    total: 189,
    status: "SHIPPED",
    items: [{ name: "Minimalist Watch", qty: 1, price: 189 }],
  },
  {
    id: "ORD-I9J0K1L2",
    date: new Date("2025-12-05"),
    total: 524,
    status: "PROCESSING",
    items: [
      { name: "Wool Blend Blazer", qty: 1, price: 295 },
      { name: "Cashmere Crew Neck", qty: 1, price: 198 },
      { name: "Silk Scarf", qty: 1, price: 95 },
    ],
  },
];

export function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="mt-1 text-muted-foreground">
          View and track all your orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              When you place an order, it will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{order.id}</CardTitle>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      order.status === "DELIVERED"
                        ? "success"
                        : order.status === "SHIPPED"
                          ? "warning"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">
                          {item.name} x{item.qty}
                        </span>
                        <span>{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
