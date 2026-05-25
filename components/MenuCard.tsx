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
};

export default function MenuCard({
  item,
}: MenuCardProps) {
  const {
    addToCart,
    increaseQty,
    decreaseQty,
    items,
  } = useCart();

  const options = item.template?.options;

  const [selected, setSelected] =
    useState<Record<string, string>>({});

  const [added, setAdded] =
    useState(false);

  // TOTAL CART
  const totalCartItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // CURRENT ITEM INSIDE CART
  const currentItem = items.find(
    (i) => i.id === item.id
  );

  const currentQty =
    currentItem?.quantity || 0;

  const handleSelect = (
    key: string,
    value: string
  ) => {
    setSelected((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAdd = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      options: selected,
    });

    // RESET OPTIONS
    setSelected({});

    // ANIMATION
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1000);
  };

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE */}
      <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300">
        {/* INTERACTIVE HOVER CART */}
        <div className="absolute right-4 top-4">
          {currentQty > 0 && (
            <div className="group/cart flex items-center overflow-hidden rounded-full bg-black text-white shadow-lg transition-all duration-300 hover:pr-2">
              
              {/* CART ICON */}
              <div className="flex items-center gap-2 px-3 py-2">
                <ShoppingCart size={16} />

                <span className="text-sm font-bold">
                  {currentQty}
                </span>
              </div>

              {/* HOVER CONTROLS */}
              <div className="flex max-w-0 items-center gap-1 overflow-hidden transition-all duration-300 group-hover/cart:max-w-[120px]">
                
                {/* DECREASE */}
                <button
                  onClick={() =>
                    decreaseQty(item.id)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* INCREASE */}
                <button
                  onClick={() =>
                    increaseQty(item.id)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* CATEGORY */}
        <p className="text-sm font-semibold capitalize text-orange-500">
          {item.category}
        </p>

        {/* NAME */}
        <h2 className="mt-1 text-2xl font-black">
          {item.name}
        </h2>

        {/* DESCRIPTION */}
        {item.description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            {item.description}
          </p>
        )}

        {/* OPTIONS */}
        <div className="mt-4 space-y-3">
          {/* SPICY */}
          {options?.spicy && (
            <select
              value={
                selected.spicy || ""
              }
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-black"
              onChange={(e) =>
                handleSelect(
                  "spicy",
                  e.target.value
                )
              }
            >
              <option value="">
                Choose Spicy Level
              </option>

              {options.spicy.map((v) => (
                <option
                  key={v}
                  value={v}
                >
                  {v}
                </option>
              ))}
            </select>
          )}

          {/* SUGAR */}
          {options?.sugar && (
            <select
              value={
                selected.sugar || ""
              }
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-black"
              onChange={(e) =>
                handleSelect(
                  "sugar",
                  e.target.value
                )
              }
            >
              <option value="">
                Choose Sugar Level
              </option>

              {options.sugar.map((v) => (
                <option
                  key={v}
                  value={v}
                >
                  {v}
                </option>
              ))}
            </select>
          )}

          {/* ICE */}
          {options?.ice && (
            <select
              value={
                selected.ice || ""
              }
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-black"
              onChange={(e) =>
                handleSelect(
                  "ice",
                  e.target.value
                )
              }
            >
              <option value="">
                Choose Ice Level
              </option>

              {options.ice.map((v) => (
                <option
                  key={v}
                  value={v}
                >
                  {v}
                </option>
              ))}
            </select>
          )}

          {/* SIZE */}
          {options?.size && (
            <select
              value={
                selected.size || ""
              }
              className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-black"
              onChange={(e) =>
                handleSelect(
                  "size",
                  e.target.value
                )
              }
            >
              <option value="">
                Choose Size
              </option>

              {options.size.map((v) => (
                <option
                  key={v}
                  value={v}
                >
                  {v}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Starting From
            </p>

            <p className="text-2xl font-black">
              Rp{" "}
              {item.price.toLocaleString()}
            </p>
          </div>

          <button
            onClick={handleAdd}
            className={`rounded-2xl px-5 py-3 font-semibold text-white transition ${
              added
                ? "bg-green-500"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {added
              ? "Added ✓"
              : "Add Order"}
          </button>
        </div>
      </div>
    </div>
  );
}