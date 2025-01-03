import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      const companies = await prisma.company.findMany({
        where: {
          marketCapitalization: {
            not: null,
          },
        },
        select: {
          id: true,
          symbol: true,
          name: true,
          logo: true,
          mic: true,
          marketCapitalization: true,
          country: true,
          exchange: true,
          finnhubIndustry: true,
          _count: {
            select: {
              transcripts: true,
            },
          },
        },
        take: 10,
        orderBy: {
          marketCapitalization: "desc",
        },
      });
      return NextResponse.json(companies);
    }

    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { symbol: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        symbol: true,
        name: true,
        logo: true,
        mic: true,
        marketCapitalization: true,
        country: true,
        exchange: true,
        finnhubIndustry: true,
        _count: {
          select: {
            transcripts: true,
          },
        },
      },
      take: 10,
      orderBy: {
        symbol: "asc",
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error searching companies:", error);
    return new NextResponse("Error searching companies", { status: 500 });
  }
}
