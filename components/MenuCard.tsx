"use client";

import { useState } from "react";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useCart } from "@/store/cart-store";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;

  template?: {
    options: {
      spicy?: string[];
      sugar?: string[];
      ice?: string[];
      size?: string[];
    };
  };
};

type MenuCardProps = {
  item: MenuItem;
  allowOrder?: boolean; // 👈 NEW
};

export default function MenuCard({
  item,
  allowOrder = true,
}: MenuCardProps) {
  const { addToCart, increaseQty, decreaseQty, items } =
    useCart();

  const options = item.template?.options;

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  const currentItem = items.find((i) => i.id === item.id);
  const currentQty = currentItem?.quantity || 0;

  const handleSelect = (key: string, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAdd = () => {
    if (!allowOrder) return;

    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      options: selected,
    });

    setSelected({});
    setAdded(true);

    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl">

      <div className="relative h-56 overflow-hidden bg-zinc-200">
        {item.image ? (
          <img
            src={item.image}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}

        {allowOrder && currentQty > 0 && (
          <div className="absolute right-4 top-4">
            <div className="flex items-center gap-2 rounded-full bg-black px-3 py-2 text-white">
              <ShoppingCart size={16} />
              <span>{currentQty}</span>

              <button onClick={() => decreaseQty(item.id)}>
                <ChevronLeft size={14} />
              </button>

              <button onClick={() => increaseQty(item.id)}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="text-sm font-semibold text-orange-500">
          {item.category}
        </p>

        <h2 className="mt-1 text-2xl font-black">{item.name}</h2>

        {item.description && (
          <p className="mt-2 text-sm text-gray-500">
            {item.description}
          </p>
        )}

        {allowOrder && (
          <div className="mt-4 space-y-3">
            {options?.spicy && (
              <select
                onChange={(e) => handleSelect("spicy", e.target.value)}
                className="w-full rounded-xl border p-2"
              >
                <option value="">Spicy Level</option>
                {options.spicy.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            )}

            {options?.sugar && (
              <select
                onChange={(e) => handleSelect("sugar", e.target.value)}
                className="w-full rounded-xl border p-2"
              >
                <option value="">Sugar Level</option>
                {options.sugar.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            )}

            {options?.ice && (
              <select
                onChange={(e) => handleSelect("ice", e.target.value)}
                className="w-full rounded-xl border p-2"
              >
                <option value="">Ice Level</option>
                {options.ice.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            )}

            {options?.size && (
              <select
                onChange={(e) => handleSelect("size", e.target.value)}
                className="w-full rounded-xl border p-2"
              >
                <option value="">Size</option>
                {options.size.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xl font-bold">
            Rp {item.price.toLocaleString()}
          </p>

          {allowOrder ? (
            <button
              onClick={handleAdd}
              className={`rounded-2xl px-5 py-3 font-semibold text-white ${
                added
                  ? "bg-green-500"
                  : "bg-black hover:bg-orange-500"
              }`}
            >
              {added ? "Added ✓" : "Add Order"}
            </button>
          ) : (
            <button
              disabled
              className="rounded-2xl bg-gray-300 px-5 py-3 font-semibold text-gray-600"
            >
              View Only
            </button>
          )}
        </div>
      </div>
    </div>
  );
}