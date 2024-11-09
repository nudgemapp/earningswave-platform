import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new NextResponse("Missing company ID", { status: 400 });
  }

  try {
    const result = await prisma.$queryRaw`
      WITH company_stats AS (
        SELECT 
          "companyId",
          COUNT(*)::integer as total_transcripts,
          COUNT(*) FILTER (WHERE status = 'COMPLETED')::integer as completed_transcripts,
          COUNT(*) FILTER (WHERE status = 'SCHEDULED')::integer as scheduled_transcripts,
          MAX("scheduledAt") as latest_transcript,
          MIN("scheduledAt") as earliest_transcript
        FROM "Transcript"
        WHERE "companyId" = ${params.id}
        GROUP BY "companyId"
      )
      SELECT 
        c.id,
        c.currency,
        c.description,
        c."displaySymbol",
        c.figi,
        c.isin,
        c.mic,
        c."shareClassFIGI",
        c.symbol,
        c.symbol2,
        c.type,
        c.country,
        c.exchange,
        c.ipo,
        CAST(c."marketCapitalization" AS FLOAT) as "marketCapitalization",
        c.name,
        c.phone,
        CAST(c."sharesOutstanding" AS FLOAT) as "sharesOutstanding",
        c.weburl,
        c.logo,
        c."finnhubIndustry",
        c."createdAt",
        c."updatedAt",
        COALESCE(cs.total_transcripts, 0) as total_transcripts,
        COALESCE(cs.completed_transcripts, 0) as completed_transcripts,
        COALESCE(cs.scheduled_transcripts, 0) as scheduled_transcripts,
        cs.latest_transcript,
        cs.earliest_transcript,
        (
          SELECT json_agg(
            json_build_object(
              'id', t.id,
              'title', t.title,
              'scheduledAt', t."scheduledAt",
              'status', t.status,
              'marketTime', t."MarketTime",
              'quarter', t.quarter,
              'year', t.year,
              'epsActual', CAST(t."epsActual" AS FLOAT),
              'epsEstimate', CAST(t."epsEstimate" AS FLOAT),
              'revenueActual', CAST(t."revenueActual" AS FLOAT),
              'revenueEstimate', CAST(t."revenueEstimate" AS FLOAT)
            )
          )
          FROM (
            SELECT *
            FROM "Transcript"
            WHERE "companyId" = ${params.id}
            ORDER BY "scheduledAt" DESC
            LIMIT 4
          ) t
        ) as recent_transcripts
      FROM "Company" c
      LEFT JOIN company_stats cs ON c.id = cs."companyId"
      WHERE c.id = ${params.id}
    `;

    const company = (result as any[])[0];

    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    // Transform the data to match your expected format
    const transformedData = {
      id: company.id,
      currency: company.currency,
      description: company.description,
      displaySymbol: company.displaySymbol,
      figi: company.figi,
      isin: company.isin,
      mic: company.mic,
      shareClassFIGI: company.shareClassFIGI,
      symbol: company.symbol,
      symbol2: company.symbol2,
      type: company.type,
      country: company.country,
      exchange: company.exchange,
      ipo: company.ipo ? new Date(company.ipo).toISOString() : null,
      marketCapitalization: company.marketCapitalization,
      name: company.name,
      phone: company.phone,
      sharesOutstanding: company.sharesOutstanding,
      weburl: company.weburl,
      logo: company.logo,
      finnhubIndustry: company.finnhubIndustry,
      stats: {
        totalTranscripts: company.total_transcripts,
        completedTranscripts: company.completed_transcripts,
        scheduledTranscripts: company.scheduled_transcripts,
        latestTranscript: company.latest_transcript
          ? new Date(company.latest_transcript).toISOString()
          : null,
        earliestTranscript: company.earliest_transcript
          ? new Date(company.earliest_transcript).toISOString()
          : null,
      },
      recentTranscripts: company.recent_transcripts || [],
      createdAt: new Date(company.createdAt).toISOString(),
      updatedAt: new Date(company.updatedAt).toISOString(),
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching company:", error);
    return new NextResponse("Error fetching company data", { status: 500 });
  }
}
