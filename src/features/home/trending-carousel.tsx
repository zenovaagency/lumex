"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  animate,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/features/products/product-card";
import { featuredProducts } from "@/lib/mock-data";

const GAP = 24;
const AUTOPLAY_INTERVAL = 5000;

export function TrendingCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const x = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(300);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isAutoAdvancing = useRef(false);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const slideWidth = cardWidth + GAP;
  const itemsPerView = Math.max(1, Math.floor(containerWidth / slideWidth));
  const maxIndex = Math.max(0, featuredProducts.length - itemsPerView);
  const hasScroll = maxIndex > 0;

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    function measure() {
      const cw = container!.clientWidth;
      setContainerWidth(cw);
      const firstCard = inner!.children[0] as HTMLElement | undefined;
      if (firstCard) {
        const w = firstCard.offsetWidth;
        if (w > 0) setCardWidth(w);
      }
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (!hasScroll && x.get() !== 0) {
      animate(x, 0, { duration: 0.3 });
    }
  }, [hasScroll, x]);

  useEffect(() => {
    const target = -(currentIndex * slideWidth);
    const controls = animate(x, target, {
      type: "spring",
      stiffness: 400,
      damping: 35,
      mass: 0.8,
    });
    return () => controls.stop();
  }, [currentIndex, slideWidth, x]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    },
    [maxIndex]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  const maxIndexRef = useRef(maxIndex);
  useEffect(() => {
    maxIndexRef.current = maxIndex;
  }, [maxIndex]);

  useEffect(() => {
    if (!isInView || isHovered || isFocused || !hasScroll) return;

    const interval = setInterval(() => {
      if (isAutoAdvancing.current) return;
      isAutoAdvancing.current = true;

      setCurrentIndex((prev) => {
        const next = prev >= maxIndexRef.current ? 0 : prev + 1;
        return next;
      });

      setTimeout(() => {
        isAutoAdvancing.current = false;
      }, 700);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isInView, isHovered, isFocused, hasScroll]);

  const handleDragEnd = useCallback(
    (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: { offset: { x: number }; velocity: { x: number } }
    ) => {
      const threshold = slideWidth * 0.25;
      const currentX = x.get();
      const nearestIndex = Math.round(-currentX / slideWidth);

      let targetIndex = nearestIndex;
      if (
        info.offset.x < -threshold ||
        (Math.abs(info.offset.x) < threshold && info.velocity.x < -300)
      ) {
        targetIndex = Math.min(nearestIndex + 1, maxIndex);
      } else if (
        info.offset.x > threshold ||
        (Math.abs(info.offset.x) < threshold && info.velocity.x > 300)
      ) {
        targetIndex = Math.max(nearestIndex - 1, 0);
      }

      goTo(targetIndex);
    },
    [slideWidth, maxIndex, x, goTo]
  );

  const leftConstraint = -(maxIndex * slideWidth);

  return (
    <section ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <span className="mb-2 block text-sm font-medium text-muted-foreground">
              Trending Now
            </span>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Most Popular
            </h2>
          </div>

        </motion.div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (!hasScroll) return;
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
        tabIndex={hasScroll ? 0 : undefined}
        role="region"
        aria-roledescription="carousel"
        aria-label={`Slide ${currentIndex + 1} of ${featuredProducts.length}`}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background via-background/80 to-transparent" />

        {hasScroll && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/70 text-zinc-900 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black/80 sm:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/70 text-zinc-900 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white dark:bg-black/70 dark:text-white dark:hover:bg-black/80 sm:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div ref={containerRef} className="overflow-hidden">
          <motion.div
            ref={innerRef}
            style={{ x }}
            drag={hasScroll ? "x" : false}
            dragConstraints={
              hasScroll
                ? { left: leftConstraint, right: 0 }
                : { left: 0, right: 0 }
            }
            dragElastic={0.05}
            onDragEnd={handleDragEnd}
            className="flex gap-6 px-4 sm:px-6 lg:px-8"
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="w-[280px] flex-shrink-0 sm:w-[300px]"
                role="group"
                aria-roledescription="slide"
                aria-label={`Product ${product.name}`}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {hasScroll && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {featuredProducts.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group relative h-2 rounded-full transition-all duration-300"
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={`block h-2 rounded-full transition-all duration-500 ${
                  i === currentIndex
                    ? "w-8 bg-foreground"
                    : "w-2 bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
