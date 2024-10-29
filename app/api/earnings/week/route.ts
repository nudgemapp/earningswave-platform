import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

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
              logo: { select: { data: true } },
            },
          },
        },
        orderBy: { date: "asc" },
      }),
      tx.earningsReport.findMany({
        where: {
          reportDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          company: {
            include: {
              logo: { select: { data: true } },
            },
          },
        },
        orderBy: { reportDate: "asc" },
      }),
    ]);

    return processData(transcripts, reports);
  });

  return NextResponse.json(data);
}
