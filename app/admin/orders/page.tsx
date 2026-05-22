"use client";

import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Orders</h1>

      <div className="mt-4 space-y-3">
        {orders.map((o: any) => (
          <div key={o.id} className="card flex justify-between">
            <div>
              <p className="font-semibold">Table #{o.tableNo}</p>
              <p className="text-sm text-gray-500">{o.status}</p>
            </div>

            <div className="font-bold">Rp {o.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
}