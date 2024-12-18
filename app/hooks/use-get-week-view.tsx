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

interface WeekViewResponse {
  earnings: EarningsEntry[];
}
export const useGetWeekView = () => {
  const { currentDate } = useCalendarStore();
  const queryClient = useQueryClient();

  // Calculate dates for current week
  const { monday: currentMonday, friday: currentFriday } = React.useMemo(() => {
    return getWeekDates(currentDate);
  }, [currentDate]);

  // Calculate dates for next and previous weeks
  const nextWeekDates = React.useMemo(() => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 7);
    return getWeekDates(nextDate);
  }, [currentDate]);

  const prevWeekDates = React.useMemo(() => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 7);
    return getWeekDates(prevDate);
  }, [currentDate]);

  // Prefetch adjacent weeks
  React.useEffect(() => {
    // Prefetch next week
    queryClient.prefetchQuery({
      queryKey: [
        "week-view",
        nextWeekDates.monday.toISOString(),
        nextWeekDates.friday.toISOString(),
      ],
      queryFn: () => fetchWeekData(nextWeekDates.monday, nextWeekDates.friday),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Prefetch previous week
    queryClient.prefetchQuery({
      queryKey: [
        "week-view",
        prevWeekDates.monday.toISOString(),
        prevWeekDates.friday.toISOString(),
      ],
      queryFn: () => fetchWeekData(prevWeekDates.monday, prevWeekDates.friday),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  }, [currentDate, queryClient]);

  // Main query for current week
  return useQuery<WeekViewResponse>({
    queryKey: [
      "week-view",
      currentMonday.toISOString(),
      currentFriday.toISOString(),
    ],
    queryFn: () => fetchWeekData(currentMonday, currentFriday),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Helper function to calculate week dates
const getWeekDates = (date: Date) => {
  const mondayDate = new Date(date);
  mondayDate.setHours(0, 0, 0, 0);

  const day = mondayDate.getDay();
  const diff = mondayDate.getDate() - day + (day === 0 ? -6 : 1);
  mondayDate.setDate(diff);
  mondayDate.setUTCHours(0, 0, 0, 0);

  const fridayDate = new Date(mondayDate);
  fridayDate.setDate(mondayDate.getDate() + 4);
  fridayDate.setUTCHours(23, 59, 59, 999);

  return { monday: mondayDate, friday: fridayDate };
};

// Helper function to fetch week data
const fetchWeekData = async (monday: Date, friday: Date) => {
  const params = new URLSearchParams({
    startDate: monday.toISOString(),
    endDate: friday.toISOString(),
  });

  const response = await fetch(`/api/earnings/week?${params}`);
  if (!response.ok) throw new Error("Failed to fetch week view data");

  const data = await response.json();

  // Filter earnings based on calendar and blacklist
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
};
