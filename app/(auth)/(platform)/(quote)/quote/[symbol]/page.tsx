import NavBar from "@/components/NavBar";
import QuoteClient from "./components/client";

const QuotePage = async ({ params }: { params: { symbol: string } }) => {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <QuoteClient params={params} />
    </div>
  );
};

export default QuotePage;
