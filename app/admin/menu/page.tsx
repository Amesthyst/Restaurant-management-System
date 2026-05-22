"use client";

import { useEffect, useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export default function MenuAdmin() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });

  // GET MENU
  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error("FETCH_ERROR:", err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // ADD MENU
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          category: form.category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add menu");
        return;
      }

      // reset form
      setForm({ name: "", price: "", category: "" });

      // refresh list
      fetchMenu();
    } catch (err) {
      console.error("SUBMIT_ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Menu Management</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow space-y-3"
      >
        <input
          className="w-full border p-2 rounded"
          placeholder="Menu name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Category (food, drink, dessert)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Menu"}
        </button>
      </form>

      {/* LIST */}
      <div className="mt-6 grid gap-3">
        {menu.length === 0 && (
          <p className="text-gray-500">No menu items yet</p>
        )}

        {menu.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>

            <div className="font-semibold">Rp {item.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}