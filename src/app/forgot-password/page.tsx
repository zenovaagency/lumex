import { ForgotPasswordPage } from "@/features/auth/forgot-password-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password.",
};

export default function Page() {
  return <ForgotPasswordPage />;
}
