// app/api/earnings/report/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new NextResponse("Missing ID", { status: 400 });
  }

  try {
    // Get transcript with company info and participants
    const result = await prisma.$queryRaw`
      WITH transcript_speeches AS (
        SELECT 
          p.id as participant_id,
          p.name as participant_name,
          p.role as participant_role,
          p.description as participant_description,
          json_agg(
            json_build_object(
              'id', s.id,
              'content', s.content,
              'sequence', s.sequence,
              'sessionType', s."sessionType",
              'createdAt', s."createdAt"
            ) ORDER BY s.sequence
          ) as speeches
        FROM "Participant" p
        LEFT JOIN "Speech" s ON s."participantId" = p.id
        WHERE p."transcriptId" = ${params.id}
        GROUP BY p.id, p.name, p.role, p.description
      )
      SELECT 
        t.id,
        t.title,
        t."scheduledAt",
        t.quarter,
        t.year,
        t."audioUrl",
        t."MarketTime",
        t.status,
        t."epsActual",
        t."epsEstimate",
        t."revenueActual",
        t."revenueEstimate",
        t."fullText",
        t.speakers,
        c.id as "companyId",
        c.currency,
        c.description as "companyDescription",
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
        c."marketCapitalization",
        c.name as "companyName",
        c.phone,
        c."sharesOutstanding",
        c.weburl,
        c.logo,
        c."finnhubIndustry",
        json_agg(
          json_build_object(
            'id', ts.participant_id,
            'name', ts.participant_name,
            'role', ts.participant_role,
            'description', ts.participant_description,
            'speeches', ts.speeches
          )
        ) as participants
      FROM "Transcript" t
      JOIN "Company" c ON t."companyId" = c.id
      LEFT JOIN transcript_speeches ts ON t.id = ${params.id}
      WHERE t.id = ${params.id}
      GROUP BY 
        t.id, t.title, t."scheduledAt", t.quarter, t.year, 
        t."audioUrl", t."MarketTime", t.status, t."epsActual", 
        t."epsEstimate", t."revenueActual", t."revenueEstimate", 
        t."fullText", t.speakers, c.id, c.currency, c.description, 
        c."displaySymbol", c.figi, c.isin, c.mic, c."shareClassFIGI", 
        c.symbol, c.symbol2, c.type, c.country, c.exchange, c.ipo, 
        c."marketCapitalization", c.name, c.phone, c."sharesOutstanding", 
        c.weburl, c.logo, c."finnhubIndustry"
    `;

    const transcript = (result as any[])[0];

    if (!transcript) {
      return new NextResponse("Transcript not found", { status: 404 });
    }

    // Transform the data to match your expected format
    const transformedData = {
      id: transcript.id,
      title: transcript.title,
      scheduledAt: transcript.scheduledAt,
      quarter: transcript.quarter,
      year: transcript.year,
      audioUrl: transcript.audioUrl,
      marketTime: transcript.MarketTime,
      status: transcript.status,
      financials: {
        epsActual: transcript.epsActual,
        epsEstimate: transcript.epsEstimate,
        revenueActual: transcript.revenueActual,
        revenueEstimate: transcript.revenueEstimate,
      },
      fullText: transcript.fullText,
      speakers: transcript.speakers,
      company: {
        id: transcript.companyId,
        currency: transcript.currency,
        description: transcript.companyDescription,
        displaySymbol: transcript.displaySymbol,
        figi: transcript.figi,
        isin: transcript.isin,
        mic: transcript.mic,
        shareClassFIGI: transcript.shareClassFIGI,
        symbol: transcript.symbol,
        symbol2: transcript.symbol2,
        type: transcript.type,
        country: transcript.country,
        exchange: transcript.exchange,
        ipo: transcript.ipo,
        marketCapitalization: transcript.marketCapitalization,
        name: transcript.companyName,
        phone: transcript.phone,
        sharesOutstanding: transcript.sharesOutstanding,
        weburl: transcript.weburl,
        logo: transcript.logo,
        finnhubIndustry: transcript.finnhubIndustry,
      },
      participants: transcript.participants.map((p: any) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        description: p.description,
        speeches: p.speeches,
      })),
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return new NextResponse("Error fetching transcript", { status: 500 });
  }
}
