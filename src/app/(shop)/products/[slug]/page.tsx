import { ProductDetailPage } from "@/features/products/product-detail-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details",
  description: "View product details and add to cart.",
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return <ProductDetailPage slug={slug} />;
}
