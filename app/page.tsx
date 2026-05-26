"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import MenuCard from "@/components/MenuCard";

export default function Home() {
  const [menu, setMenu] = useState<any[]>([]);
  const [category, setCategory] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [showTableModal, setShowTableModal] =
    useState(false);

  const [tableInput, setTableInput] =
    useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(
          "/api/menu"
        );

        const data = await res.json();

        setMenu(
          Array.isArray(data)
            ? data
            : []
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
          (m) =>
            m.category === category
        );

  const handleTableSubmit = () => {
    if (!tableInput) return;

    router.push(
      `/table/${tableInput}`
    );

    setShowTableModal(false);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <section className="relative overflow-hidden bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-orange-400">
              Welcome to Our Restaurant
            </p>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              Smart Digital Menu &
              Table Ordering
            </h1>

            <p className="mt-6 text-lg text-gray-300">
              Browse our menu, order
              directly from your table,
              and enjoy a modern dining
              experience.
            </p>

            <button
              onClick={() =>
                setShowTableModal(
                  true
                )
              }
              className="mt-8 rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-orange-600"
            >
              Start Ordering
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
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
              className={`rounded-2xl px-5 py-3 font-medium capitalize transition-all duration-300 ${
                category === c
                  ? "bg-black text-white shadow-lg"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {c}
            </button>
          ))}
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
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                allowOrder={false}
              />
            ))}
          </div>
        )}
      </section>

      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-black">
                  Enter Table Number
                </h2>

                <p className="mt-2 text-gray-500">
                  Scan QR or input your
                  table number
                </p>
              </div>

              <button
                onClick={() =>
                  setShowTableModal(
                    false
                  )
                }
                className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <input
              type="number"
              placeholder="Example: 12"
              value={tableInput}
              onChange={(e) =>
                setTableInput(
                  e.target.value
                )
              }
              className="mt-6 w-full rounded-2xl border p-4 text-lg outline-none transition focus:border-black"
            />
            <button
              onClick={
                handleTableSubmit
              }
              className="mt-6 w-full rounded-2xl bg-black py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-[1.02]"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}