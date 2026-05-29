"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
} from "@/components/ui";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Input } from "@/components/ui";
import { useAdminStore } from "@/store/admin";
import toast from "react-hot-toast";
import type { AdminCategory } from "@/store/admin";

export default function Page() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [editing, setEditing] = useState<Partial<AdminCategory>>({ name: "", description: "", image: "" });

  const openCreate = () => {
    setEditing({ name: "", description: "", image: "" });
    setModalOpen(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setEditing({ ...cat });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!editing.name) {
      toast.error("Category name is required");
      return;
    }
    if (editing.id) {
      updateCategory(editing.id, editing);
      toast.success("Category updated");
    } else {
      addCategory({
        id: `cat-${Date.now()}`,
        name: editing.name,
        slug: editing.name!.toLowerCase().replace(/\s+/g, "-"),
        description: editing.description || "",
        image: editing.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        productCount: 0,
      });
      toast.success("Category created");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id);
      toast.success("Category deleted");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="mt-1 text-muted-foreground">Organize your products.</p>
        </div>
        <Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Add Category</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-xl">
                      <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${cat.image})` }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">{cat.productCount} products</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(cat)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing.id ? "Edit Category" : "Add Category"} size="md">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium">Category Name</label>
            <Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1.5" placeholder="Category name" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1.5" placeholder="Category description" />
          </div>
          <div>
            <label className="text-sm font-medium">Image URL</label>
            <Input value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="mt-1.5" placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Category" message={`Are you sure you want to delete "${deleteTarget?.name}"?`} />
    </div>
  );
}
