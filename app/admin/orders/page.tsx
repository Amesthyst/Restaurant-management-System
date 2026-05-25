"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");

        if (!res.ok) {
          console.error("API ERROR:", res.status);
          setOrders([]);
          return;
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : [];

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("FETCH ERROR:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black">
            Restaurant Orders
          </h1>
          <p className="text-gray-500">
            Live table order monitoring
          </p>
        </div>

        <div className="rounded-2xl bg-black px-5 py-3 text-white">
          <p className="text-sm text-gray-300">Total Orders</p>
          <h2 className="text-2xl font-black">{orders.length}</h2>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-60 animate-pulse rounded-3xl bg-white"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center">
          <h2 className="text-2xl font-bold">No Orders Yet</h2>
          <p className="text-gray-500">
            Customer orders will appear here
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-3xl bg-white p-6 shadow-sm"
            >
              {/* TOP */}
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500">Table</p>
                  <h2 className="text-3xl font-black">
                    #{order.tableNo}
                  </h2>
                </div>

                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm text-orange-600">
                  {order.status}
                </span>
              </div>

              {/* TOTAL */}
              <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                <p className="text-gray-500">Total</p>
                <h3 className="text-2xl font-bold">
                  Rp {order.total?.toLocaleString()}
                </h3>
              </div>

              {/* ITEMS */}
              <div className="mt-4 space-y-3">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-gray-50 p-3"
                  >
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    {(item.spicyLevel ||
                      item.sugarLevel ||
                      item.iceLevel) && (
                      <p className="text-xs text-gray-400">
                        {item.spicyLevel &&
                          `Spicy: ${item.spicyLevel} `}
                        {item.sugarLevel &&
                          `Sugar: ${item.sugarLevel} `}
                        {item.iceLevel &&
                          `Ice: ${item.iceLevel}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* TIME */}
              <div className="mt-4 border-t pt-3 text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}