"use client";

import { useCart } from "@/store/cart-store";

export default function MenuCard({
  item,
  tableNo,
}: {
  item: any;
  tableNo?: string;
}) {
  const addToCart = useCart((state) => state.addToCart);

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE */}
      <div className="h-56 bg-gray-200" />

      {/* CONTENT */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm capitalize text-orange-500">
              {item.category}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {item.name}
            </h2>
          </div>

          {tableNo && (
            <div className="rounded-full bg-black px-3 py-1 text-xs text-white">
              Table {tableNo}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xl font-black">
            Rp {item.price.toLocaleString()}
          </p>

          <button
            onClick={() =>
              addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
              })
            }
            className="rounded-2xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Add Order
          </button>
        </div>
      </div>
    </div>
  );
}