import { useQuery } from "@tanstack/react-query";
import { useCalendarStore } from "@/store/CalendarStore";
import React from "react";
import { MarketTime, TranscriptStatus } from "@prisma/client";

interface Company {
  id: string;
  symbol: string;
  name: string | null;
  logo: string | null;
}

interface RawTranscript {
  id: string;
  companyId: string;
  title: string | null;
  scheduledAt: string;
  quarter: number | null;
  year: number | null;
  audioUrl: string | null;
  MarketTime: MarketTime;
  status: TranscriptStatus;
  epsActual: number | null;
  epsEstimate: number | null;
  revenueActual: number | null;
  revenueEstimate: number | null;
  company: Company;
}

export interface ProcessedTranscript
  extends Omit<RawTranscript, "scheduledAt"> {
  scheduledAt: Date;
}

interface WeekViewResponse {
  transcripts: ProcessedTranscript[];
}

export const useGetWeekView = () => {
  const { currentDate } = useCalendarStore();

  const { monday, friday } = React.useMemo(() => {
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);

    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    const mondayDate = new Date(date);
    mondayDate.setDate(diff);
    mondayDate.setUTCHours(0, 0, 0, 0);

    const fridayDate = new Date(mondayDate);
    fridayDate.setDate(mondayDate.getDate() + 4);
    fridayDate.setUTCHours(23, 59, 59, 999);

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
        transcripts: data.transcripts.map((t: RawTranscript) => ({
          ...t,
          scheduledAt: new Date(t.scheduledAt),
        })),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
