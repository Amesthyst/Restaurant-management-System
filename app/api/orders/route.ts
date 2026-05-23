import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order = await prisma.order.create({
      data: {
        tableNo: Number(body.tableNo),
        total: body.total,
        status: "pending",

        items: {
          create: body.items.map((item: any) => ({
            menuId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        },
      },

      include: {
        items: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}