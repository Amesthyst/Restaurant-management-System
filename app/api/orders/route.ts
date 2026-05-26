import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("ORDER BODY:", body);

    const tableNo = body.tableNo ?? body.items?.[0]?.tableNo;

    if (!tableNo) {
      return NextResponse.json(
        { error: "tableNo is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "items is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        tableNo: Number(tableNo),
        total: Number(body.total ?? 0),
        status: "pending",

        isDeleted: false,

        items: {
          create: body.items.map((item: any) => ({
            menuId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            spicyLevel: item.options?.spicy ?? null,
            sugarLevel: item.options?.sugar ?? null,
            iceLevel: item.options?.ice ?? null,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    const io = (global as any).io;
    if (io) {
      io.emit("new-order", order);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("POST ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}