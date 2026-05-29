"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductCard } from "@/features/products/product-card";
import { useWishlistStore } from "@/store/wishlist";
import { featuredProducts } from "@/lib/mock-data";

export default function Page() {
  const { items: wishlistIds } = useWishlistStore();
  const wishlistProducts = featuredProducts.filter((p) =>
    wishlistIds.includes(p.id)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
        <p className="mt-1 text-muted-foreground">
          {wishlistProducts.length} saved items
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 rounded-2xl bg-muted p-6">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Save items you love by tapping the heart icon.
          </p>
          <Link href="/shop">
            <Button className="mt-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
