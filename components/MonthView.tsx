"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Calendar, Sun, Moon, LucideIcon } from "lucide-react";
import { ProcessedTranscript } from "@/app/(auth)/(platform)/earnings/types";
import { useGetMonthView } from "@/app/hooks/use-get-month-view";
import { Skeleton } from "@/components/ui/skeleton";
import { useEarningsStore } from "@/store/EarningsStore";

// First, let's define proper interfaces for our data structure
interface GroupedTranscript {
  date: string;
  items: ProcessedTranscript[];
}

interface MonthViewProps {
  currentDate: Date;
  handleCompanyClick: (transcriptInfo: ProcessedTranscript) => void;
}


const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  handleCompanyClick,
}) => {
  const { data, isLoading, error } = useGetMonthView();
 
  

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-slate-900 relative rounded-lg shadow-sm dark:shadow-slate-800/50">
        {/* Header */}
        <div className="sticky top-0 z-10 grid grid-cols-5 py-1 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-1 text-center">
              <Skeleton className="h-3.5 w-12 mx-auto rounded-md" />
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-5 gap-px bg-gray-200 dark:bg-slate-700">
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-2 min-h-[120px] space-y-2"
              >
                {/* Date */}
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-4 rounded-md" />
                  <Skeleton className="h-3 w-8 rounded-md" />
                </div>

                {/* Morning Events */}
                <div className="space-y-1">
                  <Skeleton className="h-2 w-16 rounded-md" />
                  <div className="grid grid-cols-4 gap-1">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="aspect-square rounded-sm" />
                    ))}
                  </div>
                </div>

                {/* Afternoon Events */}
                <div className="space-y-1">
                  <Skeleton className="h-2 w-12 rounded-md" />
                  <div className="grid grid-cols-4 gap-1">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="aspect-square rounded-sm" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>No data available</div>;

  const { transcripts: rawTranscripts } = data;

  const transcripts: GroupedTranscript[] = Object.entries(
    rawTranscripts.reduce((acc, transcript) => {
      const dateObj = new Date(transcript.scheduledAt);
      const date = dateObj.toISOString().split("T")[0];

      if (!acc[date]) {
        acc[date] = {
          date,
          items: [],
        };
      }
      acc[date].items.push(transcript);
      return acc;
    }, {} as Record<string, GroupedTranscript>)
  ).map(([, group]) => group);

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
      className="flex flex-col bg-white dark:bg-black border border-gray-200 dark:border-slate-700 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-sm dark:hover:shadow-slate-800/50 hover:border-gray-800 dark:hover:border-slate-600 cursor-pointer"
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
            objectFit="cover"
            className="p-0"
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
        <span className="text-[8px] font-medium text-gray-800 dark:text-white block text-center truncate px-0.5">
          {symbol}
        </span>
      </div>
    </div>
  );

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
      (entry) => entry.date === formattedDate
    );

    return {
      items: dateEntry?.items || [],
      totalCount: dateEntry?.items.length || 0,
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
    transcripts,
    bgColor,
  }: {
    title: string;
    icon: LucideIcon;
    transcripts: ProcessedTranscript[];
    bgColor: string;
  }) => {
    if (transcripts.length === 0) return null;

    return (
      <div
        className={`rounded-md overflow-hidden ${bgColor} dark:bg-opacity-20`}
      >
        <div className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-1.5 py-0.5 shadow-sm">
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 min-w-0">
              <Icon className="w-3 h-3 flex-shrink-0 text-gray-600 dark:text-gray-300" />
              <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-200 tracking-tight truncate">
                {title}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-[1px] bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center">
                <span className="text-[9px] font-medium bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                  {transcripts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-1">
          <div className="grid grid-cols-4 gap-0.5">
            {transcripts.map((transcript, index) => (
              <CompanyCard
                key={`${transcript.company?.symbol}-${index}`}
                symbol={transcript.company?.symbol || ""}
                name={transcript.company?.name || ""}
                logo={transcript.company?.logo || null}
                onClick={() => handleCompanyClick(transcript)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 relative rounded-lg shadow-sm dark:shadow-slate-800/50">
      <div className="sticky top-0 z-10 grid grid-cols-5 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 rounde">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2.5 text-center text-xs text-black dark:text-gray-400 font-medium tracking-wider uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-5 gap-px bg-gray-200 dark:bg-slate-700">
          {getDaysInMonth(currentDate).map((date, index) => {
            const { items: dayContent, totalCount: transcriptRemaining } =
              getLogosForDate(date, transcripts);
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
                  {transcriptRemaining > 0 && (
                    <span className="ml-1 text-gray-500 text-[9px]">
                      +{transcriptRemaining}
                    </span>
                  )}
                </span>
                <div className="flex-grow">
                  {dayContent.length === 0 ? (
                    <NoEarnings />
                  ) : (
                    <div className="flex flex-col h-full">
                      <MarketTimingGroup
                        title="Pre-Market"
                        icon={Sun}
                        transcripts={dayContent.filter(
                          (t) => t.MarketTime === "BMO"
                        )}
                        bgColor="bg-blue-200/40"
                      />
                      <MarketTimingGroup
                        title="After Hours"
                        icon={Moon}
                        transcripts={dayContent.filter(
                          (t) => t.MarketTime === "AMC"
                        )}
                        bgColor="bg-orange-50"
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
