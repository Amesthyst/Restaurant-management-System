import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const templates = await prisma.optionTemplate.findMany();
  return NextResponse.json(templates);
}