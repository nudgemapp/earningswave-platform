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
    <div className="bg-white shadow-md py-4 px-6 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigateMonth(-1)}
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
            onClick={() => navigateMonth(1)}
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
            Month
          </Button>
          <Button
            onClick={() => setView("week")}
            variant={view === "week" ? "default" : "outline"}
            className="px-4 py-2"
          >
            Week
          </Button>
          <Button
            onClick={() => setCurrentDate(new Date())}
            variant="outline"
            className="px-4 py-2"
          >
            Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarNavbar;
