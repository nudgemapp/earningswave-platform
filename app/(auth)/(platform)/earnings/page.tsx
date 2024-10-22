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
  // const transcripts = await getTranscripts({
  //   filterParams: searchParams,
  //   paginationParams: { page: 1, pageSize: 10 },
  // });

  // console.log(transcripts);
  const user = await currentUser();
  let userInfo = null;

  if (user) {
    userInfo = await prisma.user.findUnique({
      where: {
        id: user?.id,
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
      <EarningsClient userInfo={userInfo} />
    </div>
  );
};

export default EarningsPage;
