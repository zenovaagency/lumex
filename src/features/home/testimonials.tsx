"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fashion Blogger",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    content:
      "The quality exceeded my expectations. Everything feels premium and the shipping was incredibly fast. My new go-to shop.",
    rating: 5,
  },
  {
    name: "Marcus Chen",
    role: "Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    content:
      "Beautifully curated collection. The attention to detail in both products and packaging is remarkable. Truly a premium experience.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Interior Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    content:
      "I&apos;ve been a customer for months and the consistency in quality is impressive. The minimalist aesthetic perfectly matches my style.",
    rating: 5,
  },
  {
    name: "James Park",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    content:
      "Finally, a brand that understands modern minimalism. Every piece feels intentional and well-crafted. Highly recommended.",
    rating: 5,
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <span className="mb-2 block text-sm font-medium text-muted-foreground">
          Testimonials
        </span>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Loved by Thousands
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((testimonial, i) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-2xl border bg-background p-6 shadow-lg shadow-black/5"
          >
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: testimonial.rating }).map((_, j) => (
                <Star
                  key={j}
                  className="h-4 w-4 fill-yellow-500 text-yellow-500"
                />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              &ldquo;{testimonial.content}&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3 border-t pt-4">
              <div
                className="h-10 w-10 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${testimonial.image})` }}
              />
              <div>
                <p className="text-sm font-medium">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
