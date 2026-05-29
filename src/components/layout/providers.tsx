"use client";

import { ThemeProvider } from "@/components/ui";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/lib/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <ToastProvider />
      </ThemeProvider>
    </AuthProvider>
  );
}
