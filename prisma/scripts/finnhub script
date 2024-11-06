import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Fetch NYSE stocks
    const nyseResponse = await fetch(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNYS&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    const nyseData = await nyseResponse.json();

    console.log(nyseData);

    // Fetch NASDAQ stocks
    const nasdaqResponse = await fetch(
      `https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNAS&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    const nasdaqData = await nasdaqResponse.json();

    console.log(nasdaqData);

    // Combine both results
    const combinedData = [...nyseData, ...nasdaqData];

    return NextResponse.json({ symbolsData: combinedData });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch data from Finnhub",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
