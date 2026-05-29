import { RegisterPage } from "@/features/auth/register-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your account to start shopping.",
};

export default function Page() {
  return <RegisterPage />;
}
