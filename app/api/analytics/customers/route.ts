import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
  });

  const customerMap: Record<
    string,
    {
      totalSpent: number;
      orders: number;
      items: Record<string, number>;
      lastVisit: Date;
    }
  > = {};

  for (const order of orders) {
    const id = order.customerId || "guest";

    if (!customerMap[id]) {
      customerMap[id] = {
        totalSpent: 0,
        orders: 0,
        items: {},
        lastVisit: order.createdAt,
      };
    }

    customerMap[id].totalSpent += order.total;
    customerMap[id].orders += 1;

    if (
      order.createdAt >
      customerMap[id].lastVisit
    ) {
      customerMap[id].lastVisit =
        order.createdAt;
    }

    for (const item of order.items) {
      customerMap[id].items[item.name] =
        (customerMap[id].items[item.name] || 0) +
        item.quantity;
    }
  }

  const result = Object.entries(customerMap).map(
    ([id, data]) => {
      const favorite = Object.entries(
        data.items
      ).sort((a, b) => b[1] - a[1])[0];

      return {
        customerId: id,
        totalSpent: data.totalSpent,
        orders: data.orders,
        favoriteItem: favorite?.[0] || "-",
        favoriteQty: favorite?.[1] || 0,
        lastVisit: data.lastVisit,
      };
    }
  );

  return NextResponse.json(result);
}