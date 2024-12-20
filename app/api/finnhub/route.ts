import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the search params from the request URL
    // const { searchParams } = new URL(request.url);
    // const from =
    //   searchParams.get("from") || new Date().toISOString().split("T")[0];
    // const to =
    //   searchParams.get("to") ||
    //   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    //     .toISOString()
    //     .split("T")[0];

    // Add transcript ID parameter handling
    // Fetch NYSE stocks
    // const nyseResponse = await fetch(
    //   `https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNYS&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    // );
    // const nyseData = await nyseResponse.json();

    // console.log(nyseData);

    // // Fetch NASDAQ stocks
    // const nasdaqResponse = await fetch(
    //   `https://finnhub.io/api/v1/stock/symbol?exchange=US&mic=XNAS&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    // );
    // const nasdaqData = await nasdaqResponse.json();

    // console.log(nasdaqData);

    const from = "2023-02-01";
    const to = "2026-03-01";
    const symbol = "CRM";

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
    const transcriptId = "CRM_3410509";

    const transcriptResponse = await fetch(
      `https://finnhub.io/api/v1/stock/transcripts?id=${transcriptId}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    const transcriptData = await transcriptResponse.json();

    console.log(transcriptData);

    const profileResponse = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );

    const profileData = await profileResponse.json();

    console.log(profileData);

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
