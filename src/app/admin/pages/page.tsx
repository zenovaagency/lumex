"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
} from "@/components/ui";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { useAdminStore } from "@/store/admin";
import toast from "react-hot-toast";
import type { AdminPage } from "@/store/admin";

const emptyPage = { id: "", title: "", slug: "", content: "", published: false };

export default function Page() {
  const { pages, addPage, updatePage, deletePage } = useAdminStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminPage | null>(null);
  const [editing, setEditing] = useState<AdminPage>({ ...emptyPage });

  const openCreate = () => { setEditing({ ...emptyPage, id: `page-${Date.now()}` }); setModalOpen(true); };
  const openEdit = (p: AdminPage) => { setEditing({ ...p }); setModalOpen(true); };

  const handleSave = () => {
    if (!editing.title || !editing.content) { toast.error("Title and content are required"); return; }
    const exists = pages.find((p) => p.id === editing.id);
    if (exists) { updatePage(editing.id, editing); toast.success("Page updated"); }
    else { addPage(editing); toast.success("Page created"); }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) { deletePage(deleteTarget.id); toast.success("Page deleted"); setDeleteTarget(null); }
  };

  const togglePublish = (page: AdminPage) => {
    updatePage(page.id, { ...page, published: !page.published });
    toast.success(page.published ? "Page unpublished" : "Page published");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="mt-1 text-muted-foreground">Manage static pages.</p>
        </div>
        <Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Add Page</Button>
      </div>

      <div className="grid gap-4">
        {pages.map((page, i) => (
          <motion.div key={page.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold truncate">{page.title}</h3>
                      <Badge variant={page.published ? "success" : "secondary"}>{page.published ? "Published" : "Draft"}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground truncate">/{page.slug}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePublish(page)}>
                      {page.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(page)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget(page)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={pages.find((p) => p.id === editing.id) ? "Edit Page" : "Add Page"} size="lg">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="mt-1.5" placeholder="Page title" />
            </div>
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="mt-1.5" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="mt-1.5 flex h-40 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200" placeholder="Page content (HTML or Markdown)" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded border-input" />
            Published
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Page</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Page" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
}
