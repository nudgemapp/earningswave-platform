import NavBar from "@/components/NavBar";
import EarningsClient from "./earnings/components/client";

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

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    console.error("Invalid date parameters:", { year, month, week, date });
    return {
      notFound: true,
    };
  }

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <EarningsClient />
    </div>
  );
};

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
