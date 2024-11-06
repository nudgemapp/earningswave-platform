"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Sun,
  Moon,
  LucideIcon,
  File,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  ProcessedReport,
  ProcessedTranscript,
} from "@/app/(auth)/(platform)/earnings/types";
import { useGetDayView } from "@/app/hooks/use-get-day-view";
import Spinner from "@/components/ui/Spinner";
import { useEarningsStore } from "@/store/EarningsStore";

type FilterType = "ALL" | "PRE_MARKET" | "AFTER_HOURS";

interface DayViewProps {
  date: Date;
  onTranscriptClick: (transcript: ProcessedTranscript) => void;
  onReportClick: (report: ProcessedReport) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  onTranscriptClick,
  onReportClick,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const { data, isLoading, error } = useGetDayView(date);

  const changeDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    useEarningsStore.setState({ selectedDate: newDate });
  };

  const FilterButton = ({
    filter,
    label,
    icon: Icon,
  }: {
    filter: FilterType;
    label: string;
    icon: LucideIcon;
  }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        activeFilter === filter
          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-medium"
          : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  const filteredData = React.useMemo(() => {
    if (!data || activeFilter === "ALL") return data;

    return {
      ...data,
      reports: data.reports.filter((report) => {
        if (activeFilter === "PRE_MARKET")
          return report.marketTiming === "PRE_MARKET";
        if (activeFilter === "AFTER_HOURS")
          return report.marketTiming === "AFTER_HOURS";
        return true;
      }),
      transcripts: data.transcripts,
    };
  }, [data, activeFilter]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const CompanyCard = ({
    company,
    onClick,
    estimate,
    lastYearEPS,
  }: {
    company: { name: string; symbol: string; logo?: string | null };
    onClick: () => void;
    estimate?: number | null;
    lastYearEPS?: number | null;
  }) => (
    <div
      onClick={onClick}
      className="flex items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 cursor-pointer"
    >
      <div className="relative h-12 w-12 mr-4">
        {company.logo ? (
          <Image
            src={company.logo}
            alt={company.name}
            layout="fill"
            objectFit="contain"
            className="rounded-md"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md">
            <span className="text-sm font-medium">{company.symbol}</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-gray-200">
          {company.name}
        </h3>
        <div className="flex gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {company.symbol}
          </p>
          {estimate !== undefined && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Est: ${estimate?.toFixed(2) || "N/A"}
            </p>
          )}
          {lastYearEPS !== undefined && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prior: ${lastYearEPS?.toFixed(2) || "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const MarketTimingGroup = ({
    title,
    icon: Icon,
    reports,
    className,
  }: {
    title: string;
    icon: LucideIcon;
    reports: ProcessedReport[];
    className: string;
  }) => {
    if (reports.length === 0) return null;

    return (
      <div className={`space-y-3 mt-4 ${className} dark:bg-opacity-20`}>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </h4>
        <div className="grid gap-3">
          {reports.map((report) => (
            <CompanyCard
              key={report.id}
              company={report.company}
              onClick={() => onReportClick(report)}
              estimate={report.estimate}
              lastYearEPS={report.lastYearEPS}
            />
          ))}
        </div>
      </div>
    );
  };

  // Group reports by marketTiming
  const groupedReports =
    filteredData?.reports.reduce((acc, report) => {
      const timing = report.marketTiming || "NOT_SUPPLIED";
      if (!acc[timing]) acc[timing] = [];
      acc[timing].push(report);
      return acc;
    }, {} as Record<string, ProcessedReport[]>) || {};

  const handleBack = () => {
    useEarningsStore.setState({ selectedDate: null });
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <button
            onClick={handleBack}
            className="absolute right-0 top-0 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors md:hidden"
            aria-label="Close day view"
          >
            <X className="w-4 h-4 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex items-center justify-between md:justify-center">
          <button
            onClick={() => changeDate(-1)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-5 h-5 dark:text-gray-400" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
            {formatDate(date)}
          </h2>
          <button
            onClick={() => changeDate(1)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Next day"
          >
            <ChevronRight className="w-5 h-5 dark:text-gray-400" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-slate-800 rounded-lg w-fit mx-auto">
          <FilterButton filter="ALL" label="All" icon={Clock} />
          <FilterButton filter="PRE_MARKET" label="Pre-Market" icon={Sun} />
          <FilterButton filter="AFTER_HOURS" label="After Hours" icon={Moon} />
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center min-h-[600px] mt-16 gap-3">
          <Spinner size="lg" />
          <span className="text-gray-500">Loading earnings data...</span>
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center min-h-[200px] text-gray-600">
          Error loading data
        </div>
      )}

      {!isLoading && !error && filteredData && (
        <>
          {filteredData.reports.length === 0 &&
          filteredData.transcripts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[600px] mt-16 text-gray-500 dark:text-gray-400">
              <Calendar className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-lg font-medium">
                No earnings data for this date
              </p>
              <p className="text-sm">Check back later or try another date</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Reports */}
              {filteredData.reports.length > 0 && (
                <div className="space-y-3">
                  <MarketTimingGroup
                    title="Pre-Market"
                    icon={Sun}
                    reports={groupedReports["PRE_MARKET"] || []}
                    className="bg-blue-50 p-4 rounded-md"
                  />

                  <MarketTimingGroup
                    title="After Hours"
                    icon={Moon}
                    reports={groupedReports["AFTER_HOURS"] || []}
                    className="bg-orange-50 p-4 rounded-md"
                  />

                  <MarketTimingGroup
                    title="Not Specified"
                    icon={Calendar}
                    reports={groupedReports["NOT_SUPPLIED"] || []}
                    className="bg-gray-50 p-4 rounded-md"
                  />
                </div>
              )}

              {/* Transcripts - Moved outside the reports conditional */}
              {filteredData.transcripts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <File className="w-5 h-5" />
                    Earnings Transcripts
                  </h3>
                  <div className="grid gap-3">
                    {filteredData.transcripts.map((transcript) => (
                      <CompanyCard
                        key={transcript.id}
                        company={{
                          name: transcript.company?.name || "",
                          symbol: transcript.company?.symbol || "",
                          logo: transcript.company?.logo || null,
                        }}
                        onClick={() => onTranscriptClick(transcript)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const DayViewWithSwipe: React.FC<DayViewProps> = (props) => {
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Navigate to next day
      const newDate = new Date(props.date);
      newDate.setDate(props.date.getDate() + 1);
      useEarningsStore.setState({ selectedDate: newDate });
    }
    if (isRightSwipe) {
      // Navigate to previous day
      const newDate = new Date(props.date);
      newDate.setDate(props.date.getDate() - 1);
      useEarningsStore.setState({ selectedDate: newDate });
    }
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <DayView {...props} />
    </div>
  );
};

export default DayViewWithSwipe;
