import { CartPage } from "@/features/cart/cart-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your cart and proceed to checkout.",
};

export default function Page() {
  return <CartPage />;
}
