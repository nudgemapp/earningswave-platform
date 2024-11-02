import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    console.log(userId);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { companyId } = await req.json();

    const watchlistEntry = await prisma.watchlistEntry.create({
      data: {
        userId,
        companyId,
      },
    });

    return NextResponse.json(watchlistEntry);
  } catch (error: any) {
    if (error.code === "P2002") {
      return new NextResponse("Already in watchlist", { status: 400 });
    }
    console.error("[WATCHLIST_ADD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
