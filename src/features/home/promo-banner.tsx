"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Shield, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";

export function PromoBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $100",
    },
    {
      icon: Shield,
      title: "Secure Checkout",
      description: "256-bit SSL encrypted",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
  ];

  return (
    <section ref={ref} className="bg-zinc-50 dark:bg-zinc-900/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-2 block text-sm font-medium text-muted-foreground">
              Why Shop With Us
            </span>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Premium Quality,
              <br />
              <span className="text-gradient">Guaranteed</span>
            </h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Every product is carefully selected and tested to ensure it meets
              our high standards. We stand behind everything we sell.
            </p>
            <Link href="/shop">
              <Button className="mt-8 gap-2 rounded-2xl" size="lg">
                Start Shopping <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="rounded-2xl border bg-background p-6 shadow-lg shadow-black/5"
              >
                <feature.icon className="h-8 w-8" />
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
