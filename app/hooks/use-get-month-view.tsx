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

  // Calculate visible date range for the month view
  const { startDate, endDate } = React.useMemo(() => {
    const date = new Date(currentDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get first day of the month
    const start = new Date(year, month, 1);
    // Adjust to include previous month days that are visible
    const startDay = start.getDay();
    start.setDate(start.getDate() - (startDay === 0 ? 6 : startDay - 1));
    start.setHours(0, 0, 0, 0);

    // Get last day of the month
    const end = new Date(year, month + 1, 0);
    // Adjust to include next month days that are visible
    const endDay = end.getDay();
    end.setDate(end.getDate() + (endDay === 0 ? 0 : 7 - endDay));
    end.setHours(23, 59, 59, 999);

    return { startDate: start, endDate: end };
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
        transcripts: data.transcripts.map((t: ProcessedTranscript) => ({
          ...t,
          date: new Date(t.date),
        })),
        reports: data.reports.map((r: ProcessedReport) => ({
          ...r,
          reportDate: new Date(r.reportDate),
          fiscalDateEnding: new Date(r.fiscalDateEnding),
          lastYearReportDate: r.lastYearReportDate
            ? new Date(r.lastYearReportDate)
            : null,
        })),
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
