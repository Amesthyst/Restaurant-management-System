import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const existing = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "This email has already been used. Try another email",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await hash(
      body.password,
      10
    );

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Register failed",
      },
      {
        status: 500,
      }
    );
  }
}