"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Sun, Moon, LucideIcon, File } from "lucide-react";
import {
  ProcessedReport,
  ProcessedTranscript,
} from "@/app/(auth)/(platform)/earnings/types";
import { useGetDayView } from "@/app/hooks/use-get-day-view";
import Spinner from "@/components/ui/Spinner";

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
  const { data, isLoading, error } = useGetDayView(date);

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
      className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer"
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
        <h3 className="font-medium text-gray-900">{company.name}</h3>
        <div className="flex gap-4">
          <p className="text-sm text-gray-500">{company.symbol}</p>
          {estimate !== undefined && (
            <p className="text-sm text-gray-500">
              Est: ${estimate?.toFixed(2) || "N/A"}
            </p>
          )}
          {lastYearEPS !== undefined && (
            <p className="text-sm text-gray-500">
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
      <div className={`space-y-3 mt-4 ${className}`}>
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
    data?.reports.reduce((acc, report) => {
      const timing = report.marketTiming || "NOT_SUPPLIED";
      if (!acc[timing]) acc[timing] = [];
      acc[timing].push(report);
      return acc;
    }, {} as Record<string, ProcessedReport[]>) || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        {formatDate(date)}
      </h2>

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

      {!isLoading && !error && !data && (
        <div className="flex justify-center items-center min-h-[200px] text-gray-600">
          No data available
        </div>
      )}

      {/* Content */}
      {data && (
        <>
          {/* Transcripts */}
          {data.transcripts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Earnings Transcripts
              </h3>
              <div className="grid gap-3">
                {data.transcripts.map((transcript) => (
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

          {/* Reports */}
          {data.reports.length > 0 && (
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

              {data.transcripts.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <File className="w-5 h-5" />
                    Earnings Transcripts
                  </h3>
                  <div className="grid gap-3">
                    {data.transcripts.map((transcript) => (
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

export default DayView;
