"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  animate,
} from "framer-motion";
import { Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const instagramImages = [
  "https://images.unsplash.com/photo-1607743386760-88ac62b89b8a?w=400&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
  "https://images.unsplash.com/photo-1607743386760-88ac62b89b8a?w=400&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
];

const AUTOPLAY_INTERVAL = 5000;

export function InstagramShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const x = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(300);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isAutoAdvancing = useRef(false);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const itemsPerView = Math.max(1, Math.floor(containerWidth / slideWidth));
  const maxIndex = Math.max(0, instagramImages.length - itemsPerView);
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
        if (w > 0) setSlideWidth(w);
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
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <span className="mb-2 block text-sm font-medium text-muted-foreground">
              Follow Us
            </span>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              @{SITE_CONFIG.name.toLowerCase()}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={SITE_CONFIG.links.instagram}
              className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              <Instagram className="h-5 w-5" />
              Follow on Instagram
            </Link>
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
        aria-label={`Slide ${currentIndex + 1} of ${instagramImages.length}`}
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
            className="flex gap-1"
          >
            {instagramImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative aspect-square w-[50vw] flex-shrink-0 overflow-hidden sm:w-[33.33vw] lg:w-[16.66vw]"
              >
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${img})` }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
