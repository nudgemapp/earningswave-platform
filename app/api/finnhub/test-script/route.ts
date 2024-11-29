import { PrismaClient } from "@prisma/client";

async function fetchAndMapEarningsData() {
  const prisma = new PrismaClient();

  try {
    const companies = await prisma.company.findMany();
    console.log(`Fetched ${companies.length} companies from the database.`);

    for (const company of companies) {
      const { symbol } = company;

      // Fetch transcripts for the company
      const transcripts = await prisma.transcript.findMany({
        where: {
          companyId: company.id,
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
        },
      });
      console.log(
        `Fetched ${transcripts.length} transcripts for company ${symbol}.`
      );

      // Fetch earnings calendar from Finnhub
      const from = "2010-03-01";
      const to = "2026-03-01";
      const earningsResponse = await fetch(
        `https://finnhub.io/api/v1/calendar/earnings?from=${from}&to=${to}&symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
      );
      const earningsData = await earningsResponse.json();

      // Map earnings data to transcripts
      const earningsCalendar = earningsData.earningsCalendar || [];
      let updatesCount = 0;

      for (const earnings of earningsCalendar) {
        const {
          year,
          quarter,
          epsActual,
          epsEstimate,
          revenueActual,
          revenueEstimate,
        } = earnings;

        // Find the corresponding transcript
        const transcript = transcripts.find(
          (t) => t.year === year && t.quarter === quarter
        );

        if (transcript) {
          // Update only the EPS and revenue fields
          // await prisma.transcript.update({
          //   where: { id: transcript.id },
          //   data: {
          //     epsActual: epsActual || null,
          //     epsEstimate: epsEstimate || null,
          //     revenueActual: revenueActual || null,
          //     revenueEstimate: revenueEstimate || null,
          //   },
          // });
          // console.log(
          //   `Updated transcript ${transcript.id} for company ${symbol}:`
          // );
          // console.log(
          //   `  EPS Actual: ${epsActual}, EPS Estimate: ${epsEstimate}`
          // );
          // console.log(
          //   `  Revenue Actual: ${revenueActual}, Revenue Estimate: ${revenueEstimate}`
          // );
          // updatesCount++;
        }
      }

      // console.log(`Total updates for company ${symbol}: ${updatesCount}`);
    }
  } catch (error) {
    console.error("Error processing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchAndMapEarningsData();
