"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { useAdminStore } from "@/store/admin";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import type { AdminCoupon } from "@/store/admin";

const emptyCoupon: AdminCoupon = { code: "", type: "PERCENTAGE", value: 0, minOrder: null, uses: 0, maxUses: null, active: true };

export default function Page() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCoupon | null>(null);
  const [editing, setEditing] = useState<AdminCoupon>({ ...emptyCoupon });

  const openCreate = () => { setEditing({ ...emptyCoupon, code: "" }); setModalOpen(true); };
  const openEdit = (c: AdminCoupon) => { setEditing({ ...c }); setModalOpen(true); };

  const handleSave = () => {
    if (!editing.code || !editing.value) {
      toast.error("Code and value are required");
      return;
    }
    const exists = coupons.find((c) => c.code === editing.code);
    if (exists && !coupons.find((c) => c.code === editing.code && c.value === editing.value)) {
      updateCoupon(editing.code, editing);
      toast.success("Coupon updated");
    } else if (exists) {
      toast.error("Coupon code already exists");
      return;
    } else {
      addCoupon(editing);
      toast.success("Coupon created");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) { deleteCoupon(deleteTarget.code); toast.success("Coupon deleted"); setDeleteTarget(null); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="mt-1 text-muted-foreground">Manage promotional codes.</p>
        </div>
        <Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Add Coupon</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {coupons.map((coupon, i) => (
          <motion.div key={coupon.code} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="rounded-lg bg-muted px-3 py-1 text-lg font-bold tracking-wider">{coupon.code}</code>
                      <Badge variant={coupon.active ? "success" : "secondary"}>{coupon.active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <p>{coupon.type === "PERCENTAGE" ? `${coupon.value}% off` : `${formatPrice(coupon.value)} off`}</p>
                      {coupon.minOrder && <p>Min. order: {formatPrice(coupon.minOrder)}</p>}
                      <p>Used: {coupon.uses}{coupon.maxUses ? ` / ${coupon.maxUses}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(coupon)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(coupon)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={coupons.find((c) => c.code === editing.code && c.value === editing.value) ? "Edit Coupon" : "Add Coupon"} size="md">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Code</label>
              <Input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} className="mt-1.5" placeholder="SAVE20" />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={editing.type} onValueChange={(val) => setEditing({ ...editing, type: val as "PERCENTAGE" | "FIXED" })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Value</label>
              <Input type="number" value={editing.value || ""} onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })} className="mt-1.5" placeholder={editing.type === "PERCENTAGE" ? "20" : "9.99"} />
            </div>
            <div>
              <label className="text-sm font-medium">Min Order ($)</label>
              <Input type="number" value={editing.minOrder || ""} onChange={(e) => setEditing({ ...editing, minOrder: e.target.value ? Number(e.target.value) : null })} className="mt-1.5" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Max Uses</label>
              <Input type="number" value={editing.maxUses || ""} onChange={(e) => setEditing({ ...editing, maxUses: e.target.value ? Number(e.target.value) : null })} className="mt-1.5" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="rounded border-input" />
                Active
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Coupon</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Coupon" message={`Delete coupon "${deleteTarget?.code}"?`} />
    </div>
  );
}
