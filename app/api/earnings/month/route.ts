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
    // Single raw SQL query to get both the daily counts and limited transcripts
    const result = await prisma.$queryRaw`
      WITH DailyCounts AS (
        SELECT 
          DATE("scheduledAt") as date,
          COUNT(*) as total_count
        FROM "Transcript"
        WHERE 
          "scheduledAt" >= ${startDate}
          AND "scheduledAt" <= ${endDate}
          AND quarter IS NOT NULL
        GROUP BY DATE("scheduledAt")
      ),
      RankedTranscripts AS (
        SELECT 
          t.id,
          t.title,
          t."scheduledAt",
          t.status,
          t."MarketTime",
          t.quarter,
          c.id as "companyId",
          c.symbol,
          c.name as "companyName",
          c.logo,
          dc.total_count,
          ROW_NUMBER() OVER (PARTITION BY DATE(t."scheduledAt") ORDER BY t."scheduledAt") as rn
        FROM "Transcript" t
        JOIN "Company" c ON t."companyId" = c.id
        JOIN DailyCounts dc ON DATE(t."scheduledAt") = dc.date
        WHERE 
          t."scheduledAt" >= ${startDate}
          AND t."scheduledAt" <= ${endDate}
          AND t.quarter IS NOT NULL
      )
      SELECT *
      FROM RankedTranscripts
      WHERE rn <= 12
      ORDER BY "scheduledAt" ASC;
    `;

    // Transform the raw SQL result into the expected format
    const transformedTranscripts = (result as any[]).map((row) => ({
      id: row.id,
      title: row.title,
      scheduledAt: row.scheduledAt,
      status: row.status,
      MarketTime: row.MarketTime,
      quarter: row.quarter,
      marketTime: row.MarketTime, // For frontend compatibility
      totalForDay: Number(row.total_count),
      company: {
        id: row.companyId,
        symbol: row.symbol,
        name: row.companyName,
        logo: row.logo,
      },
    }));

    return NextResponse.json({
      transcripts: transformedTranscripts,
    });
  } catch (error) {
    console.error("Error fetching month view data:", error);
    return new Response("Failed to fetch month view data", { status: 500 });
  }
}
