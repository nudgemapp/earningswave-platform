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

  console.log("API Date Range:", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  try {
    const data = await prisma.$transaction(async (tx) => {
      const [transcripts, reports] = await Promise.all([
        tx.earningsCallTranscript.findMany({
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            id: true,
            date: true,
            title: true,
            company: {
              select: {
                id: true,
                symbol: true,
                name: true,
                logo: {
                  select: {
                    data: true,
                  },
                },
              },
            },
          },
          orderBy: {
            date: "asc",
          },
        }),
        tx.earningsReport.findMany({
          where: {
            reportDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            id: true,
            symbol: true,
            name: true,
            reportDate: true,
            fiscalDateEnding: true,
            estimate: true,
            currency: true,
            marketTiming: true,
            lastYearEPS: true,
            lastYearReportDate: true,
            companyId: true,
            company: {
              select: {
                id: true,
                symbol: true,
                name: true,
                logo: {
                  select: {
                    data: true,
                  },
                },
              },
            },
          },
          orderBy: {
            reportDate: "asc",
          },
        }),
      ]);

      console.log("Found Records:", {
        transcriptsCount: transcripts.length,
        reportsCount: reports.length,
        firstTranscriptDate: transcripts[0]?.date,
        lastTranscriptDate: transcripts[transcripts.length - 1]?.date,
        firstReportDate: reports[0]?.reportDate,
        lastReportDate: reports[reports.length - 1]?.reportDate,
      });

      return {
        transcripts,
        reports,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching week view data:", error);
    return new Response("Failed to fetch week view data", { status: 500 });
  }
}
