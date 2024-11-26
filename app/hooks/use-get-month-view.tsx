import { useQuery } from "@tanstack/react-query";
import { useCalendarStore } from "@/store/CalendarStore";
import React from "react";

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

      // // Filter out blacklisted symbols
      // const filteredData = data.filter(
      //   (entry: EarningsEntry) => {
      //     const symbol = entry.symbol.toUpperCase();
      //     return !BLACKLISTED_SYMBOLS.some(blacklisted => blacklisted.toUpperCase() === symbol);
      //   }
      // );

      // data = filteredData;

      const data = (await response.json().then((data:{earnings:EarningsEntry[]})=>{

        return data.earnings
      })) as EarningsEntry[];

      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
