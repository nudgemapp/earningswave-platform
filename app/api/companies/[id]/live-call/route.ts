import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface LiveCallEvent {
  symbol: string;
  year: number;
  quarter: number;
  event: string;
  time: string;
  liveAudio: string;
  recording: string;
}

interface LiveCallResponse {
  event: LiveCallEvent[];
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new NextResponse("Missing company ID", { status: 400 });
  }
  const zaa = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  console.log(zaa);
  try {
    // First, get the company symbol from the database
    const company = await prisma.company.findUnique({
      where: { id: params.id },
      select: { symbol: true },
    });

    console.log(company);

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    // Get today's date and format it
    // const today = new Date();
    // const from = today.toISOString().split("T")[0];
    const from = "2024-01-01";
    const to = "2024-12-03";

    // console.log(today);
    // console.log(from);
    // console.log(company.symbol);

    // // Get date 30 days from now
    // const to = new Date(today.setDate(today.getDate() + 30))
    //   .toISOString()
    //   .split("T")[0];

    // console.log(to);

    // Fetch live call data from Finnhub
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/earnings-call-live?` +
        `from=${from}&to=${to}&symbol=${company.symbol}&` +
        `token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );

    console.log(response);

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }

    const data: LiveCallResponse = await response.json();

    console.log(data);
    // Transform the data to include only relevant information
    const transformedData = {
      hasLiveCall: data.event.length > 0,
      calls: data.event.map((call) => ({
        symbol: call.symbol,
        scheduledTime: call.time,
        quarter: call.quarter,
        year: call.year,
        eventName: call.event,
        audioUrl: call.liveAudio,
        recording: call.recording,
        isLive: new Date(call.time) <= new Date() && !call.recording, // Check if the call is currently live
      })),
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching live call data:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Error fetching live call data",
      { status: 500 }
    );
  }
}
