"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart-store";

export default function Navbar({
  tableNo,
}: {
  tableNo?: string;
}) {
  const items = useCart((state) => state.items);

  const totalItems = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-black"
        >
          🍽 Restaurant
        </Link>

        <div className="flex items-center gap-4">
          {tableNo && (
            <div className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
              Table {tableNo}
            </div>
          )}

          {tableNo && (
            <Link
              href={`/table/${tableNo}/cart`}
              className="relative rounded-2xl bg-black p-3 text-white"
            >
              <ShoppingBag size={20} />

              {totalItems > 0 && (
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {totalItems}
                </div>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}