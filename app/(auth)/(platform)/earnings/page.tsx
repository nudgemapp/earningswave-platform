import NavBar from "@/components/NavBar";
import EarningsClient from "./components/client";
import { auth } from "@clerk/nextjs/server";
import prisma from "../../../../lib/prismadb";
// import { getTranscripts } from "@/actions/get-transcripts";
// import { EarningsCallTranscript } from "@/types/EarningsTranscripts";
// import LoadingSpinner from "@/components/LoadingSpinner";
import { EarningsReport, Company, Logo, Subscription } from "@prisma/client";

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

// Define a type for UserInfo
type UserInfo = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  subscription: Subscription | null;
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
  let userInfo: UserInfo = {
    id: "",
    firstName: null,
    lastName: null,
    email: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    subscription: null,
  };
  const { userId } = await auth();

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

  if (userId) {
    try {
      const fetchedUserInfo = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          subscription: true,
        },
      });
      if (fetchedUserInfo) {
        userInfo = fetchedUserInfo as UserInfo;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  } else {
    console.log("No userId found");
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
