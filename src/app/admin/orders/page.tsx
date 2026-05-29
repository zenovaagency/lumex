"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, X, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Modal } from "@/components/ui/modal";
import { useAdminStore } from "@/store/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { OrderStatus } from "@/store/admin";

const statusOptions: { value: OrderStatus; label: string; variant: "success" | "warning" | "secondary" | "outline" | "destructive" }[] = [
  { value: "PENDING", label: "Pending", variant: "outline" },
  { value: "PROCESSING", label: "Processing", variant: "secondary" },
  { value: "SHIPPED", label: "Shipped", variant: "warning" },
  { value: "DELIVERED", label: "Delivered", variant: "success" },
  { value: "CANCELLED", label: "Cancelled", variant: "destructive" },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const opt = statusOptions.find((o) => o.value === status);
  return <Badge variant={opt?.variant || "secondary"} className="text-[10px]">{status}</Badge>;
}

export default function Page() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    setChangingStatus(null);
    toast.success(`Order ${orderId} updated to ${newStatus}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="mt-1 text-muted-foreground">Manage customer orders.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Items</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4 text-sm font-medium">{order.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(order.date)}</td>
                    <td className="p-4 text-sm">{order.items.length}</td>
                    <td className="p-4 text-sm font-medium">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <div className="relative">
                        <button
                          onClick={() => setChangingStatus(changingStatus === order.id ? null : order.id)}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-accent"
                        >
                          <StatusBadge status={order.status} />
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        {changingStatus === order.id && (
                          <div className="absolute left-0 top-full z-10 mt-1 w-36 rounded-xl border bg-background p-1 shadow-lg">
                            {statusOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => handleStatusChange(order.id, opt.value)}
                                className="flex w-full items-center rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-accent"
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder?.id || ""}`} size="lg">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedOrder.customer}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={selectedOrder.status} />
              </div>
            </div>
            <div className="rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-3 font-medium">Item</th>
                    <th className="p-3 font-medium">Qty</th>
                    <th className="p-3 font-medium text-right">Price</th>
                    <th className="p-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.name} className="border-b last:border-0">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.qty}</td>
                      <td className="p-3 text-right">{formatPrice(item.price)}</td>
                      <td className="p-3 text-right font-medium">{formatPrice(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t font-semibold">
                    <td colSpan={3} className="p-3 text-right">Total</td>
                    <td className="p-3 text-right">{formatPrice(selectedOrder.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex justify-end gap-3">
              <Select value={selectedOrder.status} onValueChange={(val) => handleStatusChange(selectedOrder.id, val as OrderStatus)}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
