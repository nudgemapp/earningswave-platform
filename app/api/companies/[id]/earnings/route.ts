import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;
    const today = new Date();

    // Using the @@index([symbol, earningsDate]) from schema
    const [upcomingEarnings, recentEarnings] = await Promise.all([
      // Get upcoming earnings
      prisma.earnings.findMany({
        where: {
          symbol: symbol,
          earningsDate: {
            gte: today,
          },
        },
        orderBy: {
          earningsDate: "asc",
        },
        take: 4,
      }),

      // Get recent earnings
      prisma.earnings.findMany({
        where: {
          symbol: symbol,
          earningsDate: {
            lt: today,
          },
        },
        orderBy: {
          earningsDate: "desc",
        },
        take: 8,
      }),
    ]);

    return NextResponse.json({
      upcomingEarnings,
      recentEarnings,
    });
  } catch (error) {
    console.error("[EARNINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
