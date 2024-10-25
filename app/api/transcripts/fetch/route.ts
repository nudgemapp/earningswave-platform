import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const response = await fetch(
      "https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&horizon=3month&apikey=demo"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const rows = csvText.split("\n").map((row) => row.split(","));

    // Track statistics
    const stats = {
      processed: 0,
      skipped: {
        invalidDates: 0,
        duplicates: 0,
        noCompanyMatch: 0,
      },
      created: 0,
    };

    // Skip the header row and empty rows
    const validRows = rows
      .slice(1)
      .filter((row) => row.length >= 6 && row[0].trim());

    for (const row of validRows) {
      const [symbol, name, reportDate, fiscalDateEnding, estimate, currency] =
        row;

      // Normalize data
      const normalizedData = {
        symbol: symbol.trim().toUpperCase(),
        name: name.trim(),
        reportDate: new Date(reportDate.trim()),
        fiscalDateEnding: new Date(fiscalDateEnding.trim()),
        estimate: estimate ? parseFloat(estimate.trim()) : null,
        currency: currency.trim().toUpperCase(),
      };

      stats.processed++;

      // Validate dates
      if (
        isNaN(normalizedData.reportDate.getTime()) ||
        isNaN(normalizedData.fiscalDateEnding.getTime())
      ) {
        console.log("Invalid date found, skipping row:", normalizedData);
        stats.skipped.invalidDates++;
        continue;
      }

      // Find corresponding company
      const company = await prisma.company.findUnique({
        where: { symbol: normalizedData.symbol },
      });

      if (!company) {
        console.log(
          `No matching company found for symbol: ${normalizedData.symbol}`
        );
        stats.skipped.noCompanyMatch++;
        continue;
      }

      // Check for duplicates with strict comparison
      const existingReport = await prisma.earningsReport.findFirst({
        where: {
          AND: [
            { symbol: normalizedData.symbol },
            { companyId: company.id },
            {
              reportDate: {
                equals: normalizedData.reportDate,
              },
            },
            {
              fiscalDateEnding: {
                equals: normalizedData.fiscalDateEnding,
              },
            },
          ],
        },
      });

      if (existingReport) {
        console.log("Duplicate found, skipping row:", {
          symbol: normalizedData.symbol,
          reportDate: normalizedData.reportDate,
        });
        stats.skipped.duplicates++;
        continue;
      }

      // Store the data
      try {
        const storedData = await prisma.earningsReport.create({
          data: {
            symbol: normalizedData.symbol,
            name: normalizedData.name,
            reportDate: normalizedData.reportDate,
            fiscalDateEnding: normalizedData.fiscalDateEnding,
            estimate: normalizedData.estimate,
            currency: normalizedData.currency,
            company: {
              connect: {
                id: company.id,
              },
            },
          },
          include: {
            company: true,
          },
        });

        stats.created++;
        console.log("Created earnings report:", {
          id: storedData.id,
          symbol: storedData.symbol,
          reportDate: storedData.reportDate,
        });
      } catch (error) {
        console.error("Error storing earnings report:", {
          error,
          data: normalizedData,
        });
      }
    }

    return NextResponse.json({
      message: "Earnings reports processing completed",
      statistics: stats,
    });
  } catch (error) {
    console.error("Failed to fetch and store earnings calendar:", error);
    return NextResponse.json(
      {
        error: "Failed to process earnings calendar",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
