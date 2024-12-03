import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("req", req);
    console.log("userId", userId);

    const { companyId } = await req.json();
    if (!companyId) {
      return new NextResponse("Company ID is required", { status: 400 });
    }

    console.log("companyId", companyId);

    // Check if entry already exists
    const existingEntry = await prisma.watchlistEntry.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    console.log("existingEntry", existingEntry);

    if (existingEntry) {
      return new NextResponse("Already in watchlist", { status: 400 });
    }

    console.log("creating new entry");

    // Create new watchlist entry
    const watchlistEntry = await prisma.watchlistEntry.create({
      data: {
        userId,
        companyId,
      },
    });

    console.log("created watchlistEntry");

    console.log("watchlistEntry", watchlistEntry);

    return NextResponse.json(watchlistEntry);
  } catch (error) {
    console.error("[WATCHLIST_ADD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
