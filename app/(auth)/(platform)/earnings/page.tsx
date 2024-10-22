import NavBar from "@/components/NavBar";
import { AuthModal } from "@/components/modals/auth-modal";
import EarningsClient from "./components/client";
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

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <EarningsClient />
    </div>
  );
};

export default EarningsPage;
