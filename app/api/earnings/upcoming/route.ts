import { NextResponse } from "next/server";
import { TranscriptStatus, MarketTime } from "@prisma/client";

// Add this interface before the GET function
interface FinnhubEarning {
  symbol: string;
  year: number;
  quarter: number;
  date: string;
  hour: string;
  epsEstimate: number | null;
  epsActual: number | null;
  revenueEstimate: number | null;
  revenueActual: number | null;
}

export async function GET(
  req: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol;

    if (!symbol) {
      return new NextResponse("Invalid symbol", { status: 400 });
    }

    // Get dates from today to 5 years in future
    const from = new Date().toISOString().split("T")[0];
    const to = new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const response = await fetch(
      `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Finnhub data");
    }

    const data = await response.json();
    const earningsCalendar = data.earningsCalendar || [];

    // Transform Finnhub data to match our Transcript schema
    const upcomingTranscripts = earningsCalendar.map(
      (earning: FinnhubEarning) => ({
        id: `${earning.symbol}_${earning.year}_Q${earning.quarter}`,
        companyId: "", // This will be filled in by the frontend
        title: `${earning.symbol} Q${earning.quarter} ${earning.year} Earnings Call`,
        status: "SCHEDULED" as TranscriptStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        scheduledAt: new Date(`${earning.date}T23:59:59.999Z`),
        quarter: earning.quarter,
        year: earning.year,
        audioUrl: null,
        MarketTime:
          earning.hour.toUpperCase() === "AMC"
            ? MarketTime.AMC
            : MarketTime.BMO,
        epsEstimate: earning.epsEstimate,
        epsActual: earning.epsActual,
        revenueEstimate: earning.revenueEstimate,
        revenueActual: earning.revenueActual,
        fullText: null,
        speakers: null,
        aiSummary: null,
        aiKeyPoints: null,
        aiSentimentAnalysis: null,
        aiLastUpdated: null,
      })
    );

    const response2 = NextResponse.json(upcomingTranscripts);

    // Cache for 1 hour, allow stale data for up to 4 hours while revalidating
    response2.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=14400"
    );

    return response2;
  } catch (error) {
    console.error("[UPCOMING_EARNINGS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
