import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");


  if (!symbol) {
    return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
  }
  const endpoint = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;

  const response = await fetch(endpoint);
  const data = await response.json();

  return NextResponse.json(data);
}
