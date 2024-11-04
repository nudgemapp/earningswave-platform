import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

// Add these interfaces before the GET function
interface RawTranscript {
  id: number;
  date: Date;
  title: string;
  total_count: string | number;
  remaining_count: string | number;
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
  total_count: string | number;
  remaining_count: string | number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = new Date(searchParams.get("startDate") || "");
  const endDate = new Date(searchParams.get("endDate") || "");

  if (
    !startDate ||
    !endDate ||
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime())
  ) {
    return new Response("Invalid date parameters", { status: 400 });
  }

  console.log("API Date Range:", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  try {
    const data = await prisma.$transaction(async (tx) => {
      const [transcripts, reports] = await Promise.all([
        tx.$queryRaw`
          WITH DailyCounts AS (
            SELECT DATE(date) as day, COUNT(*) as total_count
            FROM "EarningsCallTranscript"
            WHERE date >= ${startDate} AND date <= ${endDate}
            GROUP BY DATE(date)
          ),
          RankedTranscripts AS (
            SELECT *,
                   ROW_NUMBER() OVER (PARTITION BY DATE(date) ORDER BY date) as rn
            FROM "EarningsCallTranscript"
            WHERE date >= ${startDate} AND date <= ${endDate}
          )
          SELECT t.*, 
                 c.id as "company.id",
                 c.symbol as "company.symbol",
                 c.name as "company.name",
                 l.data as "company.logo.data",
                 dc.total_count,
                 GREATEST(dc.total_count - 11, 0) as remaining_count
          FROM RankedTranscripts t
          LEFT JOIN "Company" c ON t."companyId" = c.id
          LEFT JOIN "Logo" l ON c."logoId" = l.id
          LEFT JOIN DailyCounts dc ON DATE(t.date) = dc.day
          WHERE rn <= 11
          ORDER BY date ASC
        `,
        tx.$queryRaw`
          WITH DailyCounts AS (
            SELECT DATE("reportDate") as day, COUNT(*) as total_count
            FROM "EarningsReport"
            WHERE "reportDate" >= ${startDate} AND "reportDate" <= ${endDate}
            GROUP BY DATE("reportDate")
          ),
          RankedReports AS (
            SELECT *,
                   ROW_NUMBER() OVER (PARTITION BY DATE("reportDate") ORDER BY "reportDate") as rn
            FROM "EarningsReport"
            WHERE "reportDate" >= ${startDate} AND "reportDate" <= ${endDate}
          )
          SELECT r.*, 
                 c.id as "company.id",
                 c.symbol as "company.symbol",
                 c.name as "company.name",
                 l.data as "company.logo.data",
                 dc.total_count,
                 GREATEST(dc.total_count - 11, 0) as remaining_count
          FROM RankedReports r
          LEFT JOIN "Company" c ON r."companyId" = c.id
          LEFT JOIN "Logo" l ON c."logoId" = l.id
          LEFT JOIN DailyCounts dc ON DATE(r."reportDate") = dc.day
          WHERE rn <= 11
          ORDER BY "reportDate" ASC
        `,
      ]);

      // Transform the raw SQL results to match the expected structure
      const formattedTranscripts = (transcripts as RawTranscript[]).map(
        (t) => ({
          id: t.id,
          date: t.date,
          title: t.title,
          totalCount: Number(t.total_count),
          remainingCount: Number(t.remaining_count),
          company: {
            id: t["company.id"],
            symbol: t["company.symbol"],
            name: t["company.name"],
            logo: t["company.logo.data"]
              ? {
                  data: t["company.logo.data"],
                }
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
        totalCount: Number(r.total_count),
        remainingCount: Number(r.remaining_count),
        company: {
          id: r["company.id"],
          symbol: r["company.symbol"],
          name: r["company.name"],
          logo: r["company.logo.data"]
            ? {
                data: r["company.logo.data"],
              }
            : null,
        },
      }));

      return {
        transcripts: formattedTranscripts,
        reports: formattedReports,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching month data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
