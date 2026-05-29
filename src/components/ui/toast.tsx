"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "12px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "hsl(var(--background))",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "hsl(var(--background))",
          },
        },
      }}
    />
  );
}
