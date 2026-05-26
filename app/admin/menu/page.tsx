"use client";

import { useEffect, useState } from "react";

export default function MenuAdmin() {
  const [menu, setMenu] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<File | null>(
    null
  );

  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState<
    string | null
  >(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    costPrice: "",
    category: "",
    templateId: "",
    image: "",
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

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      price: "",
      costPrice: "",
      category: "",
      templateId: "",
      image: "",
    });

    setImage(null);
    setPreview("");

    const fileInput =
      document.getElementById(
        "imageInput"
      ) as HTMLInputElement;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      let imageUrl = form.image || "";

      if (image) {
        const formData = new FormData();

        formData.append("file", image);

        const uploadRes = await fetch(
          "/api/menu/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData =
          await uploadRes.json();

        if (!uploadRes.ok) {
          alert("Image upload failed");

          setLoading(false);
          return;
        }

        imageUrl = uploadData.url;
      }

      if (editingId) {
        const res = await fetch(
          `/api/menu/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ...form,
              price: Number(form.price),
              costPrice: Number(
                form.costPrice
              ),

              image: imageUrl,
            }),
          }
        );

        if (!res.ok) {
          alert("Update failed");
          setLoading(false);
          return;
        }

        alert("Menu updated");
      }

      else {
        const res = await fetch(
          "/api/menu",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              ...form,
              price: Number(form.price),
              costPrice: Number(
                form.costPrice
              ),
              image: imageUrl,
            }),
          }
        );

        if (!res.ok) {
          alert("Create failed");
          setLoading(false);
          return;
        }

        alert("Menu created");
      }

      await fetchMenu();

      resetForm();
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    }

    setLoading(false);
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete = confirm(
      "Delete this menu?"
    );

    if (!confirmDelete) return;

    await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });

    fetchMenu();
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      description:
        item.description || "",
      price: item.price?.toString() || "",
      costPrice:
        item.costPrice?.toString() || "",
      category: item.category || "",
      templateId:
        item.templateId || "",
      image: item.image || "",
    });

    setPreview(item.image || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">
            Menu Management
          </h1>

          <p className="text-gray-500">
            Create and manage restaurant menu
          </p>
        </div>

        {editingId && (
          <button
            onClick={resetForm}
            className="rounded-xl bg-gray-200 px-4 py-2"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-3xl bg-white p-6 shadow-sm"
      >
        <input
          className="w-full rounded-xl border p-3"
          placeholder="Menu name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <textarea
          className="w-full rounded-xl border p-3"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <input
          type="number"
          className="w-full rounded-xl border p-3"
          placeholder="Selling price"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
        />

        <input
          type="number"
          className="w-full rounded-xl border p-3"
          placeholder="Cost price"
          value={form.costPrice}
          onChange={(e) =>
            setForm({
              ...form,
              costPrice:
                e.target.value,
            })
          }
        />

        <select
          className="w-full rounded-xl border p-3"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category:
                e.target.value,
            })
          }
        >
          <option value="">
            Choose category
          </option>

          <option value="food">
            Food
          </option>

          <option value="drink">
            Drink
          </option>

          <option value="dessert">
            Dessert
          </option>
        </select>

        <select
          className="w-full rounded-xl border p-3"
          value={form.templateId}
          onChange={(e) =>
            setForm({
              ...form,
              templateId:
                e.target.value,
            })
          }
        >
          <option value="">
            No Template
          </option>

          {templates.map((t: any) => (
            <option
              key={t.id}
              value={t.id}
            >
              {t.label}
            </option>
          ))}
        </select>

        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (!file) return;

            setImage(file);

            setPreview(
              URL.createObjectURL(file)
            );
          }}
        />

        {preview && (
          <img
            src={preview}
            className="h-32 w-32 rounded-xl object-cover"
          />
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-black p-3 text-white disabled:opacity-50"
        >
          {loading
            ? "Loading..."
            : editingId
            ? "Update Menu"
            : "Create Menu"}
        </button>
      </form>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menu.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-white p-4 shadow-sm"
          >
            {item.image && (
              <img
                src={item.image}
                className="h-48 w-full rounded-2xl object-cover"
              />
            )}

            <div className="mt-4">
              <h2 className="text-2xl font-black">
                {item.name}
              </h2>

              <p className="mt-1 text-gray-500">
                {item.description}
              </p>

              <div className="mt-4 space-y-1">
                <p className="font-bold">
                  Sell Price:
                  Rp{" "}
                  {item.price?.toLocaleString()}
                </p>

                <p className="text-sm text-gray-500">
                  Cost Price:
                  Rp{" "}
                  {item.costPrice?.toLocaleString()}
                </p>

                <p className="text-sm text-green-600">
                  Profit:
                  Rp{" "}
                  {(
                    item.price -
                    item.costPrice
                  )?.toLocaleString()}
                </p>

                <p className="text-sm text-gray-400">
                  Category:
                  {item.category}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() =>
                  handleEdit(item)
                }
                className="flex-1 rounded-xl bg-blue-500 py-2 text-white"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(item.id)
                }
                className="flex-1 rounded-xl bg-red-500 py-2 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}