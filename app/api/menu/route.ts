import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET
export async function GET() {
  try {
    const menu = await prisma.menuItem.findMany({
      include: {
        template: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(menu);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newItem = await prisma.menuItem.create({
      data: {
        name: body.name,
        description: body.description ?? "",
        price: Number(body.price),
        costPrice: body.costPrice ? Number(body.costPrice) : null,
        category: body.category,
        templateId: body.templateId || null,

        image: body.image && body.image !== "" ? body.image : null,
      },
    });

    return NextResponse.json(newItem);
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}