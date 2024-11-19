import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import pLimit from "p-limit";

export async function GET() {
  const prisma = new PrismaClient();
  //   const limit = pLimit(20); // Reduced to 20 concurrent requests (safe margin below 30/sec)
  //   const RETRY_DELAY = 100; // 100ms delay between retries

  try {
    const companies = await prisma.company.findMany({
      select: {
        symbol: true,
        id: true,
        mic: true,
      },
    });

    console.log(`Found ${companies.length} companies to check`);
    console.log("Sample companies:", companies.slice(0, 5));

    const from = "2023-02-01";
    const to = "2026-03-01";
    const symbol = "SYM";

    // Add earnings calendar fetch
    const earningsResponse = await fetch(
      `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    const earningsData = await earningsResponse.json();
    console.log("Earnings Calendar Data:", earningsData);

    // Combine all results
    // const combinedData = [...nyseData, ...nasdaqData];

    // console.log("all companies in NYSE and NASDAQ", combinedData);

    // Fetch transcript list for
    const transcriptListResponse = await fetch(
      `https://finnhub.io/api/v1/stock/transcripts/list?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    const transcriptListData = await transcriptListResponse.json();
    console.log(transcriptListData);

    // Get the most recent transcript ID from the list
    const mostRecentTranscriptId = transcriptListData.transcripts?.[0]?.id;
    console.log(mostRecentTranscriptId);

    // Fetch the full transcript using the most recent ID
    // Add transcript fetch if ID is provided
    const transcriptId = "SYM_3409268";

    const transcriptResponse = await fetch(
      `https://finnhub.io/api/v1/stock/transcripts?id=${transcriptId}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    const transcriptData = await transcriptResponse.json();

    console.log(transcriptData);

    return NextResponse.json({
      // symbolsData: combinedData,
      earningsCalendar: earningsData.earningsCalendar,
      transcript: transcriptData,
      transcriptList: transcriptListData.transcripts,
    });
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
