import { LoginPage } from "@/features/auth/login-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
};

export default async function Page(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await props.searchParams;
  return <LoginPage callbackUrl={callbackUrl} />;
}
