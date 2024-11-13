import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface TranscriptQueryResult {
  id: string;
  title: string | null;
  scheduledAt: Date;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  MarketTime: "BMO" | "AMC" | "DMH" | "UNKNOWN";
  quarter: number;
  companyId: string;
  symbol: string;
  companyName: string | null;
  logo: string | null;
  total_for_day: bigint;
  remaining_count: bigint;
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
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoWeeksAgo = new Date(currentDate);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const result = await prisma.$queryRaw<TranscriptQueryResult[]>`
      WITH RankedTranscripts AS (
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
          COUNT(*) OVER (PARTITION BY DATE(t."scheduledAt")) as total_for_day,
          ROW_NUMBER() OVER (
            PARTITION BY DATE(t."scheduledAt"), t."MarketTime" 
            ORDER BY t."scheduledAt"
          ) as market_time_rank
        FROM "Transcript" t
        JOIN "Company" c ON t."companyId" = c.id
        WHERE 
          t."scheduledAt" >= ${startDate}
          AND t."scheduledAt" <= ${endDate}
          AND t.quarter IS NOT NULL
          AND (t.status != 'SCHEDULED' OR (t.status = 'SCHEDULED' AND t."scheduledAt" > ${twoWeeksAgo}))
      )
      SELECT 
        *,
        (total_for_day - 11) as remaining_count
      FROM RankedTranscripts
      WHERE 
        ("MarketTime" = 'AMC' AND market_time_rank <= 4)
        OR ("MarketTime" = 'BMO' AND market_time_rank <= 4)
        OR ("MarketTime" = 'DMH' AND market_time_rank <= 3)
      ORDER BY "scheduledAt" ASC;
    `;

    const transformedTranscripts = result.map((row) => ({
      id: row.id,
      title: row.title,
      scheduledAt: row.scheduledAt,
      status: row.status,
      MarketTime: row.MarketTime,
      quarter: row.quarter,
      totalForDay: Number(row.total_for_day),
      remainingCount: Math.max(0, Number(row.remaining_count)),
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
