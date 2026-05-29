"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { ProductCard } from "@/features/products/product-card";
import { featuredProducts } from "@/lib/mock-data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function FeaturedProducts() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12 flex items-end justify-between"
      >
        <div>
          <span className="mb-2 block text-sm font-medium text-muted-foreground">
            Featured Products
          </span>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Curated for You
          </h2>
        </div>
        <Link href="/shop">
          <Button variant="ghost" className="hidden gap-2 sm:flex">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {featuredProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Link href="/shop">
          <Button variant="outline" className="gap-2">
            View All Products <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
