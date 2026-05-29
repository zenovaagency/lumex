import { NextResponse } from "next/server";

const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-A1B2C3D4",
    status: "DELIVERED",
    paymentStatus: "COMPLETED",
    total: 345,
    items: [
      { name: "Premium Cotton Tee", quantity: 2, price: 68 },
      { name: "Leather Crossbody Bag", quantity: 1, price: 189 },
    ],
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "2",
    orderNumber: "ORD-E5F6G7H8",
    status: "SHIPPED",
    paymentStatus: "COMPLETED",
    total: 189,
    items: [{ name: "Minimalist Watch", quantity: 1, price: 189 }],
    createdAt: new Date("2025-12-10"),
  },
];

export async function GET() {
  return NextResponse.json(mockOrders);
}

export async function POST() {
  return NextResponse.json({ success: true });
}
