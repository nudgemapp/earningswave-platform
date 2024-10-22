import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!month || !year) {
      return new NextResponse("Month and year are required query parameters", {
        status: 400,
      });
    }

    console.log(month, year);

    // Construct the date range for the query
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    console.log(startDate, endDate);

    const transcripts = await prisma.earningsCallTranscript.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        id: true,
        title: true,
        href: true,
        date: true,
        company_info: true,
        logo: {
          select: {
            data: true,
          },
        },
      },
    });

    const transcriptsWithLogos = transcripts.map((transcript) => {
      const companyInfo =
        typeof transcript.company_info === "object"
          ? transcript.company_info
          : {};
      return {
        ...transcript,
        company_info: {
          ...companyInfo,
          logo_base64: transcript.logo
            ? `data:image/png;base64,${Buffer.from(
                transcript.logo.data
              ).toString("base64")}`
            : null,
        },
        logo: undefined, // Remove the logo field from the response
      };
    });

    const totalCount = transcriptsWithLogos.length;

    return NextResponse.json({
      articles: transcriptsWithLogos,
      totalCount,
    });
  } catch (error) {
    console.error("[TRANSCRIPTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
