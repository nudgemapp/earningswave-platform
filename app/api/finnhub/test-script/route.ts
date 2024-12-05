import { PrismaClient } from "@prisma/client";

async function fetchAndMapEarningsData() {
  const prisma = new PrismaClient();

  try {
    // Fetch only transcripts with year and quarter that need earnings data
    const transcripts = await prisma.transcript.findMany({
      where: {
        AND: [
          {
            OR: [
              { epsActual: null },
              { epsEstimate: null },
              { revenueActual: null },
              { revenueEstimate: null },
            ],
          },
          { year: { not: null } },
          { quarter: { not: null } },
        ],
      },
      select: {
        id: true,
        year: true,
        quarter: true,
        company: {
          select: {
            symbol: true,
          },
        },
      },
    });

    console.log(
      `Found ${transcripts.length} transcripts needing earnings data`
    );

    let totalUpdates = 0;
    const errors: string[] = [];

    // Process transcripts in batches of 10 to avoid rate limiting
    for (let i = 0; i < transcripts.length; i += 10) {
      const batch = transcripts.slice(i, i + 10);

      await Promise.all(
        batch.map(async (transcript) => {
          try {
            const { symbol } = transcript.company;
            const from = `${transcript.year}-01-01`;
            const to = `${transcript.year}-12-31`;

            const earningsResponse = await fetch(
              `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
            );
            const earningsData = await earningsResponse.json();

            const matchingEarnings = (earningsData.earningsCalendar || []).find(
              (e: any) =>
                e.year === transcript.year && e.quarter === transcript.quarter
            );

            if (matchingEarnings) {
              const { epsActual, epsEstimate, revenueActual, revenueEstimate } =
                matchingEarnings;

              await prisma.transcript.update({
                where: { id: transcript.id },
                data: {
                  epsActual: epsActual || null,
                  epsEstimate: epsEstimate || null,
                  revenueActual: revenueActual || null,
                  revenueEstimate: revenueEstimate || null,
                },
              });

              totalUpdates++;
              console.log(
                `Updated ${symbol} ${transcript.year}Q${transcript.quarter}:`,
                `EPS A/E: ${epsActual}/${epsEstimate},`,
                `Rev A/E: ${revenueActual}/${revenueEstimate}`
              );
            }
          } catch (error) {
            if (error instanceof Error) {
              errors.push(`${transcript.company.symbol}: ${error.message}`);
            } else {
              errors.push(`${transcript.company.symbol}: Unknown error`);
            }
          }
        })
      );

      // Add a small delay between batches to respect rate limits
      if (i + 10 < transcripts.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(`\nFinal Statistics:`);
    console.log(`Total transcripts processed: ${transcripts.length}`);
    console.log(`Successful updates: ${totalUpdates}`);
    console.log(`Failed updates: ${errors.length}`);
    if (errors.length > 0) {
      console.log(`Errors encountered:`, errors);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error processing data:", error.message);
    } else {
      console.error("Unknown error processing data");
    }
  } finally {
    await prisma.$disconnect();
  }
}

fetchAndMapEarningsData();
