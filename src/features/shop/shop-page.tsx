"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { Button, Input, Badge } from "@/components/ui";
import { ProductCard } from "@/features/products/product-card";
import { featuredProducts } from "@/lib/mock-data";
import {
  SORT_OPTIONS,
  PRICE_RANGES,
  ITEMS_PER_PAGE,
} from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface ShopPageProps {
  searchParams?: { search?: string; category?: string; sort?: string };
}

export function ShopPage({ searchParams }: ShopPageProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState(searchParams?.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.category || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams?.sort || "newest");
  const [priceRange, setPriceRange] = useState<{ min: number; max?: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { id: "all", name: "All Products" },
    { id: "clothing", name: "Clothing" },
    { id: "accessories", name: "Accessories" },
    { id: "home-living", name: "Home & Living" },
    { id: "footwear", name: "Footwear" },
    { id: "bags", name: "Bags" },
  ];

  const filteredProducts = useMemo(() => {
    let products = [...featuredProducts];
    if (search) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }
    if (priceRange) {
      products = products.filter((p) => {
        if (priceRange.max) return p.price >= priceRange.min && p.price <= priceRange.max;
        return p.price >= priceRange.min;
      });
    }
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        products.sort(
          (a, b) =>
            new Date(b.isNew ? 1 : 0).getTime() -
            new Date(a.isNew ? 1 : 0).getTime()
        );
    }
    return products;
  }, [search, selectedCategory, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setPriceRange(
                  priceRange?.min === range.min && priceRange?.max === range.max
                    ? null
                    : { min: range.min, max: range.max }
                );
                setCurrentPage(1);
              }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                priceRange?.min === range.min && priceRange?.max === range.max
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Shop Collection
        </h1>
        <p className="mt-2 text-muted-foreground">
          Showing {filteredProducts.length} products
        </p>
      </motion.div>

      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 lg:hidden"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>

        <div className="relative flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="hidden items-center gap-1 sm:flex">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {(search || selectedCategory !== "all" || priceRange) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="gap-1">
              Search: {search}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} />
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.id === selectedCategory)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedCategory("all")}
              />
            </Badge>
          )}
          {priceRange && (
            <Badge variant="secondary" className="gap-1">
              {PRICE_RANGES.find(
                (r) => r.min === priceRange.min && r.max === priceRange.max
              )?.label || "Custom"}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setPriceRange(null)}
              />
            </Badge>
          )}
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <FilterSidebar />
        </aside>

        <AnimatePresence mode="wait">
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsFilterOpen(false)}
              />
              <motion.div className="absolute left-0 top-0 h-full w-80 bg-background p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <FilterSidebar />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1">
          {paginatedProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-2xl bg-muted p-8">
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setPriceRange(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="h-10 w-10 rounded-xl"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
