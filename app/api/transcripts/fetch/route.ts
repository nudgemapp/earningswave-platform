import prisma from "../../../../lib/prismadb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Starting matching and relation creation...");

    const [transcripts, companies] = await Promise.all([
      prisma.earningsCallTranscript.findMany({
        select: {
          id: true,
          company_info: true,
          title: true,
        },
      }),
      prisma.company.findMany({
        select: {
          id: true,
          symbol: true,
        },
      }),
    ]);

    // Create a Map of company symbols to company IDs for faster lookup
    const companyMap = new Map(
      companies.map((c) => [c.symbol.toLowerCase(), c.id])
    );

    let matchCount = 0;
    let updatePromises: Promise<any>[] = [];

    // Process in batches to avoid overwhelming the database
    const batchSize = 100;
    for (let i = 0; i < transcripts.length; i += batchSize) {
      const batch = transcripts.slice(i, i + batchSize);
      const batchPromises = batch.map((transcript) => {
        const companyInfo = transcript.company_info as any;
        const ticker =
          companyInfo.ticker_symbol?.toLowerCase() ||
          companyInfo.symbol?.toLowerCase();

        const companyId = companyMap.get(ticker);

        if (ticker && companyId) {
          matchCount++;
          return prisma.earningsCallTranscript.update({
            where: { id: transcript.id },
            data: { companyId: companyId },
          });
        }
        return Promise.resolve(); // Skip if no match
      });

      // Wait for each batch to complete
      await Promise.all(batchPromises.filter((p) => p !== undefined));

      // Log progress
      console.log(
        `Processed ${i + batch.length} of ${transcripts.length} transcripts`
      );
    }

    const stats = {
      total: transcripts.length,
      companiesInDb: companies.length,
      matched: matchCount,
      unmatched: transcripts.length - matchCount,
      matchRate: `${((matchCount / transcripts.length) * 100).toFixed(2)}%`,
    };

    console.log("\n=== Final Results ===");
    console.log(JSON.stringify(stats, null, 2));

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to create relations" },
      { status: 500 }
    );
  }
}
