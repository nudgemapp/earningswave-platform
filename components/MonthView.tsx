import React from "react";
import Image from "next/image";

import { Calendar, Sun, Moon, LucideIcon } from "lucide-react";
import {
  ProcessedReport,
  ProcessedTranscript,
} from "@/app/(auth)/(platform)/earnings/types";

interface MonthViewProps {
  currentDate: Date;
  transcripts: ProcessedTranscript[];
  handleCompanyClick: (transcriptInfo: ProcessedTranscript) => void;
  futureEarningsReports: ProcessedReport[];
  handleFutureEarningsClick: (report: ProcessedReport) => void;
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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getLogosForDate = (date: Date, transcripts: ProcessedTranscript[]) => {
    // Extract the date in the format "MMM DD YYYY"
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    // Filter transcripts for the given date
    return transcripts.filter((transcript) => {
      const transcriptDate = transcript.date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      return transcriptDate === formattedDate;
    });
  };

  const getReportsForDate = (date: Date, reports: ProcessedReport[]) => {
    // Extract the date in the format "MMM DD YYYY"
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    // Filter reports for the given date
    return reports.filter((report) => {
      const reportDate = report.reportDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      return reportDate === formattedDate;
    });
  };

  const NoEarnings = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-sm">
      <div className="flex flex-row items-center space-y-1 gap-2">
        <Calendar className="w-6 h-6 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">No earnings</span>
      </div>
    </div>
  );

  console.log("futureEarningsReports", futureEarningsReports);

  const MarketTimingGroup = ({
    title,
    icon: Icon,
    reports,
    bgColor,
    handleFutureEarningsClick,
  }: {
    title: string;
    icon: LucideIcon;
    reports: ProcessedReport[];
    bgColor: string;
    handleFutureEarningsClick: (report: ProcessedReport) => void;
  }) => {
    if (reports.length === 0) return null;

    return (
      <div className={`p-1 rounded-md mb-1 ${bgColor}`}>
        <div className="flex items-center gap-1 mb-1">
          <Icon className="w-3 h-3 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">{title}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {reports.map((report, reportIndex) => (
            <div
              key={`report-${reportIndex}`}
              className="aspect-square w-full relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:z-10 cursor-pointer flex flex-col"
              title={`${report.name} (${
                report.symbol
              }) - ${report.marketTiming?.replace("_", " ")}`}
              onClick={() => handleFutureEarningsClick(report)}
            >
              <div className="flex-1 relative">
                {report.company?.logo ? (
                  <Image
                    src={report.company.logo}
                    alt={`${report.name} logo`}
                    layout="fill"
                    objectFit="contain"
                    className="p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[10px] font-medium">
                      {report.symbol}
                    </span>
                  </div>
                )}
              </div>
              <div
                className={`w-full py-0.5 px-1 border-t border-gray-200 ${bgColor}`}
              >
                <span className="text-[10px] font-medium text-gray-800 block text-center truncate">
                  {report.symbol}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          return (
            <div
              key={index}
              className={`bg-white p-1 text-center flex flex-col min-h-[100px] ${
                !isCurrentMonth ? "text-gray-400 bg-gray-50" : "text-gray-800"
              } ${
                date.toDateString() === new Date().toDateString()
                  ? "bg-blue-50"
                  : ""
              }`}
            >
              <span className="text-xs mb-1">{date.getDate()}</span>
              <div className="flex-grow">
                {dayContent.length === 0 && dayReports.length === 0 ? (
                  <div className="w-full h-full">
                    <NoEarnings />
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* Regular transcripts */}
                    {dayContent.length > 0 && (
                      <div className="grid grid-cols-3 gap-1 mb-1">
                        {dayContent.map((transcript, logoIndex) => (
                          <div
                            key={`transcript-${logoIndex}`}
                            className="aspect-square w-full relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:z-10 cursor-pointer flex flex-col"
                            onClick={() => handleCompanyClick(transcript)}
                          >
                            <div className="flex-1 relative">
                              {transcript.company?.logo ? (
                                <Image
                                  src={transcript.company.logo}
                                  alt={`${transcript.company.name} logo`}
                                  layout="fill"
                                  objectFit="contain"
                                  className="p-1"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-[10px] font-medium">
                                    {transcript.company?.symbol || ""}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="w-full bg-gray-50 py-0.5 px-1 border-t border-gray-200">
                              <span className="text-[10px] font-medium text-gray-800 block text-center truncate">
                                {transcript.company?.symbol || ""}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pre-market reports */}
                    <MarketTimingGroup
                      title="Pre-Market"
                      icon={Sun}
                      reports={dayReports.filter(
                        (r) => r.marketTiming === "PRE_MARKET"
                      )}
                      bgColor="bg-blue-50"
                      handleFutureEarningsClick={handleFutureEarningsClick}
                    />

                    {/* After-hours reports */}
                    <MarketTimingGroup
                      title="After Hours"
                      icon={Moon}
                      reports={dayReports.filter(
                        (r) => r.marketTiming === "AFTER_HOURS"
                      )}
                      bgColor="bg-orange-50"
                      handleFutureEarningsClick={handleFutureEarningsClick}
                    />

                    {/* Not supplied timing reports */}
                    <MarketTimingGroup
                      title="Not Specified"
                      icon={Calendar}
                      reports={dayReports.filter(
                        (r) => r.marketTiming === "NOT_SUPPLIED"
                      )}
                      bgColor="bg-gray-50"
                      handleFutureEarningsClick={handleFutureEarningsClick}
                    />
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
