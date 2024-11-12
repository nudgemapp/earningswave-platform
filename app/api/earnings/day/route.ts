import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface TranscriptRow {
  id: string;
  title: string;
  scheduledAt: Date;
  quarter: string;
  year: number;
  MarketTime: string;
  epsActual: number | null;
  epsEstimate: number | null;
  revenueActual: number | null;
  revenueEstimate: number | null;
  companyId: string;
  symbol: string;
  companyName: string;
  logo: string | null;
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
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoWeeksAgo = new Date(currentDate);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    console.log("Fetching day view data", currentDate);

    const result = await prisma.$queryRaw`
      SELECT 
        t.id,
        t.title,
        t."scheduledAt",
        t.quarter,
        t.year,
        t."MarketTime",
        t."epsActual",
        t."epsEstimate",
        t."revenueActual",
        t."revenueEstimate",
        c.id as "companyId",
        c.symbol,
        c.name as "companyName",
        c.logo
      FROM "Transcript" t
      JOIN "Company" c ON t."companyId" = c.id
      WHERE 
        t."scheduledAt" >= ${startDate}
        AND t."scheduledAt" <= ${endDate}
        AND t.quarter IS NOT NULL
        AND (t.status != 'SCHEDULED' OR (t.status = 'SCHEDULED' AND t."scheduledAt" > ${twoWeeksAgo}))
      ORDER BY t."scheduledAt" ASC;
    `;

    const processedTranscripts = (result as TranscriptRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      scheduledAt: row.scheduledAt,
      quarter: row.quarter,
      year: row.year,
      MarketTime: row.MarketTime,
      epsActual: row.epsActual,
      epsEstimate: row.epsEstimate,
      revenueActual: row.revenueActual,
      revenueEstimate: row.revenueEstimate,
      company: {
        id: row.companyId,
        symbol: row.symbol,
        name: row.companyName,
        logo: row.logo || null,
      },
    }));

    return NextResponse.json({ transcripts: processedTranscripts });
  } catch (error) {
    console.error("Error fetching day view data:", error);
    return new Response("Failed to fetch day view data", { status: 500 });
  }
}
