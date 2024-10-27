import { schedules, logger } from "@trigger.dev/sdk/v3";
import prisma from "@/lib/prismadb";

export const scrapeEarningsTask = schedules.task({
  id: "earnings-scraper",
  cron: "0 11,16 * * *", // Runs at 11 AM and 4 PM UTC
  maxDuration: 300, // 5 minutes
  run: async (payload) => {
    try {
      logger.info("Starting earnings scraping task", { timestamp: payload.timestamp });

      const response = await fetch(
        "https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=3month&apikey=demo"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      const rows = csvText.split("\n").map((row) => row.split(","));

      const stats = {
        processed: 0,
        stored: 0,
        errors: 0,
        duplicates: 0
      };

      // Skip header row and process each entry
      for (const row of rows.slice(1)) {
        if (!row[0]) continue;

        const [symbol, name, reportDate, fiscalDateEnding, estimate, currency] = row;

        try {
          // Check for existing transcript
          const existingTranscript = await prisma.earningsCallTranscript.findFirst({
            where: {
              AND: [
                { date: new Date(reportDate) },
                { title: { contains: symbol } }
              ]
            }
          });

          if (existingTranscript) {
            stats.duplicates++;
            logger.info("Duplicate found", { symbol, reportDate });
            continue;
          }

          // Create new transcript entry
          await prisma.earningsCallTranscript.create({
            data: {
              title: `${name.trim()} (${symbol.trim()}) Earnings Call Transcript`,
              date: new Date(reportDate),
              href: `https://finance.yahoo.com/quote/${symbol.trim()}/earnings`,
              company_info: {
                symbol: symbol.trim(),
                name: name.trim(),
                fiscalDateEnding: new Date(fiscalDateEnding),
                estimate: estimate ? parseFloat(estimate) : null,
                currency: currency.trim()
              },
              // Initialize empty arrays/objects for fields that will be populated later
              call_participants: [],
              full_text: "", // Empty string for now, would be populated when transcript is available
              contents: [], // Will be populated when transcript content is processed
              sections: {}, // Will be populated when transcript sections are processed
              // Note: logo_id is optional and would be set when logo is processed
              // created_at and updated_at are handled automatically by Prisma
            }
          });

          stats.stored++;
          logger.info("Stored new transcript", { symbol, reportDate });
        } catch (error) {
          stats.errors++;
          logger.error("Error processing entry", {
            symbol,
            error: error instanceof Error ? error.message : "Unknown error"
          });
        }

        stats.processed++;
      }

      return {
        message: "Earnings transcripts scraping completed",
        statistics: stats
      };
    } catch (error) {
      logger.error("Failed to fetch and store earnings calendar:");
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
});
