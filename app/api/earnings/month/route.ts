import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get("year") || "");
  const month = parseInt(searchParams.get("month") || "");

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0));

  console.log("startDate", startDate);
  console.log("endDate", endDate);

  const data = await prisma.$transaction(async (tx) => {
    const [transcripts, reports] = await Promise.all([
      tx.earningsCallTranscript.findMany({
        where: { date: { gte: startDate, lt: endDate } },
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
        where: { reportDate: { gte: startDate, lt: endDate } },
        include: {
          company: {
            include: {
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

    const processedTranscripts = transcripts
      .filter((t) => t.company)
      .map((t) => ({
        id: t.id,
        date: t.date,
        title: t.title,
        company: t.company
          ? {
              id: t.company.id,
              symbol: t.company.symbol,
              name: t.company.name,
              logo: t.company.logo?.data
                ? `data:image/png;base64,${Buffer.from(
                    t.company.logo.data
                  ).toString("base64")}`
                : null,
            }
          : null,
      }));

    const processedReports = reports.map((r) => ({
      id: r.id,
      symbol: r.symbol,
      name: r.name,
      reportDate: r.reportDate,
      fiscalDateEnding: r.fiscalDateEnding,
      lastYearReportDate: r.lastYearReportDate,
    }));

    console.log("processedReports", processedReports);
    console.log("processedTranscripts", processedTranscripts);

    return {
      transcripts: processedTranscripts,
      reports: processedReports,
    };
  });

  return NextResponse.json(data);
}
