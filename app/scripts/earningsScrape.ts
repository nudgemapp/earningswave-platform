import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface EarningsEntry {
  symbol: string;
  sk: string;
  earningsDate: string;
  earningsTime: string;
  isDateConfirmed?: boolean;
  marketCap?: number;
}

interface EarningsCalendar {
  [date: string]: EarningsEntry[];
}

async function getMonthDates(startYear: number, endYear: number) {
  const dates: { start: string; end: string }[] = [];

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of month

      dates.push({
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
      });
    }
  }

  return dates;
}

// Replace @ts-ignore with more specific typing
async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  return results;
}

async function scrapeEarningsForMonth(startDate: string, endDate: string) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response = await fetch(
      `https://api.savvytrader.com/pricing/assets/earnings/calendar/daily?start=${startDate}&end=${endDate}`
    );

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const calendar: EarningsCalendar = await response.json();

    // Fix: Correctly extract entries from the calendar
    const allEntries = Object.entries(calendar).flatMap(([date, entries]) => {
      if (!Array.isArray(entries)) return [];
      return entries;
    });

    console.log(`Processing ${allEntries.length} entries for ${startDate} to ${endDate}`);
    
    const results = await processBatch(allEntries, 10, async (entry) => {
      let year: number, quarter: number;

      if (entry.sk) {
        const [yearStr, quarterStr] = entry.sk.split("#");
        const parsedYear = parseInt(yearStr);
        const parsedQuarter = quarterStr
          ? parseInt(quarterStr.substring(1))
          : null;

        if (
          !isNaN(parsedYear) &&
          parsedQuarter !== null &&
          !isNaN(parsedQuarter)
        ) {
          year = parsedYear;
          quarter = parsedQuarter;
        } else {
          const earningsDate = new Date(entry.earningsDate);
          year = earningsDate.getFullYear();
          quarter = Math.floor(earningsDate.getMonth() / 3) + 1;
        }
      } else {
        const earningsDate = new Date(entry.earningsDate);
        year = earningsDate.getFullYear();
        quarter = Math.floor(earningsDate.getMonth() / 3) + 1;
      }

      try {
        const existing = await prisma.earnings.findUnique({
          where: {
            symbol_year_quarter: {
              symbol: entry.symbol,
              year: year,
              quarter: quarter,
            },
          },
        });

        const data = {
          symbol: entry.symbol,
          year: year,
          quarter: quarter,
          sk: entry.sk || null,
          earningsDate: new Date(entry.earningsDate),
          earningsTime: entry.earningsTime,
          isDateConfirmed: entry.isDateConfirmed ?? false,
          marketCap: entry.marketCap || null,
        };

        if (existing) {
          // Only update if there are actual changes
          const hasChanges =
            existing.earningsDate.getTime() !== data.earningsDate.getTime() ||
            existing.earningsTime !== data.earningsTime ||
            existing.isDateConfirmed !== data.isDateConfirmed ||
            existing.marketCap !== data.marketCap ||
            existing.sk !== data.sk;

          if (hasChanges) {
            return await prisma.earnings.update({
              where: {
                symbol_year_quarter: {
                  symbol: entry.symbol,
                  year: year,
                  quarter: quarter,
                },
              },
              data: {
                ...data,
                updatedAt: new Date(),
              },
            });
          }
          return existing; // Return existing record if no changes needed
        } else {
          return await prisma.earnings.create({ data });
        }
      } catch (error) {
        console.error(`Error processing entry ${entry.symbol}:`, error);
        return null;
      }
    });

    const validResults = results.filter((r) => r !== null);
    console.log(`Successfully processed ${validResults.length} entries`);
    return validResults;
  } catch (error) {
    console.error(
      `Failed to process month range ${startDate} to ${endDate}:`,
      error
    );
    throw error;
  }
}

async function main() {
  try {
    const monthRanges = await getMonthDates(2023, 2025);

    for (const range of monthRanges) {
      await scrapeEarningsForMonth(range.start, range.end);
    }

    console.log("Earnings data scraping completed successfully");
  } catch (error) {
    console.error("Failed to complete earnings scraping:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
