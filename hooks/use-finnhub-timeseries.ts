import { useQuery } from "@tanstack/react-query";
import { StockData, FinnhubCandle } from "@/app/types/StockQuote";

interface TimeframeConfig {
  resolution: string;
  hoursAdjustment?: {
    start: number;
    end: number;
  };
}

const TIMEFRAME_CONFIGS: Record<string, TimeframeConfig> = {
  "1D": { resolution: "1", hoursAdjustment: { start: 4, end: 20 } },
  "1W": { resolution: "5" },
  "1M": { resolution: "15" },
  "6M": { resolution: "D" },
  "1Y": { resolution: "D" },
};

const getMarketSession = (
  date: Date,
  timeframe: string
): "pre" | "regular" | "post" => {
  if (timeframe !== "1D") return "regular";

  const timeInMinutes = date.getHours() * 60 + date.getMinutes();
  if (timeInMinutes >= 240 && timeInMinutes < 570) return "pre";
  if (timeInMinutes >= 960) return "post";
  return "regular";
};

const formatTimeString = (date: Date, timeframe: string): string => {
  if (timeframe === "1D") {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: timeframe === "1Y" ? "numeric" : undefined,
  });
};

const transformFinnhubData = (
  result: FinnhubCandle,
  timeframe: string
): StockData[] => {
  if (result.s !== "ok" || !result.t || result.t.length === 0) {
    return [];
  }

  return result.t
    .map((timestamp, index) => {
      const date = new Date(timestamp * 1000);
      return {
        date: date.toISOString(),
        time: formatTimeString(date, timeframe),
        open: result.o[index],
        close: result.c[index],
        high: result.h[index],
        low: result.l[index],
        volume: result.v[index],
        gain: result.c[index] > result.o[index],
        marketSession: getMarketSession(date, timeframe),
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const calculateTimeRange = (timeframe: string) => {
  const now = new Date();
  const estNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const startDate = new Date(estNow);
  const endDate = new Date(estNow);
  const config = TIMEFRAME_CONFIGS[timeframe];

  if (config.hoursAdjustment) {
    startDate.setHours(config.hoursAdjustment.start, 0, 0, 0);
    endDate.setHours(config.hoursAdjustment.end, 0, 0, 0);
  } else {
    switch (timeframe) {
      case "1W":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "1M":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "6M":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "1Y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
  }

  return {
    startTime: Math.floor(startDate.getTime() / 1000),
    endTime: Math.floor(Math.min(endDate.getTime(), estNow.getTime()) / 1000),
    resolution: config.resolution,
  };
};

export const useFinnhubTimeseries = (
  symbol: string,
  timeframe: string = "1D"
) => {
  return useQuery({
    queryKey: ["finnhub-timeseries", symbol, timeframe],
    queryFn: async () => {
      const { startTime, endTime, resolution } = calculateTimeRange(timeframe);

      const response = await fetch(
        `/api/timeFrame?symbol=${symbol}&resolution=${resolution}&from=${startTime}&to=${endTime}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Finnhub data");
      }

      const result: FinnhubCandle = await response.json();
      return transformFinnhubData(result, timeframe);
    },
    enabled: !!symbol,
    staleTime: timeframe === "1D" ? 60 * 1000 : 5 * 60 * 1000, // 1 minute for 1D, 5 minutes for others
    refetchInterval: timeframe === "1D" ? 60 * 1000 : false, // Only auto-refetch for 1D timeframe
  });
};
