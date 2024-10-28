import React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import {
  ProcessedTranscript,
  ProcessedReport,
} from "@/app/(auth)/(platform)/earnings/types";

interface WeekViewProps {
  weekDays: string[];
  weekDates: Date[];
  transcripts: ProcessedTranscript[];
  handleCompanyClick: (transcriptInfo: ProcessedTranscript) => void;
  futureEarningsReports: ProcessedReport[];
  handleFutureEarningsClick: (report: ProcessedReport) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  weekDays,
  weekDates,
  transcripts,
  handleCompanyClick,
  futureEarningsReports,
  handleFutureEarningsClick,
}) => {
  const getLogosForDate = (date: Date, transcripts: ProcessedTranscript[]) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

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
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

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

  return (
    <div className="flex-1 flex flex-col sm:flex-row bg-white rounded-lg shadow-sm overflow-hidden h-full">
      {weekDays.map((day, index) => {
        const dayContent = getLogosForDate(weekDates[index], transcripts);
        const dayReports = getReportsForDate(
          weekDates[index],
          futureEarningsReports
        );

        return (
          <div
            key={day}
            className="flex-1 flex flex-col border-b sm:border-b-0 sm:border-r last:border-r-0 border-gray-200"
          >
            <div className="p-3 text-center bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">{day}</h2>
              <p className="text-xs text-gray-500">
                {weekDates[index].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex-1 p-3 bg-white">
              {dayContent.length === 0 && dayReports.length === 0 ? (
                <NoEarnings />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {dayContent.map((transcript, logoIndex) => (
                    <div
                      key={`transcript-${logoIndex}`}
                      className="aspect-square relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md hover:border-gray-800 cursor-pointer flex flex-col"
                      onClick={() => handleCompanyClick(transcript)}
                    >
                      <div className="flex-1 relative">
                        {transcript.company?.logo ? (
                          <Image
                            src={transcript.company.logo}
                            alt={`${transcript.company.name} logo`}
                            layout="fill"
                            objectFit="contain"
                            className="p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {transcript.company?.symbol || ""}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-full bg-gray-50 py-1 px-2 border-t border-gray-200">
                        <span className="text-xs font-medium text-gray-800 block text-center">
                          {transcript.company?.symbol || ""}
                        </span>
                      </div>
                    </div>
                  ))}

                  {dayReports.map((report, reportIndex) => (
                    <div
                      key={`report-${reportIndex}`}
                      className="aspect-square relative bg-white border border-gray-200 rounded-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md hover:border-gray-800 cursor-pointer flex flex-col"
                      title={`${report.name} (${report.symbol})`}
                      onClick={() => handleFutureEarningsClick(report)}
                    >
                      <div className="flex-1 relative">
                        {report.company?.logo ? (
                          <Image
                            src={report.company.logo}
                            alt={`${report.name} logo`}
                            layout="fill"
                            objectFit="contain"
                            className="p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {report.symbol}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="w-full bg-gray-50 py-1 px-2 border-t border-gray-200">
                        <span className="text-xs font-medium text-gray-800 block text-center">
                          {report.symbol}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekView;
