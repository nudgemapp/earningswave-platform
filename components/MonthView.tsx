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

const CompanyCard = ({
  symbol,
  name,
  logo,
  onClick,
}: {
  symbol: string;
  name: string;
  logo: string | null;
  onClick: () => void;
}) => (
  <div
    className="flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-sm dark:hover:shadow-slate-800/50 hover:border-gray-800 dark:hover:border-slate-600 cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    title={`${name} (${symbol})`}
  >
    <div className="aspect-square relative">
      {logo ? (
        <Image
          src={logo}
          alt={`${name} logo`}
          layout="fill"
          objectFit="contain"
          className="p-0.5"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800">
          <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
            {symbol}
          </span>
        </div>
      )}
    </div>
    <div className="w-full bg-gray-50 dark:bg-slate-800 py-0.5 border-t border-gray-200 dark:border-slate-700">
      <span className="text-[8px] font-medium text-gray-800 dark:text-gray-200 block text-center truncate px-0.5">
        {symbol}
      </span>
    </div>
  </div>
);

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  handleCompanyClick,
  handleFutureEarningsClick,
}) => {
  const { data, isLoading, error } = useGetMonthView();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>No data available</div>;

  console.log("Raw data:", data);

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
  ).map(([, group]) => group);

  const reports: GroupedReport[] = Object.entries(
    rawReports.reduce((acc, report) => {
      console.log("Processing report:", {
        symbol: report.symbol,
        date: report.reportDate,
        isoString: report.reportDate.toISOString(),
      });

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
  ).map(([, group]) => group);

  console.log("Processed reports:", reports);

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

    console.log("Checking reports for date:", {
      formattedDate,
      availableDates: reportData.map((r) => r.date),
      matchingEntry: reportData.find(
        (entry) =>
          new Date(entry.date).toISOString().split("T")[0] === formattedDate
      ),
    });

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
    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-sm">
      <div className="flex flex-row items-center gap-1">
        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
          No earnings
        </span>
      </div>
    </div>
  );

  const MarketTimingGroup = ({
    title,
    icon: Icon,
    reports,
    bgColor,
  }: {
    title: string;
    icon: LucideIcon;
    reports: ProcessedReport[];
    bgColor: string;
  }) => {
    if (reports.length === 0) return null;

    return (
      <div className={`p-0.5 rounded-sm mb-0.5 ${bgColor} dark:bg-opacity-20`}>
        <div className="flex items-center gap-1 mb-0.5 px-0.5">
          <Icon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400">
            {title}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-0.5">
          {reports.map((report, reportIndex) => (
            <CompanyCard
              key={`report-${reportIndex}`}
              symbol={report.symbol}
              name={report.name}
              logo={
                report.company?.logo
                  ? bufferToImageUrl(report.company.logo)
                  : null
              }
              onClick={() => handleFutureEarningsClick(report)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 relative rounded-lg shadow-sm dark:shadow-slate-800/50">
      <div className="sticky top-0 z-10 grid grid-cols-5 py-1 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs text-gray-600 dark:text-gray-400 font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-5 gap-px bg-gray-200 dark:bg-slate-700">
          {getDaysInMonth(currentDate).map((date, index) => {
            const { items: dayContent, remainingCount: transcriptRemaining } =
              getLogosForDate(date, transcripts);
            const { items: dayReports, remainingCount: reportRemaining } =
              getReportsForDate(date, reports);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();

            return (
              <div
                key={index}
                className={`bg-white dark:bg-slate-900 p-0.5 text-center flex flex-col min-h-[120px] cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-slate-800 ${
                  !isCurrentMonth
                    ? "text-gray-400 bg-gray-50 dark:bg-slate-800/50"
                    : "text-gray-800 dark:text-gray-200"
                } ${
                  date.toDateString() === new Date().toDateString()
                    ? "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  useEarningsStore.setState({
                    selectedDate: new Date(date),
                    selectedCompany: null,
                    selectedFutureEarnings: null,
                    showWatchlist: false,
                  });
                }}
              >
                <span className="text-xs mb-0.5 font-medium">
                  {date.getDate()}
                  {(transcriptRemaining > 0 || reportRemaining > 0) && (
                    <span className="ml-1 text-gray-500 text-[9px]">
                      +{transcriptRemaining + reportRemaining}
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
                        <div className="grid grid-cols-4 gap-0.5 mb-0.5">
                          {dayContent.map((transcript, logoIndex) => (
                            <CompanyCard
                              key={`transcript-${logoIndex}`}
                              symbol={transcript.company?.symbol || ""}
                              name={transcript.company?.name || ""}
                              logo={
                                transcript.company?.logo
                                  ? bufferToImageUrl(transcript.company.logo)
                                  : null
                              }
                              onClick={() => handleCompanyClick(transcript)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Market timing groups */}
                      <MarketTimingGroup
                        title="Pre-Market"
                        icon={Sun}
                        reports={dayReports.filter(
                          (r) => r.marketTiming === "PRE_MARKET"
                        )}
                        bgColor="bg-blue-50"
                      />
                      <MarketTimingGroup
                        title="After Hours"
                        icon={Moon}
                        reports={dayReports.filter(
                          (r) => r.marketTiming === "AFTER_HOURS"
                        )}
                        bgColor="bg-orange-50"
                      />
                      <MarketTimingGroup
                        title="Not Specified"
                        icon={Calendar}
                        reports={dayReports.filter(
                          (r) =>
                            r.marketTiming === "NOT_SUPPLIED" ||
                            r.marketTiming === null
                        )}
                        bgColor="bg-gray-50"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default MonthView;
