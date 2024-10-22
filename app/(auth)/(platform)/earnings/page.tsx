import NavBar from "@/components/NavBar";
import EarningsClient from "./components/client";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../../lib/prismadb";
// import { getTranscripts } from "@/actions/get-transcripts";
// import { EarningsCallTranscript } from "@/types/EarningsTranscripts";
// import LoadingSpinner from "@/components/LoadingSpinner";

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
