import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET ALL MENU ITEMS
export async function GET() {
  try {
    const menu = await prisma.menuItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(menu);
  } catch (error: any) {
    console.error("GET_MENU_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}

// CREATE MENU ITEM
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // basic validation
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const newItem = await prisma.menuItem.create({
      data: {
        name: body.name,
        price: Number(body.price),
        category: body.category,
      },
    });

    return NextResponse.json(newItem);
  } catch (error: any) {
    console.error("POST_MENU_ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}