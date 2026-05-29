import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  image: z.string().optional(),
});

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  fullName: z.string().min(2, "Full name is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export const checkoutSchema = z.object({
  email: z.string().email(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsBilling: z.boolean().default(true),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().optional(),
  costPrice: z.coerce.number().optional(),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.coerce.number().int().nonnegative(),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  brand: z.string().optional(),
  material: z.string().optional(),
  weight: z.coerce.number().optional(),
  dimensions: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code is required"),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number().positive("Discount value must be positive"),
  minOrderAmount: z.coerce.number().optional(),
  maxUses: z.coerce.number().int().optional(),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const pageSchema = z.object({
  title: z.string().min(2, "Page title is required"),
  slug: z.string().min(2, "Page slug is required"),
  content: z.string().min(10, "Content is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type PageInput = z.infer<typeof pageSchema>;
