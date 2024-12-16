"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Sun,
  Moon,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
} from "lucide-react";
import { useGetDayView } from "@/app/hooks/use-get-day-view";
import { useEarningsStore } from "@/store/EarningsStore";
import { useWatchlistMutations } from "@/app/hooks/use-watchlist-mutations";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useAuthModal } from "@/store/AuthModalStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";

type FilterType = "BMO" | "AMC" | "UNKNOWN";
interface Company {
  id: string;
  symbol: string;
  name: string | null;
  logo: string | null;
  description: string;
  currency: string;
  marketCapitalization: number | null;
  weburl: string | null;
  finnhubIndustry: string | null;
  exchange: string | null;
}

export interface EarningsEntry {
  id: string;
  symbol: string;
  quarter: number;
  year: number;
  earningsDate: string;
  earningsTime: string;
  isDateConfirmed: boolean;
  marketCap: number | null;
  totalForDay: number;
  remainingCount: number;
  company: Company;
}

interface DayViewProps {
  date: Date;
  onTranscriptClick: (transcript: EarningsEntry) => void;
}

const getNextValidDate = (currentDate: Date, direction: number): Date => {
  const newDate = new Date(currentDate);
  do {
    newDate.setDate(newDate.getDate() + direction);
  } while (newDate.getDay() === 0 || newDate.getDay() === 6); // Skip Saturday (6) and Sunday (0)
  return newDate;
};

const DayView: React.FC<DayViewProps> = ({ date, onTranscriptClick }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("UNKNOWN");
  const { data, isLoading, error } = useGetDayView(date);
  const { addToWatchlist, removeFromWatchlist } = useWatchlistMutations();
  const [watchlistedCompanies, setWatchlistedCompanies] = useState<Set<string>>(
    new Set()
  );
  const { userId } = useAuth();
  const authModal = useAuthModal();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDateChange =
    (direction: number) => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const newDate = getNextValidDate(date, direction);
      useEarningsStore.setState({ selectedDate: newDate });
    };

  const handleBackClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    useEarningsStore.setState({ selectedDate: null });
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
      onClick={() =>
        setActiveFilter(activeFilter === filter ? "UNKNOWN" : filter)
      }
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${
          activeFilter === filter
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
        }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  const filteredData = React.useMemo(() => {
    if (!data?.earnings || activeFilter === "UNKNOWN") return data?.earnings;

    return data.earnings.filter((earning) => {
      // Convert earnings time to hours for comparison
      const timeStr = earning.earningsTime;
      const hours = parseInt(timeStr.split(":")[0]);

      // Before market hours (BMO) is before 9:30 AM
      // After market hours (AMC) is after 4:00 PM
      const marketTime = hours < 9.5 ? "BMO" : hours >= 16 ? "AMC" : "DMH";

      return marketTime === activeFilter;
    });
  }, [data, activeFilter]);

  const groupedTranscripts = React.useMemo(() => {
    if (!filteredData) return {};

    return filteredData.reduce((acc, earning) => {
      // Convert earnings time to hours for comparison
      const timeStr = earning.earningsTime;
      const hours = parseInt(timeStr.split(":")[0]);

      // Before market hours (BMO) is before 9:30 AM
      // After market hours (AMC) is after 4:00 PM
      const timing = hours < 9.5 ? "BMO" : hours >= 16 ? "AMC" : "DMH";

      if (!acc[timing]) acc[timing] = [];
      // Only add if symbol doesn't already exist in this timing group
      if (!acc[timing].some((e) => e.symbol === earning.symbol)) {
        acc[timing].push(earning);
      }
      return acc;
    }, {} as Record<string, EarningsEntry[]>);
  }, [filteredData]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleWatchlistToggle = async (companyId: string) => {
    if (!userId) {
      authModal.onOpen();
      return;
    }

    try {
      if (watchlistedCompanies.has(companyId)) {
        await removeFromWatchlist.mutateAsync(companyId);
        setWatchlistedCompanies((prev) => {
          const next = new Set(prev);
          next.delete(companyId);
          return next;
        });
        toast.success("Removed from watchlist", {
          className:
            "bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700",
          descriptionClassName: "text-gray-700 dark:text-gray-300",
          style: {
            "--toast-success": "var(--green-500)",
          } as React.CSSProperties,
        });
      } else {
        await addToWatchlist.mutateAsync(companyId);
        setWatchlistedCompanies((prev) => new Set(prev).add(companyId));
        toast.success("Added to watchlist", {
          className:
            "bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700",
          descriptionClassName: "text-gray-700 dark:text-gray-300",
          style: {
            "--toast-success": "var(--green-500)",
          } as React.CSSProperties,
        });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update watchlist",
        {
          className:
            "bg-white dark:bg-slate-900 text-gray-900 dark:text-white border-gray-200 dark:border-slate-700",
          descriptionClassName: "text-gray-700 dark:text-gray-300",
        }
      );
    }
  };

  const CompanyCard = ({
    transcript,
    onClick,
    isWatchlisted,
    onWatchlistToggle,
  }: {
    transcript: EarningsEntry;
    onClick: () => void;
    isWatchlisted: boolean;
    onWatchlistToggle: (companyId: string) => Promise<void>;
  }) => (
    <div className="group relative flex items-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-all">
      {/* Left Section - Logo & Basic Info */}
      <div
        className="flex-1 flex items-center gap-4 cursor-pointer"
        onClick={() => {
          useEarningsStore.setState({ selectedTranscript: null });
          onClick();
        }}
      >
        {/* Logo */}
        <div className="relative h-10 w-10 flex-shrink-0">
          {transcript.company.logo ? (
            <Image
              src={transcript.company.logo}
              alt={transcript.company.symbol}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-md">
              <span className="text-xs font-medium">
                {transcript.company.symbol}
              </span>
            </div>
          )}
        </div>

        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-200 truncate">
              {transcript.company.symbol}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {transcript.company.finnhubIndustry}
            </span>
          </div>

          {/* Earnings Info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {/* Quarter Info */}
            {transcript.quarter && (
              <span className="text-gray-600 dark:text-gray-300">
                Q{transcript.quarter} {transcript.year}
              </span>
            )}

            {/* Market Cap */}
            {transcript.company.marketCapitalization && (
              <span className="text-gray-500 dark:text-gray-400">
                Mkt Cap: $
                {(transcript.company.marketCapitalization / 1000).toFixed(1)}B
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Watchlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWatchlistToggle(transcript.company.id);
          }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all"
          aria-label={
            isWatchlisted ? "Remove from watchlist" : "Add to watchlist"
          }
        >
          <Star
            className={`w-4 h-4 ${
              isWatchlisted
                ? "fill-blue-500 text-blue-500"
                : "text-gray-400 dark:text-gray-500"
            }`}
            fill={isWatchlisted ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>
      </div>
    </div>
  );

  const MarketTimingGroup = ({
    title,
    icon: Icon,
    transcripts,
    className,
  }: {
    title: string;
    icon: LucideIcon;
    transcripts: EarningsEntry[];
    className: string;
  }) => {
    if (!transcripts?.length) return null;

    return (
      <div className={`space-y-3 mt-4 ${className} dark:bg-opacity-20`}>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </h4>
        <div className="grid gap-3">
          {transcripts.map((transcript) => (
            <CompanyCard
              key={transcript.id}
              transcript={transcript}
              onClick={() => onTranscriptClick(transcript)}
              isWatchlisted={watchlistedCompanies.has(transcript.company.id)}
              onWatchlistToggle={handleWatchlistToggle}
            />
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 bg-white dark:bg-slate-900">
        {/* Header Skeleton */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between md:justify-center">
            <Skeleton className="w-8 h-8 rounded-full md:hidden" />
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-8 h-8 rounded-full md:hidden" />
          </div>

          {/* Filter Bar Skeleton */}
          <div className="flex items-center gap-2 p-1 bg-gray-50 dark:bg-slate-800 rounded-lg w-fit mx-auto">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="w-24 h-9 rounded-lg bg-gray-100 dark:bg-slate-700"
              />
            ))}
          </div>
        </div>

        {/* Market Timing Groups Skeleton */}
        {["BMO", "AMC", "DMH"].map((timing) => (
          <div
            key={timing}
            className="space-y-3 mt-4 p-4 rounded-md bg-gray-50 dark:bg-slate-800/50"
          >
            {/* Group Header */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="w-24 h-4" />
            </div>

            {/* Company Cards */}
            <div className="grid gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700"
                >
                  {/* Company Logo Skeleton */}
                  <div className="flex-1 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md shrink-0" />

                    {/* Company Info Skeleton */}
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>

                  {/* Action Button Skeleton */}
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
        <div className="text-center space-y-2">
          <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
          <h3 className="font-medium text-lg">Error loading earnings data</h3>
          <p className="text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full bg-white dark:bg-slate-900 border-gray-200/50 dark:border-slate-800/50 shadow-sm">
        <CardHeader className="space-y-4 pb-4 px-4">
          {!isDesktop && (
            <div className="flex justify-end w-full">
              <button
                onClick={handleBackClick}
                onTouchEnd={handleBackClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-fit touch-manipulation"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}

          {/* Date Navigation with touch handling */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={handleDateChange(-1)}
              onTouchEnd={handleDateChange(-1)}
              className="absolute left-0 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors touch-manipulation"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Center Date */}
            <div className="text-center">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {formatDate(date)}
              </CardTitle>
            </div>

            <button
              onClick={handleDateChange(1)}
              onTouchEnd={handleDateChange(1)}
              className="absolute right-0 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors touch-manipulation"
              aria-label="Next day"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Filter Bar - Simplified and consistent with FutureEarnings style */}
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="inline-flex items-center gap-2 p-1 bg-gray-50 dark:bg-slate-800 rounded-lg">
              <FilterButton filter="BMO" label="Pre-Market" icon={Sun} />
              <FilterButton filter="AMC" label="After Hours" icon={Moon} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          {!isLoading && !error && filteredData && (
            <>
              {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500 dark:text-gray-400">
                  <Calendar className="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500" />
                  <p className="text-lg font-medium">
                    No earnings data for this date
                  </p>
                  <p className="text-sm">
                    Check back later or try another date
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <MarketTimingGroup
                    title="Pre-Market"
                    icon={Sun}
                    transcripts={groupedTranscripts["BMO"] || []}
                    className="bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-xl"
                  />
                  <MarketTimingGroup
                    title="After Hours"
                    icon={Moon}
                    transcripts={groupedTranscripts["AMC"] || []}
                    className="bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-xl"
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
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
