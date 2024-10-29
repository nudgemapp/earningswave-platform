import React from "react";
import Image from "next/image";
import { Calendar, Sun, Moon, LucideIcon } from "lucide-react";
import { useCalendarStore } from "@/store/CalendarStore";
import {
  ProcessedTranscript,
  ProcessedReport,
} from "@/app/(auth)/(platform)/earnings/types";
import { useGetWeekView } from "@/app/hooks/use-get-week-view";
import LoadingSpinner from "@/components/LoadingSpinner";

interface WeekViewProps {
  handleCompanyClick: (transcriptInfo: ProcessedTranscript) => void;
  handleFutureEarningsClick: (report: ProcessedReport) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  handleCompanyClick,
  handleFutureEarningsClick,
}) => {
  const currentDate = useCalendarStore((state) => state.currentDate);

  const { weekDates } = React.useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    const mondayDate = new Date(date);
    mondayDate.setDate(diff);
    mondayDate.setHours(0, 0, 0, 0);

    const fridayDate = new Date(mondayDate);
    fridayDate.setDate(mondayDate.getDate() + 4);
    fridayDate.setHours(23, 59, 59, 999);

    const dates = [];
    for (let i = 0; i < 5; i++) {
      const newDate = new Date(mondayDate);
      newDate.setDate(mondayDate.getDate() + i);
      dates.push(newDate);
    }

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

  const { transcripts, reports } = data;

  // Pre-process data for each day
  const getDateContent = weekDates.map((date) => {
    // Create a date without time component for comparison
    const currentDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - 1
    ).toDateString();

    const dayTranscripts = transcripts.filter((transcript) => {
      const transcriptDate = new Date(transcript.date).toDateString();
      return transcriptDate === currentDay;
    });

    const dayReports = reports.filter((report) => {
      const reportDate = new Date(report.reportDate).toDateString();
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
    <div className="w-full min-h-[200px] flex items-center justify-center bg-gray-50 border border-gray-200 rounded-sm">
      <div className="flex flex-row items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">No earnings</span>
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
      className="aspect-square relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md hover:border-gray-800 cursor-pointer flex flex-col"
      onClick={onClick}
      title={`${name} (${symbol})`}
    >
      <div className="flex-1 relative">
        {logo ? (
          <Image
            src={logo}
            alt={`${name} logo`}
            layout="fill"
            objectFit="contain"
            className="p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm font-medium">{symbol}</span>
          </div>
        )}
      </div>
      <div className="w-full bg-gray-50 py-1 px-2 border-t border-gray-200">
        <span className="text-xs font-medium text-gray-800 block text-center truncate">
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

    return (
      <div className={`p-1 rounded-md mb-1 ${bgColor}`}>
        <div className="flex items-center gap-1 mb-1">
          <Icon className="w-3 h-3 text-gray-600" />
          <span className="text-[10px] font-medium text-gray-600">{title}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {reports.map((report, index) => (
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

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden h-full">
      <div className="flex flex-row">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className="flex-1 bg-gray-50 border-r last:border-r-0 border-gray-200"
          >
            <div className="p-2 text-center border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">{day}</h2>
              <p className="text-xs text-gray-500">
                {weekDates[index].toLocaleDateString("en-US", headerDateFormat)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-row overflow-y-auto">
        {weekDays.map((day, index) => {
          const { dayTranscripts, dayReports, isEmpty } = getDateContent[index];

          return (
            <div
              key={day}
              className="flex-1 border-r last:border-r-0 border-gray-200"
            >
              <div className="p-2 bg-white overflow-y-auto">
                {isEmpty ? (
                  <NoEarnings />
                ) : (
                  <div className="flex flex-col space-y-2">
                    {/* Past Transcripts */}
                    {dayTranscripts.length > 0 && (
                      <MarketTimingGroup
                        title="Past Earnings"
                        icon={Calendar}
                        reports={dayTranscripts}
                        bgColor="bg-gray-50"
                        handleClick={(report) =>
                          handleCompanyClick(report as ProcessedTranscript)
                        }
                      />
                    )}

                    {/* Pre-market reports */}
                    <MarketTimingGroup
                      title="Pre-Market"
                      icon={Sun}
                      reports={dayReports.filter(
                        (r) => r.marketTiming === "PRE_MARKET"
                      )}
                      bgColor="bg-blue-50"
                      handleClick={(report) =>
                        handleFutureEarningsClick(report as ProcessedReport)
                      }
                    />

                    {/* After-hours reports */}
                    <MarketTimingGroup
                      title="After Hours"
                      icon={Moon}
                      reports={dayReports.filter(
                        (r) => r.marketTiming === "AFTER_HOURS"
                      )}
                      bgColor="bg-orange-50"
                      handleClick={(report) =>
                        handleFutureEarningsClick(report as ProcessedReport)
                      }
                    />

                    {/* Not supplied timing reports */}
                    <MarketTimingGroup
                      title="Not Specified"
                      icon={Calendar}
                      reports={dayReports.filter(
                        (r) => r.marketTiming === "NOT_SUPPLIED"
                      )}
                      bgColor="bg-gray-50"
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
