import { ShopPage } from "@/features/shop/shop-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Collection",
  description: "Browse our curated collection of premium products.",
};

export default async function Page(props: {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}) {
  const searchParams = await props.searchParams;
  return <ShopPage searchParams={searchParams} />;
}
