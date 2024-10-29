import { useQuery } from "@tanstack/react-query";
import { useCalendarStore } from "@/store/CalendarStore";
import {
  ProcessedReport,
  ProcessedTranscript,
} from "@/app/(auth)/(platform)/earnings/types";
import React from "react";

interface WeekViewResponse {
  transcripts: ProcessedTranscript[];
  reports: ProcessedReport[];
}

export const useGetWeekView = () => {
  const { currentDate } = useCalendarStore();

  // Calculate Monday and Friday dates
  const { monday, friday } = React.useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    const mondayDate = new Date(date);
    mondayDate.setDate(diff);
    mondayDate.setHours(0, 0, 0, 0);

    const fridayDate = new Date(mondayDate);
    fridayDate.setDate(mondayDate.getDate() + 4);
    fridayDate.setHours(23, 59, 59, 999);

    return { monday: mondayDate, friday: fridayDate };
  }, [currentDate]);

  return useQuery<WeekViewResponse>({
    queryKey: ["week-view", monday.toISOString(), friday.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: monday.toISOString(),
        endDate: friday.toISOString(),
      });

      const response = await fetch(`/api/earnings/week?${params}`);
      if (!response.ok) throw new Error("Failed to fetch week view data");

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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
