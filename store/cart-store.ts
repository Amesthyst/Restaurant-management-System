import { create } from "zustand";

export const useCart = create((set: any) => ({
  items: [],
  add: (item: any) =>
    set((state: any) => ({
      items: [...state.items, item],
    })),
}));