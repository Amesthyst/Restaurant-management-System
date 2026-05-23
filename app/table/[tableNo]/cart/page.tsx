"use client";

import { use } from "react";

import Navbar from "@/components/Navbar";
import { useCart } from "@/store/cart-store";

export default function CartPage({
  params,
}: {
  params: Promise<{ tableNo: string }>;
}) {
  const { tableNo } = use(params);

  const {
    items,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tableNo,
          total: totalPrice(),
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);

        alert(data.error || "Checkout failed");
        return;
      }

      clearCart();

      alert("Order placed successfully");

      window.location.href = `/table/${tableNo}`;
    } catch (error) {
      console.error(error);

      alert("Checkout error");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar tableNo={tableNo} />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-5xl font-black">
            Your Cart
          </h1>

          <p className="mt-2 text-gray-500">
            Review your order before checkout
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold">
              Cart is Empty
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-gray-500">
                      Rp {item.price.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() =>
                      decreaseQty(item.id)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                  >
                    -
                  </button>

                  <span className="font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(item.id)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="rounded-3xl bg-black p-6 text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg">
                  Total Payment
                </p>

                <h2 className="text-4xl font-black">
                  Rp {totalPrice().toLocaleString()}
                </h2>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full rounded-2xl bg-white py-4 font-bold text-black transition hover:bg-gray-200"
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}