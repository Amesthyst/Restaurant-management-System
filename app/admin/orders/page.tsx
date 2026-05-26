"use client";

import { useEffect, useState } from "react";

import {
  Clock3,
  CheckCircle2,
  CookingPot,
  Trash2,
  X,
  Circle,
} from "lucide-react";

type ItemStatus =
  | "normal"
  | "done"
  | "cancelled";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;

  spicyLevel?: string;
  sugarLevel?: string;
  iceLevel?: string;

  itemStatus?: ItemStatus;
};

type Order = {
  id: string;
  tableNo: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] =
    useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");

      const data = await res.json();

      if (!Array.isArray(data)) {
        setOrders([]);
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
          icon: <CheckCircle2 size={16} />,
        };

      case "preparing":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: <CookingPot size={16} />,
        };

      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
          icon: <X size={16} />,
        };

      default:
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: <Clock3 size={16} />,
        };
    }
  };


  const calculateOrderStatus = (
    items: OrderItem[]
  ) => {
    const doneCount = items.filter(
      (i) => i.itemStatus === "done"
    ).length;
  
    const cancelledCount = items.filter(
      (i) => i.itemStatus === "cancelled"
    ).length;
  
    const normalCount = items.filter(
      (i) => i.itemStatus === "normal"
    ).length;
  
    if (doneCount === items.length) {
      return "completed";
    }
  
    if (
      cancelledCount === items.length
    ) {
      return "cancelled";
    }
  
    if (normalCount === items.length) {
      return "pending";
    } 
    
    if (
      doneCount > 0 &&
      normalCount === 0
    ) {
      return "completed";
    } 
    return "preparing";
  };

  const toggleItemStatus = async (
    orderId: string,
    itemId: string
  ) => {
    let updatedOrder: Order | undefined;
  
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) {
          return order;
        }
  
        const updatedItems: OrderItem[] =
          order.items.map((item) => {
            if (item.id !== itemId) {
              return item;
            }
  
            let next: ItemStatus =
              "normal";
  
            if (
              item.itemStatus ===
              "normal"
            ) {
              next = "done";
            } else if (
              item.itemStatus === "done"
            ) {
              next = "cancelled";
            } else {
              next = "normal";
            }
  
            return {
              ...item,
              itemStatus: next,
            };
          });
  
        const newStatus =
          calculateOrderStatus(
            updatedItems
          );
  
        const newOrder: Order = {
          ...order,
          status: newStatus,
          items: updatedItems,
        };
  
        updatedOrder = newOrder;
  
        return newOrder;
      })
    );
  
    if (updatedOrder) {
      try {
        await fetch(
          `/api/orders/${orderId}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              status:
                updatedOrder.status,
              items:
                updatedOrder.items,
            }),
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteOrder = async (
    id: string
  ) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      setOrders((prev) =>
        prev.filter(
          (order) => order.id !== id
        )
      );

      setDeleteModal(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black">
            Restaurant Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Smart kitchen order monitoring
          </p>
        </div>

        <div className="rounded-3xl bg-black px-6 py-4 text-white shadow-xl">
          <p className="text-sm text-gray-300">
            Active Orders
          </p>

          <h2 className="mt-1 text-4xl font-black">
            {orders.length}
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-3xl bg-white"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl bg-white p-16 text-center">
          <h2 className="text-3xl font-black">
            No Orders
          </h2>

          <p className="mt-2 text-gray-500">
            Orders will appear here
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {orders.map((order) => {
            const badge =
              getStatusStyle(
                order.status
              );

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="border-b p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-400">
                        Table
                      </p>

                      <h2 className="text-5xl font-black">
                        #{order.tableNo}
                      </h2>
                    </div>

                    <div
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold capitalize shadow-sm ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.icon}
                      {order.status}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-gray-50 p-5">
                    <p className="text-sm text-gray-400">
                      Total
                    </p>

                    <h3 className="mt-1 text-3xl font-black">
                      Rp{" "}
                      {order.total.toLocaleString()}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 p-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        toggleItemStatus(
                          order.id,
                          item.id
                        )
                      }
                      className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.01] ${
                        item.itemStatus ===
                        "done"
                          ? "border-green-300 bg-green-50"
                          : item.itemStatus ===
                            "cancelled"
                          ? "border-red-300 bg-red-50"
                          : "border-gray-100 bg-gray-50 hover:border-black"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className={`text-lg font-bold transition-all ${
                              item.itemStatus ===
                              "done"
                                ? "text-green-700 line-through"
                                : item.itemStatus ===
                                  "cancelled"
                                ? "text-red-600 line-through"
                                : ""
                            }`}
                          >
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Qty:{" "}
                            {item.quantity}
                          </p>

                          {(item.spicyLevel ||
                            item.sugarLevel ||
                            item.iceLevel) && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.spicyLevel && (
                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                                  🌶{" "}
                                  {
                                    item.spicyLevel
                                  }
                                </span>
                              )}

                              {item.sugarLevel && (
                                <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-600">
                                  🍬{" "}
                                  {
                                    item.sugarLevel
                                  }
                                </span>
                              )}

                              {item.iceLevel && (
                                <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-600">
                                  ❄{" "}
                                  {item.iceLevel}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div>
                          {item.itemStatus ===
                          "done" ? (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                              <CheckCircle2
                                size={20}
                              />
                            </div>
                          ) : item.itemStatus ===
                            "cancelled" ? (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                              <X size={20} />
                            </div>
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                              <Circle
                                size={18}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t px-6 py-4">
                  <p className="text-sm text-gray-400">
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>

                  <button
                    onClick={() =>
                      setDeleteModal(
                        order.id
                      )
                    }
                    className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:scale-105 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Remove the Order
                </h2>

                <p className="mt-2 text-gray-500">
                  Are you sure you want to
                  delete this order?
                </p>
              </div>

              <button
                onClick={() =>
                  setDeleteModal(null)
                }
                className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal(null)
                }
                className="flex-1 rounded-2xl bg-gray-100 py-3 font-semibold transition hover:bg-gray-200"
              >
                No
              </button>

              <button
                onClick={() =>
                  deleteOrder(
                    deleteModal
                  )
                }
                className="flex-1 rounded-2xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600"
              >
                Yes Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}