import React from "react";
import Image from "next/image";
import {
  Calendar,
  Sun,
  Moon,
  LucideIcon,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCalendarStore } from "@/store/CalendarStore";
import { FilterState } from "@/app/(auth)/(platform)/earnings/types";
import { useGetWeekView } from "@/app/hooks/use-get-week-view";
import { useEarningsStore } from "@/store/EarningsStore";
import { useAuthModal } from "@/store/AuthModalStore";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

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

interface EarningsEntry {
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

interface WeekViewProps {
  filters: FilterState;
  handleCompanyClick: (transcript: EarningsEntry) => void;
}

// const MoreCard = ({
//   count,
//   onClick,
// }: {
//   count: number;
//   onClick: () => void;
// }) => (
//   <div
//     className="flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-700 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-sm dark:hover:shadow-slate-800/50 hover:border-gray-800 dark:hover:border-slate-600 cursor-pointer"
//     onClick={(e) => {
//       e.stopPropagation();
//       onClick();
//     }}
//   >
//     <div className="flex items-center justify-center w-full h-full font-semibold text-gray-800 dark:text-gray-200">
//       + {count}
//     </div>
//   </div>
// );

const WeekView: React.FC<WeekViewProps> = ({ filters, handleCompanyClick }) => {
  const { userId } = useAuth();
  const authModal = useAuthModal();
  const currentDate = useCalendarStore((state) => state.currentDate);
  const setCurrentDate = useCalendarStore((state) => state.setCurrentDate);

  const handlePreviousWeek = React.useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  }, [currentDate, setCurrentDate]);

  const handleNextWeek = React.useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  }, [currentDate, setCurrentDate]);

  const { weekDates } = React.useMemo(() => {
    // Create date and set to midnight in local timezone
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);

    // Calculate Monday's date
    const mondayDate = new Date(date);
    const day = date.getDay();
    mondayDate.setDate(date.getDate() - (day === 0 ? 6 : day - 1));

    // Generate array of dates for the week (Mon-Fri)
    const dates = Array.from({ length: 5 }, (_, i) => {
      const newDate = new Date(mondayDate);
      newDate.setDate(mondayDate.getDate() + i);
      return newDate;
    });

    // Set Friday to end of day
    const fridayDate = new Date(dates[4]);
    fridayDate.setHours(23, 59, 59, 999);

    return {
      weekDates: dates,
      monday: mondayDate,
      friday: fridayDate,
    };
  }, [currentDate]);

  // Fetch data for the week
  const { data, isLoading, error } = useGetWeekView();

  const filterEarnings = (earnings: EarningsEntry[]) => {
    return earnings.filter((entry) => {
      // Market Cap filtering
      if (filters.marketCap.length > 0) {
        const marketCapValue = entry.marketCap || 0;
        const matchesMarketCap = filters.marketCap.some((cap) => {
          if (cap === "Large Cap ($10B+)" && marketCapValue >= 10000000000)
            return true;
          if (
            cap === "Mid Cap ($2B-$10B)" &&
            marketCapValue >= 2000000000 &&
            marketCapValue < 10000000000
          )
            return true;
          if (
            cap === "Small Cap ($300M-$2B)" &&
            marketCapValue >= 300000000 &&
            marketCapValue < 2000000000
          )
            return true;
          return false;
        });
        if (!matchesMarketCap) return false;
      }

      // Sector filtering
      if (filters.sectors.length > 0) {
        if (!filters.sectors.includes(entry.company.finnhubIndustry || ""))
          return false;
      }

      // // Exchange filtering
      // if (filters.exchanges.length > 0) {
      //   if (!filters.exchanges.includes(entry.company.exchange || "")) return false;
      // }

      return true;
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-slate-800/50 overflow-hidden h-full">
        {/* Mobile Header Skeleton */}
        <div className="md:hidden flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 mt-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        {/* Desktop Header Skeleton */}
        <div className="hidden md:flex flex-row">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex-1 bg-gray-50 dark:bg-slate-800 border-r last:border-r-0 border-gray-200 dark:border-slate-700"
            >
              <div className="p-2 text-center border-b border-gray-200 dark:border-slate-700">
                <Skeleton className="h-5 w-20 mx-auto mb-1" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 md:flex md:flex-row overflow-y-auto">
          {[...Array(5)].map((_, dayIndex) => (
            <div
              key={dayIndex}
              className="md:flex-1 border-b md:border-b-0 md:border-r last:border-r-0 border-gray-200 dark:border-slate-700"
            >
              {/* Mobile Day Header Skeleton */}
              <div className="md:hidden p-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              {/* Day Content Skeleton */}
              <div className="p-2 bg-white dark:bg-slate-900">
                {/* Market Timing Group Skeletons */}
                {[...Array(3)].map((_, groupIndex) => (
                  <div key={groupIndex} className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Skeleton className="h-3 w-3" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-3 gap-0.5 md:gap-2">
                      {[...Array(6)].map((_, cardIndex) => (
                        <div key={cardIndex} className="flex flex-col">
                          <Skeleton className="aspect-square rounded-md" />
                          <Skeleton className="h-5 w-full mt-0.5 rounded-sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>No data available</div>;

  const { earnings } = data;
  const filteredEarnings = filterEarnings(earnings);

  // Pre-process data for each day
  const getDateContent = weekDates.map((date) => {
    const currentDay = date.toISOString().split("T")[0];

    const dayTranscripts = filteredEarnings.filter((transcript) => {
      const transcriptDate = new Date(transcript.earningsDate)
        .toISOString()
        .split("T")[0];
      return transcriptDate === currentDay;
    });

    return {
      dayTranscripts,
      isEmpty: dayTranscripts.length === 0,
    };
  });

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const headerDateFormat: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const NoEarnings = () => (
    <div className="w-full min-h-[200px] flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-sm">
      <div className="flex flex-row items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          No earnings
        </span>
      </div>
    </div>
  );

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
      className="flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md dark:hover:shadow-slate-800/50 hover:border-gray-800 dark:hover:border-slate-600 cursor-pointer"
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
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800">
            <span className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">
              {symbol}
            </span>
          </div>
        )}
      </div>
      <div className="w-full bg-gray-50 dark:bg-slate-800 py-1 px-1.5 border-t border-gray-200 dark:border-slate-700">
        <span className="text-[10px] md:text-xs font-medium text-gray-800 dark:text-gray-200 block text-center truncate">
          {symbol}
        </span>
      </div>
    </div>
  );

  const MarketTimingGroup = ({
    date,
    title,
    icon: Icon,
    transcripts,
    bgColor,
  }: {
    title: string;
    date: Date;
    icon: LucideIcon;
    transcripts: EarningsEntry[];
    bgColor: string;
  }) => {
    if (transcripts.length === 0) return null;

    // const displayedTranscripts = transcripts.slice(0, 7);
    const displayedTranscripts =transcripts
    // const remainingCount = transcripts.length - 7;

    const hasMore = window.innerWidth < 768 && transcripts.length > 12;

    return (
      <div className={`p-1 rounded-md mb-1 ${bgColor}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Icon className="w-3 h-3 text-gray-600" />
            <span className="text-[10px] font-medium text-gray-600">
              {title} ({transcripts.length})
            </span>
          </div>
          {hasMore && (
            <span className="text-[10px] text-gray-500 md:hidden">
              +{transcripts.length - 12} more
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 md:grid-cols-3 gap-0.5 md:gap-2">
          {displayedTranscripts.map((transcript, index) => (
            <CompanyCard
              key={`transcript-${index}`}
              symbol={transcript.company?.symbol || ""}
              name={transcript.company?.name || ""}
              logo={transcript.company?.logo || null}
              onClick={() => handleCompanyClick(transcript)}
            />
          ))}
          {/* {remainingCount > 0 && (
            <MoreCard
              count={remainingCount}
              onClick={() => {
                useEarningsStore.setState({
                  selectedDate: date,
                  selectedCompany: null,
                  selectedFutureEarnings: null,
                  showWatchlist: false,
                });
              }}
            />
          )} */}
        </div>
      </div>
    );
  };

  const handleDayClick = (date: Date) => {
    useEarningsStore.setState({
      selectedDate: date,
      selectedCompany: null,
      selectedFutureEarnings: null,
      showWatchlist: false, // Ensure watchlist is closed
    });
  };

  const handleWatchlistClick = () => {
    if (!userId) {
      authModal.onOpen();
      return;
    }

    useEarningsStore.setState({
      showWatchlist: true,
      selectedDate: null,
      selectedCompany: null,
      selectedFutureEarnings: null,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-lg shadow-sm dark:shadow-slate-800/50 overflow-hidden h-full">
      {/* Updated mobile header with navigation */}
      <div className="md:hidden flex flex-col bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 mt-2">
        <div className="flex items-center justify-between p-3">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Earnings Calendar
          </h1>
          <button
            onClick={handleWatchlistClick}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95"
          >
            <Star className="w-4 h-4" />
            <span>Watchlist</span>
          </button>
        </div>

        {/* Add week navigation controls */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={handlePreviousWeek}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {weekDates[0].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {" - "}
            {weekDates[4].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>

          <button
            onClick={handleNextWeek}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Header row - hide on mobile */}
      <div className="hidden md:flex flex-row">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className="flex-1 bg-gray-50 dark:bg-slate-800 border-r last:border-r-0 border-gray-200 dark:border-slate-700 cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-slate-700"
            onClick={() => handleDayClick(weekDates[index])}
          >
            <div className="p-2 text-center border-b border-gray-200 dark:border-slate-700 transition-all duration-300 ease-in-out hover:border-gray-300 dark:hover:border-slate-600 group">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 transform transition-all duration-300 ease-in-out group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-105">
                {day}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 transform transition-all duration-300 ease-in-out group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:scale-105">
                {weekDates[index].toLocaleDateString("en-US", headerDateFormat)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content area - responsive layout */}
      <div className="flex-1 md:flex md:flex-row overflow-y-auto">
        {weekDays.map((day, index) => {
          const { dayTranscripts, isEmpty } = getDateContent[index];

          // Get the date from the earnings date field
          const date = weekDates[index];

          // Group transcripts by market timing (only BMO and AMC)
          const preMarket = dayTranscripts.filter((t) => {
            const time = t.earningsTime.split(":")[0];
            return parseInt(time) < 9; // Before 9am is pre-market
          });
          const afterMarket = dayTranscripts.filter((t) => {
            const time = t.earningsTime.split(":")[0];
            return parseInt(time) >= 16; // 4pm or later is after-market
          });

          return (
            <div
              key={day}
              className="md:flex-1 border-b md:border-b-0 md:border-r last:border-r-0 border-gray-200 dark:border-slate-700"
              onClick={() => handleDayClick(weekDates[index])}
            >
              {/* Mobile day header */}
              <div className="md:hidden p-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {day}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {weekDates[index].toLocaleDateString(
                        "en-US",
                        headerDateFormat
                      )}
                    </p>
                  </div>
                  {!isEmpty && (
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {dayTranscripts.length} earnings
                    </div>
                  )}
                </div>
              </div>

              <div className="p-2 bg-white dark:bg-slate-900 overflow-y-auto">
                {isEmpty ? (
                  <NoEarnings />
                ) : (
                  <div className="flex flex-col space-y-2">
                    <MarketTimingGroup
                      date={date}
                      title="Pre-Market"
                      icon={Sun}
                      transcripts={preMarket}
                      bgColor="bg-blue-50 dark:bg-blue-950/30"
                    />
                    <MarketTimingGroup
                      date={date}
                      title="After Hours"
                      icon={Moon}
                      transcripts={afterMarket}
                      bgColor="bg-red-50/80 dark:bg-red-950/40"
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

export default WeekView;
