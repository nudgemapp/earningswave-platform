import React, { useState, useEffect } from "react";
import Image from "next/image";

import { Calendar } from "lucide-react";
import { companyNames } from "@/app/(auth)/(platform)/earnings/data";

interface MonthViewProps {
  currentDate: Date;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate }) => {
  const [renderedDays, setRenderedDays] = useState<Date[]>([]);

  useEffect(() => {
    setRenderedDays(getDaysInMonth(currentDate));
  }, [currentDate]);

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: Date[] = [];

    // Add padding days from previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(new Date(year, month, -firstDayOfMonth + i + 1));
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    // Remove padding days from next month
    return days.slice(0, firstDayOfMonth + daysInMonth);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getLogosForDate = (date: Date) => {
    // Use the date to seed the random number generator
    const seed =
      date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
    const rng = seedRandom(seed);

    // Determine the number of logos (0 to 8)
    const numLogos = Math.floor(rng() * 9);

    // If numLogos is 0, return an empty array
    if (numLogos === 0) {
      return [];
    }

    // Use the seeded random number generator to select companies
    const selectedCompanies = [];
    for (let i = 0; i < numLogos; i++) {
      const index = Math.floor(rng() * companyNames.length);
      selectedCompanies.push(companyNames[index]);
    }

    return selectedCompanies;
  };

  const seedRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
  };

  const NoEarnings = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-sm">
      <div className="flex flex-row items-center space-y-1 gap-2">
        <Calendar className="w-6 h-6 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">No earnings</span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="grid grid-cols-7 py-2 bg-gray-100">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-100 py-1 text-center text-xs text-gray-600 font-bold"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 flex-grow">
        {renderedDays.map((date, index) => {
          const dayContent = getLogosForDate(date);
          return (
            <div
              key={index}
              className={`bg-white p-1 text-center flex flex-col ${
                date.getMonth() !== currentDate.getMonth()
                  ? "text-gray-400"
                  : "text-gray-800"
              } ${
                date.toDateString() === new Date().toDateString()
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              <span className="text-xs">{date.getDate()}</span>
              <div className="flex-grow flex flex-wrap justify-center items-center mt-1">
                {dayContent.length === 0 ? (
                  <div className="w-full h-full">
                    <NoEarnings />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 w-full h-full">
                    {dayContent.map((company, logoIndex) => (
                      <div
                        key={logoIndex}
                        className="aspect-square sm:w-8 sm:h-8 relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:z-10"
                      >
                        <Image
                          src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                          alt={`${company} logo`}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
