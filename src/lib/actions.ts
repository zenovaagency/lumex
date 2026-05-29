"use server";

import { revalidatePath } from "next/cache";

export async function createProduct(_formData: FormData) {
  return { success: true };
}

export async function deleteProduct(_id: string) {
  return { success: true };
}

export async function updateOrderStatus(
  _orderId: string,
  _status: string
) {
  return { success: true };
}

export async function subscribeToNewsletter(_email: string) {
  return { success: true };
}

export async function addReview(
  _productId: string,
  _data: { rating: number; title?: string; comment: string }
) {
  return { success: true };
}
