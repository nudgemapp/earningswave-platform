"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Sun,
  Moon,
  LucideIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
} from "lucide-react";
import { ProcessedTranscript } from "@/app/(auth)/(platform)/earnings/types";
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

type FilterType = "ALL" | "BMO" | "AMC" | "DMH" | "UNKNOWN";

interface DayViewProps {
  date: Date;
  onTranscriptClick: (transcript: ProcessedTranscript) => void;
}

const getNextValidDate = (currentDate: Date, direction: number): Date => {
  const newDate = new Date(currentDate);
  do {
    newDate.setDate(newDate.getDate() + direction);
  } while (newDate.getDay() === 0 || newDate.getDay() === 6); // Skip Saturday (6) and Sunday (0)
  return newDate;
};

const DayView: React.FC<DayViewProps> = ({ date, onTranscriptClick }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
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
      onClick={() => setActiveFilter(filter)}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${
          activeFilter === filter
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
        } border border-gray-200 dark:border-slate-700`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  const filteredData = React.useMemo(() => {
    if (!data || activeFilter === "ALL") return data;

    return {
      ...data,
      transcripts: data.transcripts.filter(
        (transcript) => transcript.MarketTime === activeFilter
      ),
    };
  }, [data, activeFilter]);

  const groupedTranscripts = React.useMemo(() => {
    if (!filteredData?.transcripts) return {};

    return filteredData.transcripts.reduce((acc, transcript) => {
      const timing = transcript.MarketTime || "UNKNOWN";
      if (!acc[timing]) acc[timing] = [];
      acc[timing].push(transcript);
      return acc;
    }, {} as Record<string, ProcessedTranscript[]>);
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
    transcript: ProcessedTranscript;
    onClick: () => void;
    isWatchlisted: boolean;
    onWatchlistToggle: (companyId: string) => Promise<void>;
  }) => (
    <div className="flex items-center p-3 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 cursor-pointer group">
      <div
        className="flex-1 flex items-center gap-4"
        onClick={() => {
          useEarningsStore.setState({ selectedTranscript: null });
          onClick();
        }}
      >
        <div className="relative h-12 w-12 mr-4">
          {transcript.company.logo ? (
            <Image
              src={transcript.company.logo || ""}
              alt={transcript.company.name || ""}
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-slate-800 rounded-md">
              <span className="text-sm font-medium">
                {transcript.company.symbol}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-200">
            {transcript.company.name}
          </h3>
          <div className="flex gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {transcript.company.symbol}
            </p>
            {transcript.epsEstimate !== null && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Est: ${transcript.epsEstimate.toFixed(2)}
              </p>
            )}
            {transcript.epsActual !== null && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Act: ${transcript.epsActual.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onWatchlistToggle(transcript.company.id);
        }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
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
  );

  const MarketTimingGroup = ({
    title,
    icon: Icon,
    transcripts,
    className,
  }: {
    title: string;
    icon: LucideIcon;
    transcripts: ProcessedTranscript[];
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
          <div className="flex items-center gap-2">
            <FilterButton filter="ALL" label="All" icon={Clock} />
            <FilterButton filter="BMO" label="Pre-Market" icon={Sun} />
            <FilterButton filter="AMC" label="After Hours" icon={Moon} />
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4">
          {!isLoading && !error && filteredData && (
            <>
              {filteredData.transcripts.length === 0 ? (
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
                  <MarketTimingGroup
                    title="During Market"
                    icon={Calendar}
                    transcripts={groupedTranscripts["DMH"] || []}
                    className="bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-xl"
                  />
                  <MarketTimingGroup
                    title="Not Specified"
                    icon={Calendar}
                    transcripts={groupedTranscripts["UNKNOWN"] || []}
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
