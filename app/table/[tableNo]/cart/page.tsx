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

  const subtotal = totalPrice();

  const tax = subtotal * 0.11;

  const finalTotal = subtotal + tax;

  const handleCheckout = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        tableNo,
        subtotal,
        tax,
        total: finalTotal,
        items,
      }),
    });

    if (res.ok) {
      clearCart();
      alert("Order placed!");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar tableNo={tableNo} />

      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-4xl font-bold">
          Cart
        </h1>

        {items.length === 0 ? (
          <p className="mt-6 text-gray-500">
            Cart is empty
          </p>
        ) : (
          <>
            {items.map((item) => (
              <div
                key={item.id}
                className="mt-4 rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-gray-500">
                      Rp{" "}
                      {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      Rp{" "}
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() =>
                      decreaseQty(item.id)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl"
                  >
                    -
                  </button>

                  <span className="min-w-[20px] text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(item.id)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xl text-white"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="ml-auto rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-8 rounded-3xl bg-black p-6 text-white">
              <h2 className="text-3xl font-black">
                Payment Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-300">
                    Item Price
                  </p>

                  <p className="font-semibold">
                    Rp{" "}
                    {subtotal.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-300">
                    Tax 11%
                  </p>

                  <p className="font-semibold">
                    Rp{" "}
                    {tax.toLocaleString()}
                  </p>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold">
                      Total
                    </p>

                    <p className="text-2xl font-black">
                      Rp{" "}
                      {finalTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full rounded-2xl bg-white p-4 text-lg font-bold text-black transition hover:scale-[1.02]"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}