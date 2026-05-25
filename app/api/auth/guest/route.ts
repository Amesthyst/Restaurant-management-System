import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const random =
      Math.floor(Math.random() * 999999);

    const email = `guest${random}@guest.com`;

    const rawPassword = "guest123";

    const hashed = await bcrypt.hash(
      rawPassword,
      10
    );

    await prisma.user.create({
      data: {
        name: `Guest ${random}`,
        email,
        password: hashed,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json({
      email,
      password: rawPassword,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Guest login failed",
      },
      {
        status: 500,
      }
    );
  }
}