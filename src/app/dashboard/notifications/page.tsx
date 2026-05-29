"use client";

import { motion } from "framer-motion";
import { Bell, CheckCheck, Trash2, ShoppingBag, Package, CreditCard, AlertTriangle, Info } from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
} from "@/components/ui";
import { useDashboardStore } from "@/store/dashboard";
import toast from "react-hot-toast";

const iconMap: Record<string, React.ReactNode> = {
  order: <ShoppingBag className="h-4 w-4" />,
  shipping: <Package className="h-4 w-4" />,
  payment: <CreditCard className="h-4 w-4" />,
  alert: <AlertTriangle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

export default function Page() {
  const { notifications, markRead, markAllRead, deleteNotification } = useDashboardStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-muted-foreground">{unread > 0 ? `You have ${unread} unread notification${unread > 1 ? "s" : ""}.` : "You're all caught up."}</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" className="gap-2" onClick={() => { markAllRead(); toast.success("All marked as read"); }}>
            <CheckCheck className="h-4 w-4" />Mark All Read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm">We'll let you know when something arrives.</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n, i) => (
                <motion.div key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className={`flex items-start gap-4 p-4 transition-colors ${n.read ? "" : "bg-muted/30"}`}
                >
                  <div className={`mt-0.5 rounded-full p-2 ${n.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                    {iconMap[n.type] || <Info className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{n.title}</p>
                      {!n.read && <Badge variant="default" className="h-1.5 w-1.5 rounded-full p-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!n.read && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { markRead(n.id); toast.success("Marked as read"); }}>
                        <CheckCheck className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteNotification(n.id); toast.success("Notification deleted"); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
