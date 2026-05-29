import { CheckoutPage } from "@/features/checkout/checkout-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order securely.",
};

export default function Page() {
  return <CheckoutPage />;
}
