"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
  Switch,
} from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/modal";
import { useAdminStore } from "@/store/admin";
import toast from "react-hot-toast";

export default function Page() {
  const { settings, updateSettings } = useAdminStore();
  const [form, setForm] = useState({ ...settings });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {
    updateSettings(form);
    toast.success("Settings saved successfully");
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your store settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Temporarily disable your store.</p>
            </div>
            <Switch checked={form.maintenanceMode} onCheckedChange={(val) => setForm({ ...form, maintenanceMode: val })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium">Guest Checkout</p>
              <p className="text-sm text-muted-foreground">Allow customers to checkout without an account.</p>
            </div>
            <Switch checked={form.guestCheckout} onCheckedChange={(val) => setForm({ ...form, guestCheckout: val })} />
          </div>
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium">Automatic Tax</p>
              <p className="text-sm text-muted-foreground">Calculate and apply taxes automatically.</p>
            </div>
            <Switch checked={form.automaticTax} onCheckedChange={(val) => setForm({ ...form, automaticTax: val })} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => setConfirmOpen(true)}>Save Changes</Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSave}
        title="Save Settings"
        message="Are you sure you want to save these settings?"
      />
    </div>
  );
}
