"use client";

import { use, useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import MenuCard from "@/components/MenuCard";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart-store";

type PageProps = {
  params: Promise<{
    tableNo: string;
  }>;
};

export default function TablePage({
  params,
}: PageProps) {
  const { tableNo } = use(params);

  const [menu, setMenu] = useState<any[]>([]);
  const [category, setCategory] =
    useState("all");

    const items = useCart((state) => state.items);

    const totalQty = items.reduce(
      (total, item) => total + item.quantity,
      0
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menu", {
          cache: "no-store",
        });

        const data = await res.json();

        setMenu(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const filtered =
    category === "all"
      ? menu
      : menu.filter(
          (m) => m.category === category
        );

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Navbar tableNo={tableNo} />

      <section className="bg-gradient-to-br from-black via-zinc-900 to-orange-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-orange-400">
            Digital Restaurant Ordering
          </p>

          <h1 className="mt-3 text-5xl font-black md:text-7xl">
            Table #{tableNo}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-gray-300">
            Order food directly from your
            table with a modern dining
            experience.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {[
              "all",
              "food",
              "drink",
              "dessert",
            ].map((c) => (
              <button
                key={c}
                onClick={() =>
                  setCategory(c)
                }
                className={`rounded-2xl px-5 py-3 font-semibold capitalize transition ${
                  category === c
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <Link
            href={`/table/${tableNo}/cart`}
            className="group relative flex h-14 items-center overflow-hidden rounded-2xl bg-black pl-5 pr-5 text-white shadow-lg transition hover:scale-105 hover:bg-orange-500"
          >
            <div className="relative">
              <ShoppingCart size={24} />
              {totalQty > 0 && (
                <div className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {totalQty}
                </div>
              )}
            </div>
            <div className="ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:ml-3 group-hover:max-w-[200px] group-hover:opacity-100">
              <span className="font-semibold">
                Open Cart
              </span>
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-3xl font-black">
              No Menu Found
            </h2>

            <p className="mt-2 text-gray-500">
              This category has no menu.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}