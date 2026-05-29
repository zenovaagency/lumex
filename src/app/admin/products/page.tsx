"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { useAdminStore } from "@/store/admin";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import type { AdminProduct } from "@/store/admin";

const emptyProduct = {
  id: "", name: "", slug: "", description: "", price: 0, comparePrice: null,
  image: "", images: [], rating: 0, reviewCount: 0, category: "clothing", isNew: false, isTrending: false,
};

export default function Page() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [editing, setEditing] = useState<AdminProduct>({ ...emptyProduct });

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setEditing({ ...emptyProduct, id: `prod-${Date.now()}`, slug: `product-${Date.now()}` });
    setModalOpen(true);
  };

  const openEdit = (product: AdminProduct) => {
    setEditing({ ...product });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!editing.name || !editing.price) {
      toast.error("Name and price are required");
      return;
    }
    const exists = products.find((p) => p.id === editing.id);
    if (exists) {
      updateProduct(editing.id, editing);
      toast.success("Product updated");
    } else {
      addProduct(editing);
      toast.success("Product created");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-muted-foreground">Manage your product catalog.</p>
        </div>
        <Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Add Product</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                        </div>
                        <span className="font-medium text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium">{formatPrice(product.price)}</td>
                    <td className="p-4 text-sm capitalize text-muted-foreground">{product.category}</td>
                    <td className="p-4"><Badge variant="success">In Stock</Badge></td>
                    <td className="p-4"><Badge variant={product.isNew ? "premium" : "secondary"}>{product.isNew ? "New" : "Active"}</Badge></td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(product)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing.id && products.find((p) => p.id === editing.id) ? "Edit Product" : "Add Product"} size="xl">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="mt-1.5" placeholder="Product name" />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={editing.category} onValueChange={(val) => setEditing({ ...editing, category: val })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="home-living">Home & Living</SelectItem>
                  <SelectItem value="footwear">Footwear</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1.5 flex h-20 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200" placeholder="Product description" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Price ($)</label>
              <Input type="number" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="mt-1.5" />
            </div>
            <div>
              <label className="text-sm font-medium">Compare Price ($)</label>
              <Input type="number" value={editing.comparePrice || ""} onChange={(e) => setEditing({ ...editing, comparePrice: e.target.value ? Number(e.target.value) : null })} className="mt-1.5" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Image URL</label>
            <Input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="mt-1.5" placeholder="https://..." />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.isNew} onChange={(e) => setEditing({ ...editing, isNew: e.target.checked })} className="rounded border-input" />
              New Arrival
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.isTrending} onChange={(e) => setEditing({ ...editing, isTrending: e.target.checked })} className="rounded border-input" />
              Trending
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Product</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
