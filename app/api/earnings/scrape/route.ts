import { NextResponse } from "next/server";

interface EarningsEntry {
  symbol: string;
  sk: string;
  earningsDate: string;
  earningsTime: string;
  isDateConfirmed: boolean;
  marketCap?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    if (!startDate || !endDate) {
      return new NextResponse("Missing start or end date parameters", { status: 400 });
    }

    const response = await fetch(
      `https://api.savvytrader.com/pricing/assets/earnings/calendar/daily?start=${startDate}&end=${endDate}`
    );

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data: EarningsEntry[] = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching earnings data:", error);
    return new NextResponse("Failed to fetch earnings data", { status: 500 });
  }
}
