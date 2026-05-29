"use client";

import { HeroSection } from "./hero-section";
import { FeaturedProducts } from "./featured-products";
import { TrendingCarousel } from "./trending-carousel";
import { CategoriesGrid } from "./categories-grid";
import { Testimonials } from "./testimonials";
import { Newsletter } from "./newsletter";
import { InstagramShowcase } from "./instagram-showcase";
import { PromoBanner } from "./promo-banner";

export function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturedProducts />
      <PromoBanner />
      <TrendingCarousel />
      <CategoriesGrid />
      <Testimonials />
      <InstagramShowcase />
      <Newsletter />
    </div>
  );
}
