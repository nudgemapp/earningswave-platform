import { useQuery } from "@tanstack/react-query";
import { useCalendarStore } from "@/store/CalendarStore";
import React from "react";
import { BLACKLISTED_SYMBOLS } from "../constants/blacklist";
import {
  EARNINGS_CALENDAR,
  getSymbolsForDate,
} from "../constants/earnings-calendar";

interface Company {
  id: string;
  symbol: string;
  name: string | null;
  logo: string | null;
  description: string;
  currency: string;
  marketCapitalization: number | null;
  weburl: string | null;
  finnhubIndustry: string | null;
  exchange: string | null;
}

interface EarningsEntry {
  id: string;
  symbol: string;
  quarter: number;
  year: number;
  earningsDate: string;
  earningsTime: string;
  isDateConfirmed: boolean;
  marketCap: number | null;
  totalForDay: number;
  remainingCount: number;
  company: Company;
}

interface WeekViewResponse {
  earnings: EarningsEntry[];
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

      // Filter earnings based on both calendar and blacklist
      data.earnings = data.earnings.filter((entry: EarningsEntry) => {
        const symbol = entry.symbol.toUpperCase();

        // First, check if symbol is blacklisted
        if (
          BLACKLISTED_SYMBOLS.some(
            (blacklisted) => blacklisted.toUpperCase() === symbol
          )
        ) {
          return false;
        }

        // Then check calendar filtering
        const entryDate = entry.earningsDate.split("T")[0];
        const scheduledSymbols = getSymbolsForDate(entryDate);

        // If we have no scheduled symbols for this date, let all entries through
        if (scheduledSymbols.length === 0) {
          return true;
        }

        // Otherwise, only show scheduled symbols
        return scheduledSymbols.includes(entry.symbol);
      });

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
