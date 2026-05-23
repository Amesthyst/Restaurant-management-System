import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];

  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;

  totalPrice: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: i.quantity + 1,
                    }
                  : i
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: 1,
              },
            ],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter(
            (i) => i.id !== id
          ),
        })),

      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: i.quantity + 1,
                }
              : i
          ),
        })),

      decreaseQty: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id
                ? {
                    ...i,
                    quantity: i.quantity - 1,
                  }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () =>
        set({
          items: [],
        }),

      totalPrice: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "restaurant-cart",
    }
  )
);