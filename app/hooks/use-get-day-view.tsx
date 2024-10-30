import { useQuery } from "@tanstack/react-query";
import {
  EarningsCallTranscriptWithCompany,
  EarningsReportWithCompany,
  ProcessedReport,
  ProcessedTranscript,
} from "@/app/(auth)/(platform)/earnings/types";
import React from "react";

interface DayViewResponse {
  transcripts: ProcessedTranscript[];
  reports: ProcessedReport[];
}

export const useGetDayView = (date: Date) => {
  const { startOfDay, endOfDay } = React.useMemo(() => {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);

    return { startOfDay: start, endOfDay: end };
  }, [date]);

  return useQuery<DayViewResponse>({
    queryKey: ["day-view", startOfDay.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
      });

      const response = await fetch(`/api/earnings/day?${params}`);
      if (!response.ok) throw new Error("Failed to fetch day view data");

      const data = await response.json();
      return {
        transcripts: data.transcripts.map(
          (t: EarningsCallTranscriptWithCompany) => ({
            ...t,
            date: new Date(t.date),
            company: t.company
              ? {
                  ...t.company,
                  logo: t.company.logo?.data
                    ? `data:image/png;base64,${Buffer.from(
                        t.company.logo.data
                      ).toString("base64")}`
                    : null,
                }
              : null,
          })
        ),
        reports: data.reports.map((r: EarningsReportWithCompany) => ({
          ...r,
          reportDate: new Date(r.reportDate),
          fiscalDateEnding: new Date(r.fiscalDateEnding),
          lastYearReportDate: r.lastYearReportDate
            ? new Date(r.lastYearReportDate)
            : null,
          company: r.company
            ? {
                ...r.company,
                logo: r.company.logo?.data
                  ? `data:image/png;base64,${Buffer.from(
                      r.company.logo.data
                    ).toString("base64")}`
                  : null,
              }
            : null,
        })),
      };
    },
    enabled: !!date,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
