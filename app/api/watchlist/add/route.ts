import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { companyId } = await req.json();
    if (!companyId) {
      return new NextResponse("Company ID is required", { status: 400 });
    }

    // Check if entry already exists
    const existingEntry = await prisma.watchlistEntry.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (existingEntry) {
      return new NextResponse("Already in watchlist", { status: 400 });
    }

    // Create new watchlist entry
    const watchlistEntry = await prisma.watchlistEntry.create({
      data: {
        userId,
        companyId,
      },
    });

    return NextResponse.json(watchlistEntry);
  } catch (error) {
    console.error("[WATCHLIST_ADD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
