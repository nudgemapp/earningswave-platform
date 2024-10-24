import NavBar from "@/components/NavBar";
import EarningsClient from "./components/client";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../../lib/prismadb";
// import { getTranscripts } from "@/actions/get-transcripts";
// import { EarningsCallTranscript } from "@/types/EarningsTranscripts";
// import LoadingSpinner from "@/components/LoadingSpinner";
import FirecrawlApp from "@mendable/firecrawl-js";

// const revalidate = 0;

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

  console.log("startDate:", startDate);
  console.log("endDate:", endDate);

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

  console.log(transcripts);

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
    console.log(userInfo);
  }

  const app = new FirecrawlApp({
    apiKey: "fc-3fb876bc4fd34cae90f0fe09e7ad042a",
  });

  console.log(app);

  // const crawlResponse = await app.crawlUrl(
  //   "https://www.nasdaq.com/market-activity/earnings",
  //   {
  //     limit: 100,
  //     scrapeOptions: {
  //       formats: ["markdown", "html"],
  //     },
  //   }
  // );

  const crawlResponse2 = await app.scrapeUrl(
    "https://finance.yahoo.com/calendar/earnings/",
    { formats: ["markdown", "html"] }
  );

  if (!crawlResponse2.success) {
    throw new Error(`Failed to crawl: ${crawlResponse2.error}`);
  }

  console.log(crawlResponse2);

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <EarningsClient
        userInfo={userInfo}
        // @ts-expect-error - Type mismatch between transcriptsWithLogos and expected prop type
        transcripts={transcriptsWithLogos}
      />
    </div>
  );
};

export default EarningsPage;
