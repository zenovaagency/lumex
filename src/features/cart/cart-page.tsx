"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import { Button, Input, Separator } from "@/components/ui";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import toast from "react-hot-toast";

export function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    couponCode,
    setCoupon,
  } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const [couponInput, setCouponInput] = useState(couponCode || "");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    const code = couponInput.trim().toUpperCase();
    if (code === "WELCOME20") {
      setCoupon(code, 20);
      toast.success("Coupon applied! 20% off");
    } else if (code === "FREESHIP") {
      setCoupon(code, 9.99);
      toast.success("Free shipping applied!");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="mb-6 rounded-2xl bg-muted p-8">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Your cart is empty</h1>
          <p className="mt-4 text-muted-foreground">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/shop">
            <Button className="mt-8 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Shopping Cart
            </h1>
            <p className="mt-1 text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-6 rounded-2xl border p-4"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
                  >
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-medium hover:text-muted-foreground"
                        >
                          {item.name}
                        </Link>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">
                            {item.variant.name}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="flex h-8 w-12 items-center justify-center rounded-lg border text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl border p-6">
              <h3 className="text-lg font-semibold">Order Summary</h3>

              <form onSubmit={handleApplyCoupon} className="mt-4 flex gap-2">
                <Input
                  placeholder="Coupon code"
                  className="h-10 flex-1"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="h-10 rounded-xl"
                >
                  Apply
                </Button>
              </form>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} for
                    free shipping
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="mt-6 w-full rounded-2xl" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded border text-[10px]">
                  ✓
                </span>
                Secure checkout with SSL encryption
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
