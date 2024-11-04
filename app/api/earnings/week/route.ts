import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

// Add interfaces similar to month route
interface RawTranscript {
  id: number;
  date: Date;
  title: string;
  "company.id": number;
  "company.symbol": string;
  "company.name": string;
  "company.logo.data": Buffer | null;
}

interface RawReport {
  id: string;
  symbol: string;
  name: string;
  reportDate: Date;
  fiscalDateEnding: Date;
  estimate: number | null;
  currency: string;
  marketTiming: string | null;
  lastYearEPS: number | null;
  lastYearReportDate: Date | null;
  companyId: number;
  "company.id": number;
  "company.symbol": string;
  "company.name": string;
  "company.logo.data": Buffer | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let startDate = new Date(searchParams.get("startDate") || "");

  // Ensure we're working with UTC dates
  startDate = new Date(
    Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      0,
      0,
      0,
      0
    )
  );

  // Adjust to Monday of the current week
  const day = startDate.getUTCDay();
  const diff = startDate.getUTCDate() - day + (day === 0 ? -6 : 1);
  startDate = new Date(
    Date.UTC(startDate.getFullYear(), startDate.getMonth(), diff, 0, 0, 0, 0)
  );

  // Set end date to Friday of the same week
  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 4); // Add 4 days to get to Friday
  endDate.setUTCHours(23, 59, 59, 999);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return new Response("Invalid date parameters", { status: 400 });
  }

  // console.log("API Date Range:", {
  //   startDate: startDate.toISOString(),
  //   endDate: endDate.toISOString(),
  // });

  try {
    const data = await prisma.$transaction(async (tx) => {
      const [transcripts, reports] = await Promise.all([
        tx.$queryRaw`
          SELECT t.*, 
                 c.id as "company.id",
                 c.symbol as "company.symbol",
                 c.name as "company.name",
                 l.data as "company.logo.data"
          FROM "EarningsCallTranscript" t
          LEFT JOIN "Company" c ON t."companyId" = c.id
          LEFT JOIN "Logo" l ON c."logoId" = l.id
          WHERE t.date >= ${startDate} AND t.date <= ${endDate}
          ORDER BY t.date ASC
        `,
        tx.$queryRaw`
          SELECT r.*, 
                 c.id as "company.id",
                 c.symbol as "company.symbol",
                 c.name as "company.name",
                 l.data as "company.logo.data"
          FROM "EarningsReport" r
          LEFT JOIN "Company" c ON r."companyId" = c.id
          LEFT JOIN "Logo" l ON c."logoId" = l.id
          WHERE r."reportDate" >= ${startDate} AND r."reportDate" <= ${endDate}
          ORDER BY r."reportDate" ASC
        `,
      ]);

      // Transform raw results to match expected structure
      const formattedTranscripts = (transcripts as RawTranscript[]).map(
        (t) => ({
          id: t.id,
          date: t.date,
          title: t.title,
          company: {
            id: t["company.id"],
            symbol: t["company.symbol"],
            name: t["company.name"],
            logo: t["company.logo.data"]
              ? { data: t["company.logo.data"] }
              : null,
          },
        })
      );

      const formattedReports = (reports as RawReport[]).map((r) => ({
        id: r.id,
        symbol: r.symbol,
        name: r.name,
        reportDate: r.reportDate,
        fiscalDateEnding: r.fiscalDateEnding,
        estimate: r.estimate,
        currency: r.currency,
        marketTiming: r.marketTiming,
        lastYearEPS: r.lastYearEPS,
        lastYearReportDate: r.lastYearReportDate,
        companyId: r.companyId,
        company: {
          id: r["company.id"],
          symbol: r["company.symbol"],
          name: r["company.name"],
          logo: r["company.logo.data"]
            ? { data: r["company.logo.data"] }
            : null,
        },
      }));

      console.log("Formatted transcripts:", formattedTranscripts);
      console.log("Formatted reports:", formattedReports);

      return {
        transcripts: formattedTranscripts,
        reports: formattedReports,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching week view data:", error);
    return new Response("Failed to fetch week view data", { status: 500 });
  }
}
