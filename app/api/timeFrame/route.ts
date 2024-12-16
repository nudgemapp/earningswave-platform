import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const resolution = searchParams.get("resolution") || "1";
    const startTime = searchParams.get("from");
    const endTime = searchParams.get("to");

    if (!symbol || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${startTime}&to=${endTime}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Finnhub API");
    }

    const data: FinnhubCandle = await response.json();

    if (data.s !== "ok") {
      return NextResponse.json({ error: "No data available" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching timeframe data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

interface FinnhubCandle {
  c: number[]; // close prices
  h: number[]; // high prices
  l: number[]; // low prices
  o: number[]; // open prices
  s: string; // status
  t: number[]; // timestamps
  v: number[]; // volume
}
