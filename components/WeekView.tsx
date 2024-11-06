import React from "react";
import Image from "next/image";
import { Calendar, Sun, Moon, LucideIcon, Star } from "lucide-react";
import { useCalendarStore } from "@/store/CalendarStore";
import {
  ProcessedTranscript,
  ProcessedReport,
} from "@/app/(auth)/(platform)/earnings/types";
import { useGetWeekView } from "@/app/hooks/use-get-week-view";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useEarningsStore } from "@/store/EarningsStore";
import { useAuthModal } from "@/store/AuthModalStore";
import { useAuth } from "@clerk/nextjs";

interface WeekViewProps {
  handleCompanyClick: (transcriptInfo: ProcessedTranscript) => void;
  handleFutureEarningsClick: (report: ProcessedReport) => void;
}

interface WeekViewData {
  transcripts: ProcessedTranscript[];
  reports: ProcessedReport[];
}

const WeekView: React.FC<WeekViewProps> = ({
  handleCompanyClick,
  handleFutureEarningsClick,
}) => {
  const { userId } = useAuth();
  const authModal = useAuthModal();
  const currentDate = useCalendarStore((state) => state.currentDate);

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

    console.log(
      "Week dates:",
      dates.map((d) => ({
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        date: d.toISOString(),
        localDate: d.toLocaleDateString(),
      }))
    );

    return {
      weekDates: dates,
      monday: mondayDate,
      friday: fridayDate,
    };
  }, [currentDate]);

  // Fetch data for the week
  const { data, isLoading, error } = useGetWeekView();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>No data available</div>;

  const { transcripts, reports } = data as WeekViewData;

  // Pre-process data for each day
  const getDateContent = weekDates.map((date) => {
    // Format date to YYYY-MM-DD for comparison
    const currentDay = date.toISOString().split("T")[0];

    const dayTranscripts = transcripts.filter((transcript) => {
      const transcriptDate = new Date(transcript.date)
        .toISOString()
        .split("T")[0];
      return transcriptDate === currentDay;
    });

    const dayReports = reports.filter((report) => {
      const reportDate = new Date(report.reportDate)
        .toISOString()
        .split("T")[0];
      return reportDate === currentDay;
    });

    return {
      dayTranscripts,
      dayReports,
      isEmpty: dayTranscripts.length === 0 && dayReports.length === 0,
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

  console.log(reports);

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
    title,
    icon: Icon,
    reports,
    bgColor,
    handleClick,
  }: {
    title: string;
    icon: LucideIcon;
    reports: (ProcessedReport | ProcessedTranscript)[];
    bgColor: string;
    handleClick: (report: ProcessedReport | ProcessedTranscript) => void;
  }) => {
    if (reports.length === 0) return null;

    // Limit to 12 companies on mobile (3 rows × 4 columns)
    const displayedReports = reports.slice(
      0,
      window.innerWidth < 768 ? 12 : reports.length
    );
    const hasMore = window.innerWidth < 768 && reports.length > 12;

    return (
      <div className={`p-1 rounded-md mb-1 ${bgColor}`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Icon className="w-3 h-3 text-gray-600" />
            <span className="text-[10px] font-medium text-gray-600">
              {title}
            </span>
          </div>
          {hasMore && (
            <span className="text-[10px] text-gray-500 md:hidden">
              +{reports.length - 12} more
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 md:grid-cols-3 gap-0.5 md:gap-2">
          {displayedReports.map((report, index) => (
            <CompanyCard
              key={`report-${index}`}
              symbol={
                "symbol" in report
                  ? report.symbol
                  : report.company?.symbol || ""
              }
              name={"name" in report ? report.name : report.company?.name || ""}
              logo={"company" in report ? report?.company?.logo || null : null}
              onClick={() => handleClick(report)}
            />
          ))}
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
      {/* Add mobile header with watchlist button */}
      <div className="md:hidden flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 mt-2">
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
          const { dayTranscripts, dayReports, isEmpty } = getDateContent[index];

          return (
            <div
              key={day}
              className="md:flex-1 border-b md:border-b-0 md:border-r last:border-r-0 border-gray-200 dark:border-slate-700 cursor-pointer"
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
                      {dayTranscripts.length + dayReports.length} earnings
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
                      title="Past Earnings"
                      icon={Calendar}
                      reports={dayTranscripts}
                      bgColor="bg-gray-50 dark:bg-slate-800/50"
                      handleClick={(report) =>
                        handleCompanyClick(report as ProcessedTranscript)
                      }
                    />
                    <MarketTimingGroup
                      title="Pre-Market"
                      icon={Sun}
                      reports={dayReports.filter(
                        (r) => r.marketTiming === "PRE_MARKET"
                      )}
                      bgColor="bg-blue-50 dark:bg-blue-950/30"
                      handleClick={(report) =>
                        handleFutureEarningsClick(report as ProcessedReport)
                      }
                    />
                    <MarketTimingGroup
                      title="After Hours"
                      icon={Moon}
                      reports={dayReports.filter(
                        (r) => r.marketTiming === "AFTER_HOURS"
                      )}
                      bgColor="bg-orange-50 dark:bg-orange-950/30"
                      handleClick={(report) =>
                        handleFutureEarningsClick(report as ProcessedReport)
                      }
                    />
                    <MarketTimingGroup
                      title="Not Specified"
                      icon={Calendar}
                      reports={dayReports.filter(
                        (r) => r.marketTiming === "NOT_SUPPLIED"
                      )}
                      bgColor="bg-gray-50 dark:bg-slate-800/50"
                      handleClick={(report) =>
                        handleFutureEarningsClick(report as ProcessedReport)
                      }
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
