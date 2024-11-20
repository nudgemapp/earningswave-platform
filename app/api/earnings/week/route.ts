import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface TranscriptRow {
  id: string;
  title: string;
  scheduledAt: Date;
  status: string;
  MarketTime: string;
  quarter: string;
  companyId: string;
  symbol: string;
  companyName: string;
  logo: string;
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

  try {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoWeeksAgo = new Date(currentDate);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const result = await prisma.$queryRaw`
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
        c.logo
      FROM "Transcript" t
      JOIN "Company" c ON t."companyId" = c.id
      WHERE 
        t."scheduledAt" >= ${startDate}
        AND t."scheduledAt" <= ${endDate}
        AND t.quarter IS NOT NULL
        AND t.year IS NOT NULL
        AND (t.status != 'SCHEDULED' OR (t.status = 'SCHEDULED' AND t."scheduledAt" > ${twoWeeksAgo}))
      ORDER BY t."scheduledAt" ASC;
    `;

    const transformedTranscripts = (result as TranscriptRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      scheduledAt: row.scheduledAt,
      status: row.status,
      MarketTime: row.MarketTime,
      quarter: row.quarter,
      marketTime: row.MarketTime,
      company: {
        id: row.companyId,
        symbol: row.symbol,
        name: row.companyName,
        logo: row.logo,
      },
    }));

    console.log("Found Records:", {
      transcriptsCount: transformedTranscripts.length,
      firstTranscriptDate: transformedTranscripts[0]?.scheduledAt,
      lastTranscriptDate:
        transformedTranscripts[transformedTranscripts.length - 1]?.scheduledAt,
    });

    return NextResponse.json({ transcripts: transformedTranscripts });
  } catch (error) {
    console.error("Error fetching week view data:", error);
    return new Response("Failed to fetch week view data", { status: 500 });
  }
}
