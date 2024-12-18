import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  // Calculate dates for current month
  const { startDate: currentStartDate, endDate: currentEndDate } =
    React.useMemo(() => {
      return getMonthDates(currentDate);
    }, [currentDate]);

  // Calculate dates for next and previous months
  const nextMonthDates = React.useMemo(() => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    return getMonthDates(nextDate);
  }, [currentDate]);

  const prevMonthDates = React.useMemo(() => {
    const prevDate = new Date(currentDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    return getMonthDates(prevDate);
  }, [currentDate]);

  // Prefetch adjacent months
  React.useEffect(() => {
    // Prefetch next month
    queryClient.prefetchQuery({
      queryKey: [
        "month-view",
        nextMonthDates.startDate.toISOString(),
        nextMonthDates.endDate.toISOString(),
      ],
      queryFn: () =>
        fetchMonthData(nextMonthDates.startDate, nextMonthDates.endDate),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Prefetch previous month
    queryClient.prefetchQuery({
      queryKey: [
        "month-view",
        prevMonthDates.startDate.toISOString(),
        prevMonthDates.endDate.toISOString(),
      ],
      queryFn: () =>
        fetchMonthData(prevMonthDates.startDate, prevMonthDates.endDate),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  }, [currentDate, queryClient]);

  // Main query for current month
  return useQuery<EarningsEntry[]>({
    queryKey: [
      "month-view",
      currentStartDate.toISOString(),
      currentEndDate.toISOString(),
    ],
    queryFn: () => fetchMonthData(currentStartDate, currentEndDate),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Helper function to calculate month dates (your existing function)
const getMonthDates = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const firstDayWeekday = firstDay.getDay();

  const lastDay = new Date(year, month + 1, 0);
  const lastDayWeekday = lastDay.getDay();

  const start = new Date(firstDay);
  start.setDate(1 - firstDayWeekday);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(lastDay);
  end.setDate(lastDay.getDate() + (6 - lastDayWeekday));
  end.setUTCHours(23, 59, 59, 999);

  return { startDate: start, endDate: end };
};

// Helper function to fetch month data
const fetchMonthData = async (startDate: Date, endDate: Date) => {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const response = await fetch(`/api/earnings/month?${params}`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) throw new Error("Failed to fetch month view data");

  const data = await response.json();

  // Filter earnings based on calendar and blacklist
  const filteredEarnings = data.earnings.filter((entry: EarningsEntry) => {
    const symbol = entry.symbol.toUpperCase();

    if (
      BLACKLISTED_SYMBOLS.some(
        (blacklisted) => blacklisted.toUpperCase() === symbol
      )
    ) {
      return false;
    }

    const entryDate = entry.earningsDate.split("T")[0];
    const scheduledSymbols = getSymbolsForDate(entryDate);

    return (
      scheduledSymbols.length === 0 || scheduledSymbols.includes(entry.symbol)
    );
  });

  return filteredEarnings;
};
