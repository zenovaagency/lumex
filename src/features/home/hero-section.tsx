"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";

const heroImages = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80",
  "https://images.unsplash.com/photo-1556217477-d325251ece38?w=1920&q=80",
];

const customerAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&q=80",
];

const floatingShapes = [
  { size: 300, x: "10%", y: "15%", duration: 20, delay: 0 },
  { size: 200, x: "80%", y: "60%", duration: 25, delay: 2 },
  { size: 150, x: "70%", y: "10%", duration: 18, delay: 1 },
  { size: 250, x: "20%", y: "70%", duration: 22, delay: 3 },
];

const SLIDE_INTERVAL = 6000;

function useImageCarousel(images: string[], interval = SLIDE_INTERVAL) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / interval, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [images.length, interval, isPaused]);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(index);
      setProgress(0);
    },
    []
  );

  const next = useCallback(
    () => setCurrent((prev) => (prev + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setCurrent((prev) => (prev - 1 + images.length) % images.length),
    [images.length]
  );

  return { current, progress, isPaused, setIsPaused, goTo, next, prev };
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { current, progress, isPaused, setIsPaused, goTo, next, prev } =
    useImageCarousel(heroImages);

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
      tabIndex={0}
      role="region"
      aria-label="Hero slideshow"
      aria-roledescription="carousel"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/30 to-black/60" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.08, opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url(${heroImages[current]})` }}
          />
        </AnimatePresence>
      </motion.div>

      <div className="absolute inset-0 z-[5] overflow-hidden pointer-events-none">
        {floatingShapes.map((shape, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5 blur-3xl"
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-20 mx-auto flex min-h-[90vh] max-w-7xl flex-col items-start justify-center px-4 sm:px-6 lg:px-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4" />
              New Season Collection 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Elevate Your
              <br />
              <span className="bg-gradient-to-r from-white via-zinc-200 to-white bg-clip-text text-transparent">
                Everyday Style
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 max-w-lg text-lg text-zinc-300 sm:text-xl"
            >
              Discover our curated collection of premium essentials.
              Thoughtfully designed for those who value quality, comfort, and
              timeless aesthetics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/shop">
                <Button
                  size="xl"
                  className="rounded-2xl bg-white text-black hover:bg-zinc-200"
                >
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/shop?sort=newest">
                <Button
                  size="xl"
                  variant="outline"
                  className="rounded-2xl border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  New Arrivals
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 flex items-center gap-8 text-sm text-zinc-400"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {customerAvatars.map((src, i) => (
                    <div
                      key={i}
                      className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-black ring-2 ring-white/20"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                  ))}
                </div>
                <span>10K+ happy customers</span>
              </div>
              <div className="hidden sm:block">✦ Free shipping over $100</div>
              <div className="hidden sm:block">✦ Easy 30-day returns</div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="absolute bottom-24 right-6 z-20 flex flex-col items-end gap-3 sm:bottom-20 sm:right-8">
        <span className="text-xs font-medium tracking-wider text-white/50">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(heroImages.length).padStart(2, "0")}
        </span>
        <div className="flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="group relative h-1.5 rounded-full transition-all duration-500"
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === current
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-0.5 bg-white/10">
          <motion.div
            className="h-full bg-white/60"
            style={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-white/50"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
