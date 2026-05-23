"use client";

import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">
            Restaurant Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Live table order monitoring
          </p>
        </div>

        <div className="rounded-2xl bg-black px-5 py-3 text-white">
          <p className="text-sm text-gray-300">
            Total Orders
          </p>

          <h2 className="text-2xl font-black">
            {orders.length}
          </h2>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-3xl bg-white"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold">
            No Orders Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Orders from customers will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              {/* TOP */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Table Number
                  </p>

                  <h2 className="mt-1 text-4xl font-black">
                    #{order.tableNo}
                  </h2>
                </div>

                <div
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    order.status === "pending"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {order.status}
                </div>
              </div>

              {/* TOTAL */}
              <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Total Payment
                </p>

                <h3 className="mt-1 text-3xl font-black">
                  Rp {order.total.toLocaleString()}
                </h3>
              </div>

              {/* ITEMS */}
              <div className="mt-6 border-t pt-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">
                    Ordered Items
                  </h3>

                  <p className="text-sm text-gray-500">
                    {order.items?.length || 0} Items
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl bg-gray-50 p-4"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold">
                        Rp{" "}
                        {(
                          item.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FOOTER */}
              <div className="mt-6 flex items-center justify-between border-t pt-5">
                <p className="text-sm text-gray-500">
                  Order Time
                </p>

                <p className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}