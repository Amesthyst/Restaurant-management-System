"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [menu, setMenu] = useState<any[]>([]);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then(setMenu);
  }, []);

  const filtered =
    category === "all"
      ? menu
      : menu.filter((m) => m.category === category);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-bold">🍽 Digital Menu</h1>
      <p className="text-gray-500">Order your favorite food instantly</p>

      {/* CATEGORY FILTER */}
      <div className="flex gap-2 mt-4">
        {["all", "food", "drink", "dessert"].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`btn-soft ${
              category === c ? "bg-black text-white" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {filtered.map((item) => (
          <div key={item.id} className="card">
            <div className="h-32 bg-gray-200 rounded-xl mb-3" />

            <h2 className="font-semibold text-lg">{item.name}</h2>
            <p className="text-gray-500">{item.category}</p>

            <div className="flex justify-between items-center mt-3">
              <span className="font-bold">Rp {item.price}</span>

              <button className="btn-primary">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}