import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companyId = params.companyId;

    if (!companyId) {
      return new NextResponse("Invalid company ID", { status: 400 });
    }

    // Efficient query using the compound index (userId, companyId)
    const watchlistEntry = await prisma.watchlistEntry.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      select: {
        id: true, // Only select what we need
      },
    });

    return NextResponse.json({
      isWatchlisted: !!watchlistEntry,
    });
  } catch (error) {
    console.error("[WATCHLIST_CHECK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
