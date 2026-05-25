"use client";

import { use } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/store/cart-store";

export default function CartPage({
  params,
}: {
  params: Promise<{ tableNo: string }>;
}) {
  const { tableNo } = use(params); // ✅ REQUIRED IN NEXT 15

  const {
    items,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  const handleCheckout = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableNo,
        total: totalPrice(),
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
        <h1 className="text-4xl font-bold">Cart</h1>

        {items.length === 0 ? (
          <p className="mt-6 text-gray-500">Cart is empty</p>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="mt-4 rounded-xl bg-white p-4">
                <h2 className="font-bold">{item.name}</h2>
                <p>Rp {item.price.toLocaleString()}</p>

                <div className="mt-2 flex gap-3">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                  <button onClick={() => removeFromCart(item.id)}>
                    remove
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 rounded-xl bg-black p-6 text-white">
              <h2 className="text-2xl">
                Total: Rp {totalPrice().toLocaleString()}
              </h2>

              <button
                onClick={handleCheckout}
                className="mt-4 w-full bg-white p-2 text-black"
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