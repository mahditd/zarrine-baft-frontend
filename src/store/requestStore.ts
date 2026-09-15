import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RequestItem = {
  productId: number;
  variantId: number;
  productCode: string;

  productNameFA: string;
  productNameEN: string;

  imageUrl?: string;

  sizeName?: string;
  colorName?: string;

  unitPrice: number;
  quantity: number;
};

type RequestStore = {
  items: RequestItem[];

  addItem: (item: RequestItem) => void;
  removeItem: (variantId: number) => void;
  increaseQuantity: (variantId: number, amount: number) => void;
  decreaseQuantity: (variantId: number, amount: number) => void;
  clear: () => void;
};

export const useRequestStore = create<RequestStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (existing) => existing.variantId === item.variantId,
          );

          if (existingItem) {
            return {
              items: state.items.map((existing) =>
                existing.variantId === item.variantId
                  ? {
                      ...existing,
                      quantity: existing.quantity + item.quantity,
                    }
                  : existing,
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        })),

      increaseQuantity: (variantId, amount) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? {
                  ...item,
                  quantity: item.quantity + amount,
                }
              : item,
          ),
        })),

      decreaseQuantity: (variantId, amount) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.variantId === variantId
              ? {
                  ...item,
                  quantity: Math.max(1, item.quantity - amount),
                }
              : item,
          ),
        })),

      clear: () => set({ items: [] }),
    }),

    {
      name: "zarrine-request-list",
    },
  ),
);
