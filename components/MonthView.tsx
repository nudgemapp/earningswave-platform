"use client";

import React from "react";
import Image from "next/image";

import { Calendar, Sun, Moon, LucideIcon } from "lucide-react";
import {
  ProcessedReport as BaseProcessedReport,
  ProcessedTranscript as BaseProcessedTranscript,
} from "@/app/(auth)/(platform)/earnings/types";
import { useGetMonthView } from "@/app/hooks/use-get-month-view";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useEarningsStore } from "@/store/EarningsStore";

// Extend the base interfaces to include the count properties
interface ProcessedReport extends BaseProcessedReport {
  totalCount: number;
  remainingCount: number;
}

interface ProcessedTranscript extends BaseProcessedTranscript {
  totalCount: number;
  remainingCount: number;
}

// First, let's define proper interfaces for our data structure
interface GroupedTranscript {
  date: string;
  totalCount: number;
  remainingCount: number;
  items: ProcessedTranscript[];
}

interface GroupedReport {
  date: string;
  totalCount: number;
  remainingCount: number;
  items: ProcessedReport[];
}

interface MonthViewProps {
  currentDate: Date;
  handleCompanyClick: (transcriptInfo: ProcessedTranscript) => void;
  handleFutureEarningsClick: (report: ProcessedReport) => void;
}

const bufferToImageUrl = (
  logoData: { data: { type: "Buffer"; data: number[] } } | string
) => {
  if (typeof logoData === "string") return logoData;
  if (!logoData?.data?.data) return "";

  const uint8Array = new Uint8Array(logoData.data.data);
  let binary = "";
  uint8Array.forEach((byte) => (binary += String.fromCharCode(byte)));
  return `data:image/png;base64,${btoa(binary)}`;
};

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  handleCompanyClick,
  handleFutureEarningsClick,
}) => {
  const { data, isLoading, error } = useGetMonthView();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>No data available</div>;

  const { transcripts: rawTranscripts, reports: rawReports } = data as {
    transcripts: ProcessedTranscript[];
    reports: ProcessedReport[];
  };

  const transcripts: GroupedTranscript[] = Object.entries(
    rawTranscripts.reduce((acc, transcript) => {
      const date = transcript.date.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          totalCount: transcript.totalCount || 0,
          remainingCount: transcript.remainingCount || 0,
          items: [],
        };
      }
      acc[date].items.push(transcript);
      return acc;
    }, {} as Record<string, GroupedTranscript>)
  ).map(([_, group]) => group);

  const reports: GroupedReport[] = Object.entries(
    rawReports.reduce((acc, report) => {
      const date = report.reportDate.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          totalCount: report.totalCount || 0,
          remainingCount: report.remainingCount || 0,
          items: [],
        };
      }
      acc[date].items.push(report);
      return acc;
    }, {} as Record<string, GroupedReport>)
  ).map(([_, group]) => group);

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days: Date[] = [];

    // Adjust first day to start from Monday (1) instead of Sunday (0)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Add padding days from previous month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(new Date(year, month, -adjustedFirstDay + i + 1));
    }

    // Add days of current month, excluding weekends
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(year, month, i);
      const dayOfWeek = currentDay.getDay();
      // Only add if it's not Saturday (6) or Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days.push(currentDay);
      }
    }

    return days;
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const getLogosForDate = (date: Date, transcriptData: GroupedTranscript[]) => {
    const formattedDate = date.toISOString().split("T")[0];
    const dateEntry = transcriptData.find(
      (entry) =>
        new Date(entry.date).toISOString().split("T")[0] === formattedDate
    );

    return {
      items: dateEntry?.items || [],
      totalCount: dateEntry?.totalCount || 0,
      remainingCount: dateEntry?.remainingCount || 0,
    };
  };

  const getReportsForDate = (date: Date, reportData: GroupedReport[]) => {
    const formattedDate = date.toISOString().split("T")[0];
    const dateEntry = reportData.find(
      (entry) =>
        new Date(entry.date).toISOString().split("T")[0] === formattedDate
    );

    return {
      items: dateEntry?.items || [],
      totalCount: dateEntry?.totalCount || 0,
      remainingCount: dateEntry?.remainingCount || 0,
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
              onClick={() => handleFutureEarningsClick(report)}
              title={`${report.name} (${
                report.symbol
              }) - ${report.marketTiming?.replace("_", " ")}`}
            >
              <div className="flex-1 relative">
                {report.company?.logo ? (
                  <Image
                    src={bufferToImageUrl(report.company.logo)}
                    alt={`${report.name} logo`}
                    fill
                    style={{ objectFit: "contain" }}
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
      <div className="grid grid-cols-5 py-2 bg-gray-100">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-gray-100 py-1 text-center text-xs text-gray-600 font-bold"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-px bg-gray-200 flex-grow">
        {getDaysInMonth(currentDate).map((date, index) => {
          const {
            items: dayContent,
            totalCount: transcriptCount,
            remainingCount: transcriptRemaining,
          } = getLogosForDate(date, transcripts);
          const {
            items: dayReports,
            totalCount: reportCount,
            remainingCount: reportRemaining,
          } = getReportsForDate(date, reports);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          return (
            <div
              key={index}
              className={`bg-white p-1 text-center flex flex-col min-h-[100px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 ${
                !isCurrentMonth ? "text-gray-400 bg-gray-50" : "text-gray-800"
              } ${
                date.toDateString() === new Date().toDateString()
                  ? "bg-blue-50 hover:bg-blue-100"
                  : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                const newDate = new Date(date);
                useEarningsStore.setState({
                  selectedDate: newDate,
                  selectedCompany: null,
                  selectedFutureEarnings: null,
                });
              }}
            >
              <span className="text-xs mb-1 font-medium transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:text-gray-900">
                {date.getDate()}
                {(transcriptRemaining > 0 || reportRemaining > 0) && (
                  <span className="ml-1 text-gray-500 text-[10px]">
                    +{transcriptRemaining + reportRemaining} more
                  </span>
                )}
              </span>
              <div className="flex-grow">
                {dayContent.length === 0 && dayReports.length === 0 ? (
                  <NoEarnings />
                ) : (
                  <div className="flex flex-col h-full">
                    {/* Regular transcripts */}
                    {dayContent.length > 0 && (
                      <div
                        className="grid grid-cols-3 gap-1 mb-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {dayContent.map((transcript, logoIndex) => {
                          console.log(
                            "Logo data for",
                            transcript.company?.symbol,
                            ":",
                            transcript.company?.logo
                          );
                          return (
                            <div
                              key={`transcript-${logoIndex}`}
                              className="aspect-square w-full relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:z-10 cursor-pointer flex flex-col"
                              onClick={() => handleCompanyClick(transcript)}
                            >
                              <div className="flex-1 relative">
                                {transcript.company?.logo ? (
                                  <Image
                                    src={bufferToImageUrl(
                                      transcript.company.logo
                                    )}
                                    alt={`${transcript.company.name} logo`}
                                    fill
                                    style={{ objectFit: "contain" }}
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
                          );
                        })}
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
