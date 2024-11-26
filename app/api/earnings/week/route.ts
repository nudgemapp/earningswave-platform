import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

interface EarningsQueryResult {
  id: string;
  symbol: string;
  quarter: number;
  year: number;
  earningsDate: Date;
  earningsTime: string;
  isDateConfirmed: boolean;
  marketCap: number | null;
  companyId: string;
  companyName: string | null;
  logo: string | null;
  description: string;
  currency: string;
  marketCapitalization: number | null;
  weburl: string | null;
  finnhubIndustry: string | null;
  exchange: string | null;
  total_for_day: bigint;
  remaining_count: bigint;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let startDate = new Date(searchParams.get("startDate") || "");

  // Adjust to Monday of the current week
  const day = startDate.getUTCDay();
  const diff = startDate.getUTCDate() - day + (day === 0 ? -6 : 1);
  startDate = new Date(startDate);
  startDate.setUTCDate(diff);
  startDate.setUTCHours(0, 0, 0, 0);

  // Set end date to Friday of the same week
  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 4);
  endDate.setUTCHours(23, 59, 59, 999);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return new Response("Invalid date parameters", { status: 400 });
  }

  console.log("API Date Range:", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  try {
    const result = await prisma.$queryRaw<EarningsQueryResult[]>`
      WITH DailyEarnings AS (
        SELECT 
          e.id,
          e.symbol,
          e.quarter,
          e.year,
          e."earningsDate",
          e."earningsTime",
          e."isDateConfirmed",
          e."marketCap",
          c.id as "companyId",
          c.name as "companyName",
          c.logo,
          c.description,
          c.currency,
          c."marketCapitalization",
          c.weburl,
          c."finnhubIndustry",
          c.exchange,
          COUNT(*) OVER (PARTITION BY DATE(e."earningsDate")) as total_for_day
        FROM "Earnings" e
        LEFT JOIN "Company" c ON e.symbol = c.symbol
        WHERE 
          e."earningsDate" >= ${startDate}
          AND e."earningsDate" <= ${endDate}
      )
      SELECT 
        *,
        (total_for_day - 1) as remaining_count
      FROM DailyEarnings
      ORDER BY "earningsDate" ASC;
    `;

    const transformedEarnings = result.map((row) => ({
      id: row.id,
      symbol: row.symbol,
      quarter: row.quarter,
      year: row.year,
      earningsDate: row.earningsDate,
      earningsTime: row.earningsTime,
      isDateConfirmed: row.isDateConfirmed,
      marketCap: row.marketCap,
      totalForDay: Number(row.total_for_day),
      remainingCount: Math.max(0, Number(row.remaining_count)),
      company: {
        id: row.companyId || null,
        symbol: row.symbol,
        name: row.companyName || null,
        logo: row.logo || null,
        description: row.description || null,
        currency: row.currency || null,
        marketCapitalization: row.marketCapitalization || null,
        weburl: row.weburl || null,
        finnhubIndustry: row.finnhubIndustry || null,
        exchange: row.exchange || null,
      },
    }));

    console.log("Total earnings count:", transformedEarnings.length);

    return NextResponse.json({
      earnings: transformedEarnings,
    });
  } catch (error) {
    console.error("Error fetching week view data:", error);
    return new Response("Failed to fetch week view data", { status: 500 });
  }
}
