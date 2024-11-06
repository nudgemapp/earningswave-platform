import React, { useEffect } from "react";
import {
  Calendar,
  CalendarCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEarningsStore } from "@/store/EarningsStore";
import { useAuth } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";

interface CalendarNavbarProps {
  currentDate: Date;
  navigateMonth: (direction: number) => void;
  setCurrentDate: (date: Date) => void;
  view: "month" | "week";
  setView: (view: "month" | "week") => void;
}

const CalendarNavbar: React.FC<CalendarNavbarProps> = ({
  currentDate,
  navigateMonth,
  setCurrentDate,
  view,
  setView,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useAuth();
  const authModal = useAuthModal();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => currentDate.getFullYear() - 5 + i
  );

  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  useEffect(() => {
    const currentDate = new Date();
    const defaultMonth = currentDate.getMonth() + 1;
    const defaultYear = currentDate.getFullYear();

    // If month or year is not set in the URL, update the URL with default values
    if (!monthParam || !yearParam) {
      const params = new URLSearchParams(searchParams);
      if (!monthParam)
        params.set("month", defaultMonth.toString().padStart(2, "0"));
      if (!yearParam) params.set("year", defaultYear.toString());

      router.replace(`?${params.toString()}`);
    }
  }, [monthParam, yearParam, router, searchParams]);

  const handleNavigation = (direction: number) => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() + direction * 7);
      setCurrentDate(newDate);
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
      navigateMonth(direction);
    }
    updateURL(newDate);
  };

  const updateURL = (date: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", (date.getMonth() + 1).toString().padStart(2, "0"));
    params.set("year", date.getFullYear().toString());
    router.push(`?${params.toString()}`);
  };

  const handleWatchlistClick = () => {
    if (!userId) {
      authModal.onOpen();
      return;
    }

    useEarningsStore.setState({ showWatchlist: true });
  };

  return (
    <div className="bg-white dark:bg-slate-900 shadow-md py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => handleNavigation(-1)}
            variant="ghost"
            size="icon"
            className="hover:text-primary transition-colors duration-200"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-800 rounded-md p-1">
            <select
              value={currentDate.getMonth()}
              onChange={(e) => {
                const newDate = new Date(currentDate);
                newDate.setMonth(parseInt(e.target.value));
                updateURL(newDate);
                setCurrentDate(newDate);
              }}
              className="bg-transparent text-gray-700 dark:text-gray-200 font-medium focus:outline-none"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={(e) => {
                const newDate = new Date(currentDate);
                newDate.setFullYear(parseInt(e.target.value));
                updateURL(newDate);
                setCurrentDate(newDate);
              }}
              className="bg-transparent text-gray-700 dark:text-gray-200 font-medium focus:outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={() => handleNavigation(1)}
            variant="ghost"
            size="icon"
            className="hover:text-primary transition-colors duration-200"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="bg-white dark:bg-slate-900 hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-colors duration-200"
            onClick={handleWatchlistClick}
          >
            <StarIcon className="h-5 w-5 mr-2" />
            <span>Watchlist</span>
          </Button>
          <Button
            onClick={() => setView("month")}
            variant={view === "month" ? "default" : "outline"}
            className={`px-4 py-2 transition-colors duration-200 ${
              view === "month"
                ? "bg-primary dark:bg-primary hover:bg-primary/90 dark:hover:bg-primary/90 text-white dark:text-black"
                : "bg-white dark:bg-slate-900 hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
            }`}
          >
            {view === "month" ? (
              <CalendarCheckIcon className="w-4 h-4 mr-2" />
            ) : (
              <Calendar className="w-4 h-4 mr-2" />
            )}
            <span>Month</span>
          </Button>
          <Button
            onClick={() => setView("week")}
            variant={view === "week" ? "default" : "outline"}
            className={`px-4 py-2 transition-colors duration-200 ${
              view === "week"
                ? "bg-primary dark:bg-primary hover:bg-primary/90 dark:hover:bg-primary/90 text-white dark:text-black"
                : "bg-white dark:bg-slate-900 hover:bg-primary/10 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
            }`}
          >
            {view === "week" ? (
              <CalendarCheckIcon className="w-4 h-4 mr-2" />
            ) : (
              <Calendar className="w-4 h-4 mr-2" />
            )}
            <span>Week</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarNavbar;
