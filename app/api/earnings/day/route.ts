import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = new Date(searchParams.get("startDate") || "");
  const endDate = new Date(searchParams.get("endDate") || "");

  if (
    !startDate ||
    !endDate ||
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime())
  ) {
    return new Response("Invalid date parameters", { status: 400 });
  }

  try {
    const transcripts = await prisma.transcript.findMany({
      where: {
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        title: true,
        scheduledAt: true,
        quarter: true,
        year: true,
        MarketTime: true,
        epsActual: true,
        epsEstimate: true,
        revenueActual: true,
        revenueEstimate: true,
        company: {
          select: {
            id: true,
            symbol: true,
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    // Process the data
    const processedTranscripts = transcripts.map((transcript) => ({
      ...transcript,
      company: {
        ...transcript.company,
        logo: transcript.company.logo || null,
      },
    }));

    return NextResponse.json({ transcripts: processedTranscripts });
  } catch (error) {
    console.error("Error fetching day view data:", error);
    return new Response("Failed to fetch day view data", { status: 500 });
  }
}
