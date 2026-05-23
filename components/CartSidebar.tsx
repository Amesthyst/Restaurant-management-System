"use client";

import { useCart } from "@/store/cart-store";

export default function CartSidebar({
  tableNo,
}: {
  tableNo?: string;
}) {
  const {
    items,
    removeFromCart,
    increaseQty,
    decreaseQty,
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

      if (!res.ok) {
        alert("Checkout failed");
        return;
      }

      clearCart();

      alert("Order placed successfully");
    } catch (error) {
      console.error(error);
      alert("Checkout error");
    }
  };

  return (
    <div className="sticky top-6 rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">
          Your Order
        </h2>

        {tableNo && (
          <div className="rounded-full bg-black px-3 py-1 text-xs text-white">
            Table {tableNo}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {items.length === 0 && (
          <p className="text-sm text-gray-500">
            No items added yet.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-100 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Rp {item.price.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => decreaseQty(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
              >
                -
              </button>

              <span className="font-semibold">
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQty(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-500">Total</p>

          <h3 className="text-2xl font-black">
            Rp {totalPrice().toLocaleString()}
          </h3>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-5 w-full rounded-2xl bg-black py-4 font-semibold text-white transition hover:bg-gray-800"
        >
          Checkout Order
        </button>
      </div>
    </div>
  );
}