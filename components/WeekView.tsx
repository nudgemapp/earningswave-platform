import React from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { filter, pipe, equals, path } from "ramda";
import { EarningsCallTranscript, EarningsReport } from "@prisma/client";
import { EarningsReportWithCompany } from "@/app/(auth)/(platform)/earnings/page";
import { useUser } from "@clerk/nextjs";

const WeekView = ({
  weekDays,
  weekDates,
  transcripts,
  handleCompanyClick,
  futureEarningsReports,
  handleFutureEarningsClick,
}: {
  weekDays: string[];
  weekDates: Date[];
  transcripts: EarningsCallTranscript[];
  handleCompanyClick: (transcriptInfo: EarningsCallTranscript) => void;
  futureEarningsReports: EarningsReportWithCompany[];
  handleFutureEarningsClick: (report: EarningsReport) => void;
}) => {
  const user = useUser();

  const getLogosForDate = (
    date: Date,
    transcripts: EarningsCallTranscript[]
  ) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    return filter(
      pipe((transcript) => {
        const transcriptDate = path(["company_info", "date"], transcript);
        return equals(transcriptDate, formattedDate);
      }),
      transcripts
    );
  };

  const getReportsForDate = (
    date: Date,
    reports: EarningsReportWithCompany[]
  ) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    return filter(
      pipe((report) => {
        const reportDate = report.reportDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        });
        return equals(reportDate, formattedDate);
      }),
      reports
    );
  };

  const NoEarnings = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded-sm">
      <div className="flex flex-row items-center space-y-1 gap-2">
        <Calendar className="w-6 h-6 text-gray-400" />
        <span className="text-xs font-medium text-gray-500">No earnings</span>
      </div>
    </div>
  );

  console.log(user);

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
            <div className="flex-1 p-3 bg-white flex flex-col">
              {dayContent.length === 0 && dayReports.length === 0 ? (
                <NoEarnings />
              ) : (
                <div className="grid grid-cols-2 gap-3 w-full h-full">
                  {dayContent.map((transcriptInfo, logoIndex) => (
                    <div
                      key={`transcript-${logoIndex}`}
                      className="aspect-square relative bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:border-blue-300 cursor-pointer"
                      onClick={() => handleCompanyClick(transcriptInfo)}
                    >
                      <Image
                        src={
                          (
                            transcriptInfo.company_info as {
                              logo_base64?: string;
                            }
                          )?.logo_base64 || ""
                        }
                        alt={`${
                          (
                            transcriptInfo.company_info as {
                              company_name?: string;
                            }
                          )?.company_name || "Company"
                        } logo`}
                        layout="fill"
                        objectFit="contain"
                        className="p-2"
                      />
                    </div>
                  ))}
                  {dayReports.map((report, reportIndex) => (
                    <div
                      key={`report-${reportIndex}`}
                      className="aspect-square relative bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:border-blue-300 cursor-pointer"
                      title={`${report.name} (${report.symbol})`}
                      onClick={() => handleFutureEarningsClick(report)}
                    >
                      {report.company?.logo?.dataBase64 ? (
                        <Image
                          src={report.company.logo.dataBase64}
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
