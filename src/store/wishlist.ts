import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  toggleItem: (productId: string) => void;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (productId) => {
        const has = get().items.includes(productId);
        if (has) {
          set({ items: get().items.filter((id) => id !== productId) });
        } else {
          set({ items: [...get().items, productId] });
        }
      },

      addItem: (productId) => {
        if (!get().items.includes(productId)) {
          set({ items: [...get().items, productId] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },

      hasItem: (productId) => get().items.includes(productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "luxe-wishlist" }
  )
);
