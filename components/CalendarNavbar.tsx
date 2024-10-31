import React, { useEffect } from "react";
import {
  Calendar,
  CalendarCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

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

  const handleMonthNavigation = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    updateURL(newDate);
    navigateMonth(direction);
  };

  const handleWeekNavigation = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    updateURL(newDate);
    setCurrentDate(newDate);
  };

  const updateURL = (date: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", (date.getMonth() + 1).toString().padStart(2, "0"));
    params.set("year", date.getFullYear().toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white shadow-md py-4 px-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() =>
              view === "week"
                ? handleWeekNavigation(-1)
                : handleMonthNavigation(-1)
            }
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="flex items-center space-x-2 bg-gray-50 rounded-md p-1">
            <select
              value={currentDate.getMonth()}
              onChange={(e) => {
                const newDate = new Date(currentDate);
                newDate.setMonth(parseInt(e.target.value));
                updateURL(newDate);
                setCurrentDate(newDate);
              }}
              className="bg-transparent text-gray-700 font-medium focus:outline-none"
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
              className="bg-transparent text-gray-700 font-medium focus:outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={() =>
              view === "week"
                ? handleWeekNavigation(1)
                : handleMonthNavigation(1)
            }
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setView("month")}
            variant={view === "month" ? "default" : "outline"}
            className="px-4 py-2"
          >
            {view === "month" ? (
              <CalendarCheckIcon className="w-4 h-4 mr-2" />
            ) : (
              <Calendar className="w-4 h-4 mr-2" />
            )}
            Month
          </Button>
          <Button
            onClick={() => setView("week")}
            variant={view === "week" ? "default" : "outline"}
            className="px-4 py-2"
          >
            {view === "week" ? (
              <CalendarCheckIcon className="w-4 h-4 mr-2" />
            ) : (
              <Calendar className="w-4 h-4 mr-2" />
            )}
            Week
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarNavbar;
