import { create } from "zustand";
import { persist } from "zustand/middleware";

type TableStore = {
  tableNo: string | null;
  setTable: (tableNo: string) => void;
  clearTable: () => void;
};

export const useTable = create<TableStore>()(
  persist(
    (set) => ({
      tableNo: null,
      setTable: (tableNo) => set({ tableNo }),
      clearTable: () => set({ tableNo: null }),
    }),
    {
      name: "restaurant-table",
    }
  )
);