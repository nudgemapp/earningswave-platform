import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="bg-gray-100 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <select
            value={currentDate.getMonth()}
            onChange={(e) => {
              const newDate = new Date(currentDate);
              newDate.setMonth(parseInt(e.target.value));
              setCurrentDate(newDate);
            }}
            className="bg-white border border-gray-300 rounded-md px-2 py-1"
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
              setCurrentDate(newDate);
            }}
            className="bg-white border border-gray-300 rounded-md px-2 py-1"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setView("month")}
            className="px-4 py-2 rounded-md"
            variant={view === "month" ? "default" : "outline"}
          >
            Month
          </Button>
          <Button
            onClick={() => setView("week")}
            className="px-4 py-2 rounded-md"
            variant={view === "week" ? "default" : "outline"}
          >
            Week
          </Button>
          <Button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-md"
            variant="outline"
          >
            Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarNavbar;
