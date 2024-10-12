import React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { companyNames } from "@/app/(auth)/(platform)/earnings/data";

const WeekView = ({
  weekDays,
  weekDates,
}: {
  weekDays: string[];
  weekDates: Date[];
}) => {
  const getRandomLogos = () => {
    if (Math.random() < 0.05) {
      return [];
    }
    const numLogos = Math.floor(Math.random() * 5);
    return shuffle([...companyNames]).slice(0, numLogos);
  };

  const shuffle = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const NoEarnings = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md">
      <div className="flex flex-row items-center space-x-2">
        <Calendar className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-500">No earnings</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col sm:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
      {weekDays.map((day, index) => {
        const dayContent = getRandomLogos();
        return (
          <div
            key={day}
            className="flex-1 flex flex-col border-b sm:border-b-0 sm:border-r last:border-r-0 border-gray-200"
          >
            <div className="p-3 text-center bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">{day}</h2>
              <p className="text-xs text-gray-500">
                {weekDates[index].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex-1 p-3 bg-white">
              {dayContent.length === 0 ? (
                <NoEarnings />
              ) : (
                <div className="grid grid-cols-2 gap-3 w-full h-full">
                  {dayContent.map((company, logoIndex) => (
                    <div
                      key={logoIndex}
                      className="aspect-square relative bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:border-blue-300"
                    >
                      <Image
                        src={`https://logo.clearbit.com/${company.toLowerCase()}.com`}
                        alt={`${company} logo`}
                        layout="fill"
                        objectFit="contain"
                        className="p-2"
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
  );
};

export default WeekView;
