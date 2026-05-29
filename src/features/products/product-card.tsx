"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    image: string;
    rating: number;
    reviewCount: number;
    isNew?: boolean;
    isTrending?: boolean;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleItem, hasItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const discount = calculateDiscount(product.price, product.comparePrice);
  const isWishlisted = hasItem(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.image,
      maxQuantity: 10,
    });
    toast.success("Added to cart");
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full w-full bg-cover bg-center transition-all duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${product.image})` }}
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="premium" className="text-xs">
                New
              </Badge>
            )}
            {discount && (
              <Badge variant="destructive" className="text-xs">
                -{discount}%
              </Badge>
            )}
          </div>

          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-black/60 dark:hover:bg-black/80"
              onClick={handleToggleWishlist}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-foreground"
                }`}
              />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-black/60 dark:hover:bg-black/80"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
            <Button
              size="sm"
              className="w-full rounded-xl bg-white text-black shadow-lg hover:bg-zinc-100 dark:bg-black dark:text-white dark:hover:bg-zinc-900"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium transition-colors group-hover:text-muted-foreground">
              {product.name}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-sm text-yellow-500">★</span>
              <span className="text-xs text-muted-foreground">
                {product.rating}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
