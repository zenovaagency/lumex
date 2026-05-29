"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, ShoppingBag, DollarSign, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
} from "@/components/ui";
import { Modal } from "@/components/ui/modal";
import { useAdminStore } from "@/store/admin";
import { formatPrice } from "@/lib/utils";

export default function Page() {
  const { customers } = useAdminStore();
  const [search, setSearch] = useState("");
  const [detailTarget, setDetailTarget] = useState<typeof customers[0] | null>(null);

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="mt-1 text-muted-foreground">View your customer base.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Orders</th>
                  <th className="p-4 font-medium">Total Spent</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 flex items-center justify-center text-sm font-semibold text-white">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{c.email}</td>
                    <td className="p-4 text-sm">{c.orders}</td>
                    <td className="p-4 text-sm font-medium">{formatPrice(c.totalSpent)}</td>
                    <td className="p-4 text-sm text-muted-foreground">{c.joined}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" onClick={() => setDetailTarget(c)}>View</Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal open={!!detailTarget} onClose={() => setDetailTarget(null)} title={detailTarget?.name || ""} size="md">
        {detailTarget && (
          <div className="space-y-5">
            <div className="flex gap-4 items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 flex items-center justify-center text-2xl font-semibold text-white">
                {detailTarget.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{detailTarget.name}</h3>
                <p className="text-sm text-muted-foreground">{detailTarget.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShoppingBag className="h-4 w-4" /> Orders</div>
                <p className="text-2xl font-bold">{detailTarget.orders}</p>
              </div>
              <div className="rounded-xl border p-4 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /> Total Spent</div>
                <p className="text-2xl font-bold">{formatPrice(detailTarget.totalSpent)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" /> Joined {detailTarget.joined}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
