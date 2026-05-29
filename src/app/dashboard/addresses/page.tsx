"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, MapPin, Star } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
} from "@/components/ui";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { useDashboardStore } from "@/store/dashboard";
import type { Address } from "@/store/dashboard";
import toast from "react-hot-toast";

const emptyAddress: Address = {
  id: "", label: "", street: "", city: "", state: "", zip: "", country: "US", isDefault: false,
};

export default function Page() {
  const { addresses, addAddress, updateAddress, deleteAddress } = useDashboardStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [editing, setEditing] = useState<Address>({ ...emptyAddress, id: `addr-${Date.now()}` });

  const openCreate = () => { setEditing({ ...emptyAddress, id: `addr-${Date.now()}` }); setModalOpen(true); };
  const openEdit = (a: Address) => { setEditing({ ...a }); setModalOpen(true); };

  const handleSave = () => {
    if (!editing.label || !editing.street || !editing.city) { toast.error("Label, street, and city are required"); return; }
    const exists = addresses.find((a) => a.id === editing.id);
    if (exists) {
      if (editing.isDefault) { addresses.forEach((a) => { if (a.id !== editing.id) updateAddress(a.id, { ...a, isDefault: false }); }); }
      updateAddress(editing.id, editing);
      toast.success("Address updated");
    } else {
      if (editing.isDefault) { addresses.forEach((a) => updateAddress(a.id, { ...a, isDefault: false })); }
      addAddress(editing);
      toast.success("Address added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) { deleteAddress(deleteTarget.id); toast.success("Address deleted"); setDeleteTarget(null); }
  };

  const setDefault = (addr: Address) => {
    addresses.forEach((a) => updateAddress(a.id, { ...a, isDefault: a.id === addr.id }));
    toast.success("Default address updated");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Addresses</h1>
          <p className="mt-1 text-muted-foreground">Manage your shipping addresses.</p>
        </div>
        <Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Add Address</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr, i) => (
          <motion.div key={addr.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={addr.isDefault ? "ring-2 ring-primary/20" : ""}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5"><MapPin className="h-5 w-5 text-muted-foreground" /></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{addr.label}</h3>
                        {addr.isDefault && <Badge variant="premium">Default</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{addr.street}</p>
                      <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                      <p className="text-sm text-muted-foreground">{addr.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!addr.isDefault && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDefault(addr)}><Star className="h-4 w-4" /></Button>}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(addr)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(addr)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={addresses.find((a) => a.id === editing.id) ? "Edit Address" : "Add Address"} size="md">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Label</label>
              <Input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className="mt-1.5" placeholder="Home, Work, etc." />
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <Input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className="mt-1.5" placeholder="US" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Street</label>
            <Input value={editing.street} onChange={(e) => setEditing({ ...editing, street: e.target.value })} className="mt-1.5" placeholder="123 Main St" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium">City</label>
              <Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <Input value={editing.state} onChange={(e) => setEditing({ ...editing, state: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">ZIP</label>
              <Input value={editing.zip} onChange={(e) => setEditing({ ...editing, zip: e.target.value })} className="mt-1.5" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm pt-1">
            <input type="checkbox" checked={editing.isDefault} onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })} className="rounded border-input" />
            Set as default address
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{addresses.find((a) => a.id === editing.id) ? "Update" : "Add"}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Address" message={`Delete "${deleteTarget?.label}"?`} />
    </div>
  );
}
