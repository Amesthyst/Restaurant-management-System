"use client";

import { useEffect, useState } from "react";

export default function MenuAdmin() {
  const [menu, setMenu] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    templateId: "",
  });

  const fetchMenu = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setMenu(Array.isArray(data) ? data : []);
  };

  const fetchTemplates = async () => {
    const res = await fetch("/api/templates");
    const data = await res.json();
    setTemplates(data);
  };

  useEffect(() => {
    fetchMenu();
    fetchTemplates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      templateId: "",
    });

    fetchMenu();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });

    fetchMenu();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black">
        Menu Management
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-3 rounded-2xl bg-white p-4"
      >
        {/* NAME */}
        <input
          className="w-full border p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        {/* DESCRIPTION */}
        <textarea
          className="w-full border p-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        {/* PRICE */}
        <input
          type="number"
          className="w-full border p-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
        />

        {/* CATEGORY DROPDOWN */}
        <select
          className="w-full border p-2"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
          >
          <option value="" disabled>
            Choose category
          </option>
          <option value="food">Food</option>
          <option value="drink">Drink</option>
          <option value="dessert">Dessert</option>
        </select>

        {/* TEMPLATE DROPDOWN */}
        <select
          className="w-full border p-2"
          value={form.templateId}
          onChange={(e) =>
            setForm({
              ...form,
              templateId: e.target.value,
            })
          }
        >
          <option value="">
            No Template
          </option>

          {templates.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        <button className="w-full bg-black p-2 text-white">
          {loading
            ? "Loading..."
            : "Create Menu"}
        </button>
      </form>

      {/* LIST */}
      <div className="mt-6 space-y-3">
        {menu.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-white p-4"
          >
            <h2 className="text-xl font-bold">
              {item.name}
            </h2>

            <p className="text-gray-500">
              {item.description}
            </p>

            <p className="font-semibold">
              Rp {item.price}
            </p>

            <p className="text-sm text-gray-400">
              Category: {item.category}
            </p>

            <button
              onClick={() =>
                handleDelete(item.id)
              }
              className="mt-2 rounded bg-red-500 px-3 py-1 text-white"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}