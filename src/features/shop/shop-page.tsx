"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, X, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button, Input, Badge, Switch, Label } from "@/components/ui";
import { ProductCard } from "@/features/products/product-card";
import { featuredProducts } from "@/lib/mock-data";
import {
  SORT_OPTIONS,
  PRICE_RANGES,
  ITEMS_PER_PAGE,
  BRANDS,
  RATINGS,
} from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export function ShopPage() {
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [priceRange, setPriceRange] = useState<{ min: number; max?: number } | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const [onSale, setOnSale] = useState(false);
  const [newArrivals, setNewArrivals] = useState(false);
  const [trending, setTrending] = useState(false);
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
    if (rating !== null) {
      products = products.filter((p) => p.rating >= rating);
    }
    if (brand) {
      products = products.filter((p) => p.brand === brand);
    }
    if (onSale) {
      products = products.filter((p) => p.comparePrice !== null);
    }
    if (newArrivals) {
      products = products.filter((p) => p.isNew);
    }
    if (trending) {
      products = products.filter((p) => p.isTrending);
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
  }, [search, selectedCategory, priceRange, rating, brand, onSale, newArrivals, trending, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (priceRange ? 1 : 0) +
    (search ? 1 : 0) +
    (rating !== null ? 1 : 0) +
    (brand ? 1 : 0) +
    (onSale ? 1 : 0) +
    (newArrivals ? 1 : 0) +
    (trending ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold">Categories</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={cn(
                "block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold">Price Range</h3>
        <div className="space-y-1">
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
              className={cn(
                "block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                priceRange?.min === range.min && priceRange?.max === range.max
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold">Rating</h3>
        <div className="space-y-1">
          {RATINGS.filter((r) => r < 5).map((stars) => (
            <button
              key={stars}
              onClick={() => {
                setRating(rating === stars ? null : stars);
                setCurrentPage(1);
              }}
              className={cn(
                "block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                rating === stars
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="inline-flex items-center gap-1">
                {stars}
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-muted-foreground/60">& Up</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold">Brand</h3>
        <div className="space-y-1">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => {
                setBrand(brand === b ? null : b);
                setCurrentPage(1);
              }}
              className={cn(
                "block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                brand === b
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold">Other</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm cursor-pointer">On Sale</Label>
            <Switch checked={onSale} onCheckedChange={setOnSale} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm cursor-pointer">New Arrivals</Label>
            <Switch checked={newArrivals} onCheckedChange={setNewArrivals} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm cursor-pointer">Trending</Label>
            <Switch checked={trending} onCheckedChange={setTrending} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Shop Collection
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </motion.div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative order-2 sm:order-1 sm:flex-1 sm:max-w-md">
          <Input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 sm:h-10"
          />
        </div>

        <div className="order-1 flex items-center gap-3 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 flex-1 sm:flex-none lg:hidden",
              activeFilterCount > 0 && "border-primary text-primary"
            )}
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sm:hidden">Filters</span>
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1 sm:w-[180px]">
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
      </div>

      {(search || selectedCategory !== "all" || priceRange || rating !== null || brand || onSale || newArrivals || trending) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              <span className="truncate max-w-[120px] sm:max-w-none">{search}</span>
              <button
                onClick={() => setSearch("")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
              <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              {categories.find((c) => c.id === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory("all")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
              <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {priceRange && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              {PRICE_RANGES.find(
                (r) => r.min === priceRange.min && r.max === priceRange.max
              )?.label || "Custom"}
              <button
                onClick={() => setPriceRange(null)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
              <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {rating !== null && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              <span className="inline-flex items-center gap-1">
                {rating}<Star className="h-3 w-3 fill-current" />& Up
              </span>
              <button
                onClick={() => setRating(null)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
              <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {brand && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              {brand}
              <button
                onClick={() => setBrand(null)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
              <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {onSale && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              On Sale
              <button
                onClick={() => setOnSale(false)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
              <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {newArrivals && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              New Arrivals
              <button
                onClick={() => setNewArrivals(false)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
              <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {trending && (
            <Badge variant="secondary" className="gap-1 pr-1.5">
              Trending
              <button
                onClick={() => setTrending(false)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
              <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <FilterSidebar />
        </aside>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsFilterOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute left-0 top-0 flex h-full w-[85vw] max-w-sm flex-col bg-background shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
                  <h2 className="text-base font-semibold">
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({activeFilterCount} active)
                      </span>
                    )}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFilterOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-6">
                  <FilterSidebar />
                </div>
                <div className="border-t border-border/40 px-5 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory("all");
                      setPriceRange(null);
                      setRating(null);
                      setBrand(null);
                      setOnSale(false);
                      setNewArrivals(false);
                      setTrending(false);
                      setSearch("");
                      setIsFilterOpen(false);
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          {paginatedProducts.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              <div className="rounded-2xl bg-muted p-6 sm:p-8">
                <h3 className="text-lg font-semibold sm:text-xl">No products found</h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setPriceRange(null);
                    setRating(null);
                    setBrand(null);
                    setOnSale(false);
                    setNewArrivals(false);
                    setTrending(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 sm:mt-12 flex items-center justify-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 rounded-xl sm:h-10 sm:w-10"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .map((page, idx, arr) => {
                  const showGap = idx > 0 && page - arr[idx - 1] > 1;
                  return (
                    <div key={page} className="flex items-center gap-1 sm:gap-2">
                      {showGap && (
                        <span className="px-1 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="h-9 w-9 rounded-xl text-sm sm:h-10 sm:w-10"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 rounded-xl sm:h-10 sm:w-10"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
