"use client";

import { use, useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import MenuCard from "@/components/MenuCard";

export default function TablePage({
  params,
}: {
  params: Promise<{ tableNo: string }>;
}) {
  const { tableNo } = use(params);

  const [menu, setMenu] = useState<any[]>([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();

        setMenu(Array.isArray(data) ? data : []);
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
      : menu.filter((m) => m.category === category);

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* NAVBAR */}
      <Navbar tableNo={tableNo} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-orange-400">
              Table Session Active
            </p>

            <h1 className="mt-3 text-5xl font-black md:text-7xl">
              Table #{tableNo}
            </h1>

            <p className="mt-5 text-lg text-gray-300">
              Browse menu and order directly from your table.
            </p>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* CATEGORY FILTER */}
        <div className="flex flex-wrap gap-3">
          {["all", "food", "drink", "dessert"].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-2xl px-5 py-3 font-medium capitalize transition ${
                category === c
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        ) : (
          <>
            {/* EMPTY */}
            {filtered.length === 0 ? (
              <div className="mt-12 rounded-3xl bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-bold">
                  No Menu Found
                </h2>

                <p className="mt-2 text-gray-500">
                  No items available in this category.
                </p>
              </div>
            ) : (
              /* MENU GRID */
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    tableNo={tableNo}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}