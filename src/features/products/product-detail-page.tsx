"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Shield,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Share2,
  Check,
} from "lucide-react";
import { Button, Badge, Separator } from "@/components/ui";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useWishlistStore } from "@/store/wishlist";
import { featuredProducts } from "@/lib/mock-data";
import { formatPrice, calculateDiscount, getStockStatus } from "@/lib/utils";
import { ProductCard } from "./product-card";
import toast from "react-hot-toast";

interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const product = featuredProducts.find((p) => p.slug === slug);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const { addItem } = useCartStore();
  const { toggleItem, hasItem } = useWishlistStore();
  const imageRef = useRef<HTMLDivElement>(null);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/shop">
          <Button className="mt-6">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.comparePrice);
  const stockStatus = getStockStatus(10);
  const isWishlisted = hasItem(product.id);
  const images = product.images || [product.image];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      image: product.image,
      maxQuantity: 10,
    });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    useUIStore.getState().openCart();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="mb-6 sm:mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              ref={imageRef}
              className="relative aspect-[4/5] cursor-crosshair overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-700"
                style={{
                  backgroundImage: `url(${images[currentImage]})`,
                  transform: isZoomed ? "scale(1.5)" : "scale(1)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
              {discount && (
                <Badge
                  variant="destructive"
                  className="absolute left-3 top-3 sm:left-4 sm:top-4 text-sm"
                >
                  -{discount}%
                </Badge>
              )}
              <button
                onClick={() =>
                  setCurrentImage((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-xl bg-white/80 p-1.5 sm:p-2 opacity-0 shadow-lg backdrop-blur-sm transition-opacity hover:opacity-100 dark:bg-black/60"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentImage((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-xl bg-white/80 p-1.5 sm:p-2 opacity-0 shadow-lg backdrop-blur-sm transition-opacity hover:opacity-100 dark:bg-black/60"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </motion.div>

            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative aspect-square w-16 sm:w-20 shrink-0 overflow-hidden rounded-xl transition-all ${
                    i === currentImage
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {product.isNew && <Badge variant="premium">New</Badge>}
                <span className={`text-sm font-medium ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-lg sm:text-xl text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
                {discount && (
                  <Badge variant="success">Save {discount}%</Badge>
                )}
              </div>

              <p className="mt-6 leading-relaxed text-muted-foreground text-sm sm:text-base">
                {product.description}
              </p>

              <Separator className="my-6 sm:my-8" />

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="flex h-9 w-14 sm:h-10 sm:w-16 items-center justify-center rounded-xl border text-sm font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      disabled={quantity >= 10}
                    >
                      <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1 gap-2 rounded-2xl"
                    onClick={handleAddToCart}
                  >
                    <Plus className="h-5 w-5" />
                    <span className="truncate">Add to Cart — {formatPrice(product.price * quantity)}</span>
                  </Button>
                  <Button
                    size="lg"
                    variant="premium"
                    className="flex-1 rounded-2xl"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 rounded-xl"
                    onClick={() => {
                      toggleItem(product.id);
                      toast.success(
                        isWishlisted
                          ? "Removed from wishlist"
                          : "Added to wishlist"
                      );
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isWishlisted ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    {isWishlisted ? "Saved" : "Save to Wishlist"}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2 rounded-xl">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>

              <Separator className="my-6 sm:my-8" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Truck, label: "Free Shipping", desc: "Over $100" },
                  { icon: Shield, label: "Secure", desc: "Checkout" },
                  { icon: RotateCcw, label: "Easy Returns", desc: "30 days" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="rounded-xl bg-muted p-4 text-center"
                  >
                    <Icon className="mx-auto h-5 w-5" />
                    <p className="mt-2 text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16 sm:mt-24">
          <h2 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold tracking-tight">
            You May Also Like
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
