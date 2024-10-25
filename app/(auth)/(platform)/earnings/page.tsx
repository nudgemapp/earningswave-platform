import NavBar from "@/components/NavBar";
import EarningsClient from "./components/client";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../../lib/prismadb";
// import { getTranscripts } from "@/actions/get-transcripts";
// import { EarningsCallTranscript } from "@/types/EarningsTranscripts";
// import LoadingSpinner from "@/components/LoadingSpinner";
import { EarningsReport, Company, Logo } from "@prisma/client";

// const revalidate = 0;

type LogoWithBase64 = Omit<Logo, "data"> & {
  dataBase64?: string;
};

type CompanyWithLogo = Omit<Company, "logo"> & {
  logo: LogoWithBase64 | null;
};

export type EarningsReportWithCompany = Omit<EarningsReport, "company"> & {
  company: CompanyWithLogo | null;
};

const EarningsPage = async ({
  searchParams,
}: {
  searchParams: {
    month: string;
    year: string;
    page: string;
  };
}) => {
  let userInfo = null;
  const user = await currentUser();

  // Create start and end dates for the current month
  const startDate = new Date(`${searchParams.year}-${searchParams.month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(endDate.getDate() - 1); // Set to last day of the month

  const transcripts = await prisma.earningsCallTranscript.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
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
    orderBy: {
      date: "asc",
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
          ? `data:image/png;base64,${Buffer.from(transcript.logo.data).toString(
              "base64"
            )}`
          : null,
      },
      logo: undefined, // Remove the logo field from the response
    };
  });

  if (user) {
    userInfo = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        subscription: true,
      },
    });
  }

  const getLimitedReportsForDate = async (
    date: Date
  ): Promise<EarningsReportWithCompany[]> => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reports = await prisma.earningsReport.findMany({
      where: {
        reportDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        company: {
          include: {
            logo: true,
          },
        },
      },
      orderBy: {
        reportDate: "asc",
      },
      // take: 20,
    });

    // Convert logo data to base64 and remove the original data property
    return reports.map((report) => ({
      ...report,
      company: report.company
        ? {
            ...report.company,
            logo: report.company.logo
              ? {
                  ...report.company.logo,
                  dataBase64: report.company.logo.data
                    ? `data:image/png;base64,${Buffer.from(
                        report.company.logo.data
                      ).toString("base64")}`
                    : undefined,
                  data: undefined, // Remove the data property
                }
              : null,
          }
        : null,
    }));
  };

  const limitedEarningsReports: EarningsReportWithCompany[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const reportsForDay = await getLimitedReportsForDate(new Date(d));
    limitedEarningsReports.push(...reportsForDay);
  }

  // const app = new FirecrawlApp({
  //   apiKey: "fc-3fb876bc4fd34cae90f0fe09e7ad042a",
  // });

  // console.log(app);

  // const crawlResponse = await app.crawlUrl(
  //   "https://www.nasdaq.com/market-activity/earnings",
  //   {
  //     limit: 100,
  //     scrapeOptions: {
  //       formats: ["markdown", "html"],
  //     },
  //   }
  // );

  // const crawlResponse2 = await app.scrapeUrl(
  //   "https://finance.yahoo.com/calendar/earnings/",
  //   { formats: ["markdown", "html"] }
  // );

  // if (!crawlResponse2.success) {
  //   throw new Error(`Failed to crawl: ${crawlResponse2.error}`);
  // }

  // console.log(crawlResponse2);

  //XUDK7Q195S0UD5DX

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <EarningsClient
        userInfo={userInfo}
        // @ts-expect-error - Type mismatch between transcriptsWithLogos and expected prop type
        transcripts={transcriptsWithLogos}
        futureEarningsReports={limitedEarningsReports}
      />
    </div>
  );
};

export default EarningsPage;
