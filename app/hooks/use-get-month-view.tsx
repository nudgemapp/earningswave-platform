import { useQuery } from "@tanstack/react-query";
import { useCalendarStore } from "@/store/CalendarStore";
import React from "react";
import { BLACKLISTED_SYMBOLS } from "../constants/blacklist";
import { getSymbolsForDate } from "../constants/earnings-calendar";

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

// interface MonthViewResponse {
//   data: EarningsEntry[];
// }

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

  return useQuery<EarningsEntry[]>({
    queryKey: ["month-view", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const response = await fetch(`/api/earnings/month?${params}`, {
        next: { revalidate: 300 },
      });

      if (!response.ok) throw new Error("Failed to fetch month view data");

      const data = await response
        .json()
        .then((data: { earnings: EarningsEntry[] }) => {
          const filteredEarnings = data.earnings.filter(
            (entry: EarningsEntry) => {
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
            }
          );
          return filteredEarnings;
        });

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
