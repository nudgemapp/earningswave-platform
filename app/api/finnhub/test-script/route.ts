// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// export async function GET() {
//   const prisma = new PrismaClient();

//   try {
//     return NextResponse.json({});
//   } catch (error) {
//     console.error("Error deleting transcripts:", error);
//     return NextResponse.json(
//       { error: "Failed to delete transcripts" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
