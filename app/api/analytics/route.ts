import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
  });

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.total,
    0
  );

  const map: Record<string, number> = {};

  orders.forEach((o) => {
    const date = new Date(o.createdAt)
      .toISOString()
      .slice(0, 10);

    map[date] = (map[date] || 0) + o.total;
  });

  const buildRange = (days: number) => {
    const result: Record<string, number> = {};
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      const key = d.toISOString().slice(0, 10);
      result[key] = map[key] || 0;
    }

    return result;
  };

  const last7Days = buildRange(7);
  const last30Days = buildRange(30);
  const last365Days = buildRange(365);

  const values = Object.values(map);
  const avg =
    values.reduce((a, b) => a + b, 0) /
    (values.length || 1);

  const prediction = {
    nextDay: Math.round(avg * 1.05),
    nextWeek: Math.round(avg * 7 * 1.03),
  };

  const menuMap: Record<string, number> = {};

  orders.forEach((o) => {
    o.items.forEach((i) => {
      menuMap[i.name] =
        (menuMap[i.name] || 0) + i.quantity;
    });
  });

  const topMenu = Object.entries(menuMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return NextResponse.json({
    totalRevenue,
    last7Days,
    last30Days,
    last365Days,
    prediction,
    topMenu,
  });
}