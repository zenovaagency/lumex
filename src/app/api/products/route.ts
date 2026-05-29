import { NextResponse } from "next/server";
import { featuredProducts, categories } from "@/lib/mock-data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "12");

  let items = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    comparePrice: p.comparePrice,
    images: p.images.map((url) => ({ url, alt: p.name })),
    categories: categories
      .filter((c) => c.slug === p.category)
      .map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
    rating: p.rating,
    reviewCount: p.reviewCount,
    isAvailable: true,
    quantity: 10,
    discount: p.comparePrice
      ? Math.round((1 - p.price / p.comparePrice) * 100)
      : null,
    createdAt: new Date(),
  }));

  if (category && category !== "all") {
    items = items.filter((p) =>
      p.categories.some((c) => c.slug === category)
    );
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    default:
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginated = items.slice((page - 1) * pageSize, page * pageSize);

  return NextResponse.json({
    items: paginated,
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  });
}

export async function POST() {
  return NextResponse.json({ success: true }, { status: 201 });
}
