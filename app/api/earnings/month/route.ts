import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

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

      // Group transcripts by date and include the counts
      const transcriptsByDate = transcripts.reduce((acc: any, t: any) => {
        const date = t.date.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            totalCount: Number(t.total_count),
            remainingCount: Number(t.remaining_count),
            items: [],
          };
        }
        acc[date].items.push({
          id: t.id,
          date: t.date,
          title: t.title,
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
        });
        return acc;
      }, {});

      // Group reports by date and include the counts
      const reportsByDate = reports.reduce((acc: any, r: any) => {
        const date = r.reportDate.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            totalCount: Number(r.total_count),
            remainingCount: Number(r.remaining_count),
            items: [],
          };
        }
        acc[date].items.push({
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
              ? {
                  data: r["company.logo.data"],
                }
              : null,
          },
        });
        return acc;
      }, {});

      return {
        transcripts: Object.values(transcriptsByDate),
        reports: Object.values(reportsByDate),
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching month data:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
