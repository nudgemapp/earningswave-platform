import NavBar from "@/components/NavBar";
import EarningsClient from "./components/client";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../../../lib/prismadb";

interface SearchParams {
  month?: string;
  year?: string;
  week?: string;
  date?: string;
  view?: "week" | "month";
}

const EarningsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const { userId } = await auth();

  // Default to current date if not provided
  const today = new Date();
  const year = searchParams.year
    ? parseInt(searchParams.year)
    : today.getFullYear();
  const month = searchParams.month
    ? parseInt(searchParams.month)
    : today.getMonth() + 1;
  const week = searchParams.week
    ? parseInt(searchParams.week)
    : getWeekNumber(today);
  const date = searchParams.date ? new Date(searchParams.date) : today;
  const view = searchParams.view || "week";

  // Validate inputs
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    console.error("Invalid date parameters:", { year, month, week, date });
    return {
      notFound: true,
    };
  }

  // Create date range
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0));

  console.log("Date Range:", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    year,
    month,
  });

  const [
    userInfo,
    // transactionResults
  ] = await Promise.all([
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            subscription: true,
          },
        })
      : null,

    // prisma.$transaction(async (tx) => {
    //   const transcripts = await tx.earningsCallTranscript.findMany({
    //     where: {
    //       date: {
    //         gte: startDate,
    //         lt: endDate,
    //       },
    //     },
    //     select: {
    //       id: true,
    //       date: true,
    //       title: true,
    //       company: {
    //         select: {
    //           id: true,
    //           symbol: true,
    //           name: true,
    //           logo: {
    //             select: {
    //               data: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //     orderBy: {
    //       date: "asc",
    //     },
    //   });

    //   const reports = await tx.earningsReport.findMany({
    //     where: {
    //       reportDate: {
    //         gte: startDate,
    //         lt: endDate,
    //       },
    //     },
    //     include: {
    //       company: {
    //         include: {
    //           logo: {
    //             select: {
    //               data: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //     orderBy: {
    //       reportDate: "asc",
    //     },
    //   });

    //   return { transcripts, reports };
    // }),
  ]);

  // const { transcripts, reports } = transactionResults;

  // const processedTranscripts: ProcessedTranscript[] = transcripts
  //   .filter((t) => t.company)
  //   .map((t) => ({
  //     id: t.id,
  //     date: t.date,
  //     title: t.title,
  //     company: t.company
  //       ? {
  //           id: t.company.id,
  //           symbol: t.company.symbol,
  //           name: t.company.name,
  //           logo: t.company.logo?.data
  //             ? `data:image/png;base64,${Buffer.from(
  //                 t.company.logo.data
  //               ).toString("base64")}`
  //             : null,
  //         }
  //       : null,
  //   }));

  // const processedReports: ProcessedReport[] = reports.map((r) => ({
  //   id: r.id,
  //   symbol: r.symbol,
  //   name: r.name,
  //   reportDate: r.reportDate,
  //   fiscalDateEnding: r.fiscalDateEnding,
  //   estimate: r.estimate,
  //   currency: r.currency,
  //   marketTiming: r.marketTiming,
  //   lastYearEPS: r.lastYearEPS,
  //   lastYearReportDate: r.lastYearReportDate,
  //   companyId: r.companyId,
  //   createdAt: r.createdAt,
  //   updatedAt: r.updatedAt,
  //   company: {
  //     id: r.company.id,
  //     symbol: r.company.symbol,
  //     name: r.company.name,
  //     marketCap: r.company.marketCap,
  //     price: r.company.price,
  //     revenue: r.company.revenue,
  //     logoId: r.company.logoId,
  //     createdAt: r.company.createdAt,
  //     updatedAt: r.company.updatedAt,
  //     logo: r.company.logo?.data
  //       ? `data:image/png;base64,${Buffer.from(r.company.logo.data).toString(
  //           "base64"
  //         )}`
  //       : null,
  //   },
  // }));

  // console.log("processedReports", processedReports);

  // console.log("processedTranscripts", processedTranscripts);

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <EarningsClient
        userInfo={userInfo}
        // transcripts={processedTranscripts}
        // reports={processedReports}
      />
    </div>
  );
};

// Helper function to get week number (same as in use-get-week-view.tsx)
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export default EarningsPage;
