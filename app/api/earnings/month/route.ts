import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

// Add this interface before the GET function
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
  total_count: bigint; // SQL COUNT returns bigint
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

  try {
    const currentDate = new Date();

    const result = await prisma.$queryRaw<TranscriptQueryResult[]>`
      WITH DailyCounts AS (
        SELECT 
          DATE("scheduledAt") as date,
          COUNT(*) as total_count
        FROM "Transcript"
        WHERE 
          "scheduledAt" >= ${startDate}
          AND "scheduledAt" <= ${endDate}
          AND quarter IS NOT NULL
          AND (status != 'SCHEDULED' OR ("status" = 'SCHEDULED' AND "scheduledAt" > ${currentDate}))
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
          AND (t.status != 'SCHEDULED' OR (t.status = 'SCHEDULED' AND t."scheduledAt" > ${currentDate}))
      )
      SELECT *
      FROM RankedTranscripts
      WHERE rn <= 12
      ORDER BY "scheduledAt" ASC;
    `;

    // Update the transformation with proper typing
    const transformedTranscripts = result.map((row) => ({
      id: row.id,
      title: row.title,
      scheduledAt: row.scheduledAt,
      status: row.status,
      MarketTime: row.MarketTime,
      quarter: row.quarter,
      marketTime: row.MarketTime,
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
