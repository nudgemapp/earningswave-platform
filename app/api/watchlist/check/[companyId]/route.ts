import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { companyId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companyId = params.companyId;

    if (!companyId) {
      return new NextResponse("Invalid company ID", { status: 400 });
    }

    const watchlistEntry = await prisma.watchlistEntry.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      select: {
        id: true,
      },
    });

    const response = NextResponse.json({
      isWatchlisted: !!watchlistEntry,
    });

    // Cache for 1 minute, allow stale data for up to 5 minutes while revalidating
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return response;
  } catch (error) {
    console.error("[WATCHLIST_CHECK]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
