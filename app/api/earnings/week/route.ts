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
    const currentDate = new Date();

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
        AND (t.status != 'SCHEDULED' OR (t.status = 'SCHEDULED' AND t."scheduledAt" > ${currentDate}))
      ORDER BY t."scheduledAt" ASC;
    `;

    const transformedTranscripts = (result as any[]).map((row) => ({
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
