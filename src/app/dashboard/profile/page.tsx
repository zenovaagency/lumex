"use client";

import { useState } from "react";
import { Camera, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
} from "@/components/ui";
import { useDashboardStore } from "@/store/dashboard";
import toast from "react-hot-toast";

export default function Page() {
  const { profile, updateProfile } = useDashboardStore();
  const [form, setForm] = useState({ ...profile });

  const handleSave = () => {
    updateProfile(form);
    toast.success("Profile updated successfully");
  };

  const handlePhotoUpload = () => {
    toast.success("Photo upload is a mock — in production, this would open a file picker.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your personal information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={handlePhotoUpload}>
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700 flex items-center justify-center text-3xl font-semibold text-white overflow-hidden">
                {form.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={form.photoUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  form.name.charAt(0)
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="font-medium">{form.name}</p>
              <p className="text-sm text-muted-foreground">{form.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Click to change photo</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="New York, USA" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Birthday</Label>
              <Input value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} placeholder="YYYY-MM-DD" />
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input value={form.memberSince} disabled className="opacity-60" />
            </div>
          </div>

          <div className="pt-2">
            <Button className="gap-2" onClick={handleSave}><Save className="h-4 w-4" />Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
