"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, FilterIcon } from "lucide-react";
import { useState } from "react";
import PlatformNavbar from "@/components/PlatformNavbar";

const EarningsPage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekDays = ["MON", "TUE", "WED", "THU", "FRI"];

  const getWeekDates = (date: Date) => {
    const week = [];
    const monday = new Date(date);
    monday.setDate(date.getDate() - date.getDay() + 1);

    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newDate);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <PlatformNavbar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-100 pb-4 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateWeek(-1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-lg font-semibold">
                {currentWeek.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() => navigateWeek(1)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="px-4 py-2 rounded-md" variant="outline">
                Today
              </Button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FilterIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {weekDays.map((day, index) => (
            <div key={day} className="flex-1 flex flex-col relative">
              {index < weekDays.length - 1 && (
                <div className="absolute right-0 top-4 bottom-4 w-px bg-gray-300" />
              )}
              <div className="p-2 text-center bg-gray-100 relative">
                <h2 className="text-lg font-semibold">{day}</h2>
                <p className="text-sm text-gray-600">
                  {weekDates[index].toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gray-300" />
              </div>
              <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
                <div className="flex-1 p-2">
                  {/* Add earnings events here */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
