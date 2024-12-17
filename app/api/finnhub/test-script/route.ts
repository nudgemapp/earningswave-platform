import { PrismaClient } from "@prisma/client";
import { MarketTime, TranscriptStatus } from "@prisma/client";

function determineMIC(exchange: string): "XNAS" | "XNYS" {
  const exchangeLower = exchange.toLowerCase();

  if (exchangeLower.includes("nasdaq")) {
    return "XNAS";
  }
  if (exchangeLower.includes("nyse") || exchangeLower.includes("mkt")) {
    return "XNYS";
  }

  // Default to XNYS if unknown
  console.warn(`Unknown exchange: ${exchange}, defaulting to XNYS`);
  return "XNYS";
}

async function fetchAndMapEarningsData() {
  const prisma = new PrismaClient();
  const errors: string[] = [];
  let totalUpdates = 0;

  const symbol = "ZJK";

  try {
    const profileResponse = await fetch(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );

    const profileData = await profileResponse.json();

    console.log(profileData);

    const mic = determineMIC(profileData.exchange);

    const newCompany = await prisma.company.upsert({
      where: {
        symbol_mic: {
          symbol: profileData.ticker,
          mic: mic,
        },
      },
      create: {
        symbol: profileData.ticker,
        currency: profileData.currency,
        description: profileData.name,
        displaySymbol: profileData.ticker,
        mic: mic,
        type: "Common Stock",
        country: profileData.country,
        exchange: profileData.exchange,
        ipo: new Date(profileData.ipo),
        marketCapitalization: profileData.marketCapitalization,
        name: profileData.name,
        phone: profileData.phone,
        sharesOutstanding: profileData.shareOutstanding,
        weburl: profileData.weburl,
        logo: profileData.logo,
        finnhubIndustry: profileData.finnhubIndustry,
      },
      update: {
        currency: profileData.currency,
        description: profileData.name,
        country: profileData.country,
        exchange: profileData.exchange,
        ipo: new Date(profileData.ipo),
        marketCapitalization: profileData.marketCapitalization,
        name: profileData.name,
        phone: profileData.phone,
        sharesOutstanding: profileData.shareOutstanding,
        weburl: profileData.weburl,
        logo: profileData.logo,
        finnhubIndustry: profileData.finnhubIndustry,
      },
    });

    console.log(newCompany);

    // Fetch transcript list
    const transcriptListResponse = await fetch(
      `https://finnhub.io/api/v1/stock/transcripts/list?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
    );
    const transcriptListData = await transcriptListResponse.json();

    console.log(transcriptListData);

    // Filter only earnings call transcripts (those with quarter assigned)
    const earningsTranscripts = transcriptListData.transcripts.filter(
      (t: any) => t.quarter > 0
    );

    // Try to find company in either NASDAQ or NYSE
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { symbol: symbol, mic: "XNAS" },
          { symbol: symbol, mic: "XNYS" },
        ],
      },
    });

    console.log(company);

    if (!company) {
      throw new Error(
        `Company with symbol ${symbol} not found in NASDAQ or NYSE.`
      );
    }

    // Process each earnings transcript
    for (const t of earningsTranscripts) {
      try {
        // Fetch full transcript data
        const transcriptResponse = await fetch(
          `https://finnhub.io/api/v1/stock/transcripts?id=${t.id}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
        );
        const transcriptData = await transcriptResponse.json();

        console.log(transcriptData);

        // Determine MarketTime based on your logic
        const marketTime = t.time.includes("AM")
          ? MarketTime.BMO
          : MarketTime.AMC;

        // Create transcript record with participants
        await prisma.transcript.upsert({
          where: { id: t.id },
          create: {
            id: t.id,
            companyId: company.id,
            title: t.title,
            scheduledAt: new Date(t.time),
            quarter: t.quarter,
            year: t.year,
            audioUrl: transcriptData.audio,
            MarketTime: marketTime,
            status: TranscriptStatus.COMPLETED,
            fullText: transcriptData.transcript
              .map((s: any) => `${s.name}: ${s.speech.join(" ")}`)
              .join("\n"),
            speakers: transcriptData.participant,
            participants: {
              create: transcriptData.participant.map((p: any) => ({
                name: p.name,
                role: p.role,
                description: p.description,
                speeches: {
                  create: transcriptData.transcript
                    .filter((s: any) => s.name === p.name)
                    .map((s: any, idx: number) => ({
                      content: s.speech.join(" "),
                      sequence: idx,
                      sessionType: s.session,
                    })),
                },
              })),
            },
          },
          update: {
            title: t.title,
            quarter: t.quarter,
            year: t.year,
            audioUrl: transcriptData.audio,
            fullText: transcriptData.transcript
              .map((s: any) => `${s.name}: ${s.speech.join(" ")}`)
              .join("\n"),
            speakers: transcriptData.participant,
            MarketTime: marketTime,
          },
        });

        const from = "2023-02-01";
        const to = "2026-03-01";

        // Fetch earnings data
        const earningsResponse = await fetch(
          `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
        );
        const earningsData = await earningsResponse.json();

        console.log(earningsData);

        // Find matching earnings data for this transcript
        const matchingEarnings = earningsData.earningsCalendar.find(
          (e: any) => e.quarter === t.quarter && e.year === t.year
        );

        if (matchingEarnings) {
          // Update transcript with earnings data
          await prisma.transcript.update({
            where: { id: t.id },
            data: {
              epsActual: matchingEarnings.epsActual,
              epsEstimate: matchingEarnings.epsEstimate,
              revenueActual: matchingEarnings.revenueActual,
              revenueEstimate: matchingEarnings.revenueEstimate,
            },
          });
        }

        totalUpdates++;
      } catch (err) {
        errors.push(`Error processing transcript ${t.id}: ${err}`);
      }
    }

    // Log statistics
    console.log(`\nFinal Statistics:`);
    console.log(
      `Total earnings transcripts found: ${earningsTranscripts.length}`
    );
    console.log(`Successful updates: ${totalUpdates}`);
    console.log(`Failed updates: ${errors.length}`);
    if (errors.length > 0) {
      console.log(`Errors encountered:`, errors);
    }
  } catch (error) {
    console.error(
      "Error processing data:",
      error instanceof Error ? error.message : "Unknown error"
    );
  } finally {
    await prisma.$disconnect();
  }
}

fetchAndMapEarningsData();
