// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcrypt";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const hashed = await bcrypt.hash(
//     "",
//     10
//   );

//   const admin = await prisma.user.create({
//     data: {
//       name: "",
//       email: "",
//       password: hashed,
//       role: "ADMIN",
//     },
//   });

//   return NextResponse.json(admin);
// }