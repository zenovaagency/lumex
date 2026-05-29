"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Calendar, CreditCard, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
} from "@/components/ui";
import { Modal } from "@/components/ui/modal";
import { useDashboardStore } from "@/store/dashboard";
import { formatPrice } from "@/lib/utils";

const statusVariant: Record<string, "default" | "secondary" | "success" | "premium" | "destructive"> = {
  delivered: "success",
  processing: "default",
  shipped: "premium",
  cancelled: "destructive",
  pending: "secondary",
};

export default function Page() {
  const { orders } = useDashboardStore();
  const [detailTarget, setDetailTarget] = useState<typeof orders[0] | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">Track and view your orders.</p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Package className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No orders yet</p>
              <p className="text-sm">Place your first order to get started.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDetailTarget(order)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{order.id}</h3>
                        <Badge variant={statusVariant[order.status] || "secondary"} className="capitalize">{order.status}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {order.date}</span>
                        <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> {order.payment}</span>
                        <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatPrice(order.total)}</p>
                      <Button variant="link" className="h-auto p-0 text-sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Modal open={!!detailTarget} onClose={() => setDetailTarget(null)} title={`Order ${detailTarget?.id}`} size="lg">
        {detailTarget && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant={statusVariant[detailTarget.status] || "secondary"} className="capitalize text-sm px-3 py-1">{detailTarget.status}</Badge>
              <span className="text-sm text-muted-foreground">{detailTarget.date}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><CreditCard className="h-4 w-4" /> Payment</div>
                <p className="font-medium">{detailTarget.payment}</p>
              </div>
              <div className="rounded-xl border p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> Shipping</div>
                <p className="font-medium text-sm">{detailTarget.shipping}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Items</h4>
              <div className="divide-y rounded-xl border">
                {detailTarget.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between border-t pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">{formatPrice(detailTarget.total)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
