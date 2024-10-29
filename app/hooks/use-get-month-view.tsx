import { useQuery } from "@tanstack/react-query";
import { useCalendarStore } from "@/store/CalendarStore";
import {
  ProcessedReport,
  ProcessedTranscript,
} from "@/app/(auth)/(platform)/earnings/types";
import React from "react";

interface MonthViewResponse {
  transcripts: ProcessedTranscript[];
  reports: ProcessedReport[];
}

export const useGetMonthView = () => {
  const { currentDate } = useCalendarStore();

  // Calculate first and last day of the month including visible dates
  const { startDate, endDate } = React.useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayWeekday = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const lastDayWeekday = lastDay.getDay();

    // Adjust start date to include visible days from previous month
    const start = new Date(firstDay);
    start.setDate(1 - firstDayWeekday);
    start.setUTCHours(0, 0, 0, 0);

    // Adjust end date to include visible days from next month
    const end = new Date(lastDay);
    end.setDate(lastDay.getDate() + (6 - lastDayWeekday));
    end.setUTCHours(23, 59, 59, 999);

    return {
      startDate: start,
      endDate: end,
    };
  }, [currentDate]);

  return useQuery<MonthViewResponse>({
    queryKey: ["month-view", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`/api/earnings/month?${params}`);
      if (!response.ok) throw new Error("Failed to fetch month view data");

      const data = await response.json();

      return {
        transcripts: data.transcripts.map((t: any) => ({
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
        })),
        reports: data.reports.map((r: any) => ({
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
