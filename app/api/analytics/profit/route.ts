import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
  });

  const menu = await prisma.menuItem.findMany();

  const costMap: Record<string, number> = {};

  menu.forEach((m) => {
    costMap[m.name] = m.costPrice || 0;
  });

  const profitMap: Record<
    string,
    { revenue: number; cost: number; profit: number }
  > = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const cost = costMap[item.name] || 0;
      const revenue = item.price * item.quantity;
      const totalCost = cost * item.quantity;

      if (!profitMap[item.name]) {
        profitMap[item.name] = {
          revenue: 0,
          cost: 0,
          profit: 0,
        };
      }

      profitMap[item.name].revenue += revenue;
      profitMap[item.name].cost += totalCost;
      profitMap[item.name].profit +=
        revenue - totalCost;
    });
  });

  const result = Object.entries(profitMap).map(
    ([name, v]) => ({
      name,
      revenue: v.revenue,
      cost: v.cost,
      profit: v.profit,
      margin:
        v.revenue === 0
          ? 0
          : (v.profit / v.revenue) * 100,
    })
  );

  return NextResponse.json(result);
}