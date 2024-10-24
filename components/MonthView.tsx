import React from "react";
import Image from "next/image";

import { Calendar } from "lucide-react";
import { equals, filter, path, pipe } from "ramda";
import { EarningsCallTranscript, EarningsReport } from "@prisma/client";
// import { companyNames } from "@/app/(auth)/(platform)/earnings/data";

interface MonthViewProps {
  currentDate: Date;
  transcripts: EarningsCallTranscript[];
  handleCompanyClick: (transcriptInfo: EarningsCallTranscript) => void;
  futureEarningsReports: EarningsReport[];
  handleFutureEarningsClick: (report: EarningsReport) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  transcripts,
  handleCompanyClick,
  futureEarningsReports,
  handleFutureEarningsClick,
}) => {
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

  console.log(futureEarningsReports);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getLogosForDate = (
    date: Date,
    transcripts: EarningsCallTranscript[]
  ) => {
    // Extract the date in the format "MMM DD YYYY"
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    // Filter transcripts for the given date
    const matchingTranscripts = filter(
      pipe((transcript) => {
        const transcriptDate = path(["company_info", "date"], transcript);
        return equals(transcriptDate, formattedDate);
      }),
      transcripts
    );

    if (matchingTranscripts.length > 0) {
      return matchingTranscripts;
    }
    return [];
  };

  const getReportsForDate = (date: Date, reports: EarningsReport[]) => {
    // Extract the date in the format "MMM DD YYYY"
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    // Filter reports for the given date
    const matchingReports = filter(
      pipe((report) => {
        const reportDate = report.reportDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
        return equals(reportDate, formattedDate);
      }),
      reports
    );

    if (matchingReports.length > 0) {
      return matchingReports;
    }
    return [];
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
    <div className="h-full flex flex-col bg-white relative">
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
        {getDaysInMonth(currentDate).map((date, index) => {
          const dayContent = getLogosForDate(date, transcripts);
          const dayReports = getReportsForDate(date, futureEarningsReports);
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
                {dayContent.length === 0 && dayReports.length === 0 ? (
                  <div className="w-full h-full">
                    <NoEarnings />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 w-full h-full">
                    {dayContent.map((transcriptInfo, logoIndex) => (
                      <div
                        key={logoIndex}
                        className="aspect-square sm:w-8 sm:h-8 relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:z-10 cursor-pointer"
                        onClick={() => handleCompanyClick(transcriptInfo)}
                      >
                        <Image
                          src={
                            (
                              transcriptInfo.company_info as {
                                logo_base64?: string;
                              }
                            )?.logo_base64 || ""
                          }
                          alt={`${
                            (
                              transcriptInfo.company_info as {
                                company_name?: string;
                              }
                            )?.company_name || "Company"
                          } logo`}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    ))}
                    {dayReports.map((report, reportIndex) => (
                      <div
                        key={reportIndex}
                        className="aspect-square sm:w-8 sm:h-8 relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:z-10 cursor-pointer"
                        title={`${report.name} (${report.symbol})`}
                        onClick={() => handleFutureEarningsClick(report)}
                      >
                        <span className="text-xs">{report.symbol}</span>
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
