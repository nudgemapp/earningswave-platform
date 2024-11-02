import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET() {
  try {
    const { userId } = auth();

    console.log(userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const watchlist = await prisma.watchlistEntry.findMany({
      where: {
        userId: userId,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            symbol: true,
            logo: {
              select: {
                data: true,
              },
            },
            marketCap: true,
            price: true,
          },
        },
      },
      orderBy: {
        addedAt: "desc",
      },
    });

    console.log(watchlist);

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error("[WATCHLIST_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
