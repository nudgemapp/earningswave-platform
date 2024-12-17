import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BLACKLISTED_SYMBOLS } from "@/app/constants/blacklist";
import { getSymbolsForDate } from "@/app/constants/earnings-calendar";

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

interface DayViewResponse {
  earnings: EarningsEntry[];
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
    enabled: !!date,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
