import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: { items: true },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();

  const order = await prisma.order.create({
    data: {
      tableNo: body.tableNo,
      total: body.total,
      items: {
        create: body.items,
      },
    },
  });

  return NextResponse.json(order);
}