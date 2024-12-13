"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
} from "recharts";
import { useStockWebSocket } from "@/hooks/use-stock-websocket";
import { useQuery } from "@tanstack/react-query";
import { StockQuote } from "@/app/types/StockQuote";
import { MARKET_HOLIDAYS } from "@/app/constants/holidays";

interface StockChartProps {
  symbol: string;
  timeframe?: string;
  onTimeframeChange: (tf: string) => void;
  todayData: (data: {
    prevClose: number | null;
    preMarket: number | null;
    regular: number | null;
    afterHours: number | null;
    regularOpen: number | null;
    percentChange: number | null;
    priceDifference: number | null;
    mostRecentDate?: string | null;
    atClose?: number | null;
  }) => void;
}

interface StockData {
  date: string;
  time: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  gain: boolean;
  marketSession: "pre" | "regular" | "post";
}

interface RealtimeStockData {
  realtimePrice: number;
  lastUpdate: string;
  data: StockData[];
}

interface FinnhubCandle {
  c: number[]; // close prices
  h: number[]; // high prices
  l: number[]; // low prices
  o: number[]; // open prices
  s: string; // status
  t: number[]; // timestamps
  v: number[]; // volume
}

const StockPriceChart: React.FC<StockChartProps> = ({
  symbol,
  timeframe = "1D",
  onTimeframeChange,
  todayData,
}) => {
  const { isConnected, error } = useStockWebSocket(symbol);

  const { data: realtimeData } = useQuery<RealtimeStockData>({
    queryKey: ["stockPrice", symbol],
    enabled: !!symbol && isConnected,
    staleTime: 0, // Always fresh data
    refetchOnWindowFocus: false, // No need to refetch on focus
  });

  console.log("realtimeData", realtimeData);

  const [filteredData, setFilteredData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayPrices, setTodayPrices] = useState<{
    prevClose: number | null;
    preMarket: number | null;
    regular: number | null;
    afterHours: number | null;
    regularOpen: number | null;
    percentChange: number | null;
    priceDifference: number | null;
    mostRecentDate?: string | null;
    atClose?: number | null;
  }>({
    prevClose: null,
    atClose: null,
    preMarket: null,
    regular: null,
    afterHours: null,
    regularOpen: null,
    percentChange: null,
    priceDifference: null,
    mostRecentDate: null,
  });

  // Memoize timeframe buttons
  const timeframeButtons = useMemo(() => ["1D", "1W", "1M", "6M", "1Y"], []);

  const isMarketHoliday = (date: Date): boolean => {
    const dateString = date.toISOString().split("T")[0];
    return MARKET_HOLIDAYS.some(
      (holiday) => holiday.date === dateString && holiday.closed
    );
  };

  const adjustToMarketDay = (date: Date): Date => {
    const adjustedDate = new Date(date);
    while (
      adjustedDate.getDay() === 0 ||
      adjustedDate.getDay() === 6 ||
      isMarketHoliday(adjustedDate)
    ) {
      adjustedDate.setDate(adjustedDate.getDate() - 1);
    }
    return adjustedDate;
  };

  const fetchTodayPrices = async () => {
    if (!symbol) return;

    try {
      const data = await fetch(
        `/api/companies/recentPrice?symbol=${symbol}`
      ).then((res: Response) => res.json() as Promise<StockQuote>);
      const todayDate = new Date();
      const adjustedDate = adjustToMarketDay(todayDate);

      // Convert to string in YYYY-MM-DD format
      const todayDateString = adjustedDate.toISOString().split("T")[0];

      const preMarketPrice = null;
      const afterHoursPrice = null;

      // Check if current time is after hours, weekend, or holiday
      const isAfterMarketHours = new Date().getHours() >= 16;
      const isWeekend =
        adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6;
      const isHoliday = isMarketHoliday(adjustedDate);
      const isMarketClosed = isAfterMarketHours || isWeekend || isHoliday;

      todayData({
        preMarket: preMarketPrice,
        regular: data.c,
        atClose: isMarketClosed ? data.c : null,
        afterHours: isMarketClosed ? data.c : null,
        regularOpen: data.o,
        percentChange: data.dp,
        priceDifference: data.d,
        mostRecentDate: todayDateString,
        prevClose: data.pc,
      });

      setTodayPrices({
        preMarket: preMarketPrice,
        regular: data.c,
        atClose: isMarketClosed ? data.c : null,
        afterHours: isMarketClosed ? data.c : afterHoursPrice,
        regularOpen: data.o,
        percentChange: data.dp,
        priceDifference: data.d,
        mostRecentDate: todayDateString,
        prevClose: data.pc,
      });
    } catch (error) {
      console.error("Error fetching today's prices:", error);
    }
  };

  useEffect(() => {
    fetchTodayPrices();
  }, [symbol, timeframe]);

  const getTimeframeData = (data: StockData[]) => {
    if (!data || data.length === 0) {
      console.log("No data received in getTimeframeData");
      return [];
    }

    const now = new Date();
    const filteredData = data.filter((point: StockData) => {
      const pointDate = new Date(point.date);

      switch (timeframe) {
        case "1D":
          return (
            pointDate.getDate() === now.getDate() &&
            pointDate.getMonth() === now.getMonth() &&
            pointDate.getFullYear() === now.getFullYear()
          );

        case "1W":
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          return pointDate >= oneWeekAgo;

        case "1M":
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return pointDate >= oneMonthAgo;

        case "6M":
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          return pointDate >= sixMonthsAgo;

        case "1Y":
          const oneYearAgo = new Date(now);
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          return pointDate >= oneYearAgo;

        default:
          return true;
      }
    });
    // console.log("filteredData", filteredData);

    return filteredData;
  };

  // Update the yDomain calculation in the useMemo hook
  const yDomain = useMemo(() => {
    if (filteredData.length === 0) return ["auto", "auto"];

    const prices = filteredData.map((d) => d.close);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1; // 10% padding

    return [
      Math.floor((min - padding) * 100) / 100, // Round down to 2 decimal places
      Math.ceil((max + padding) * 100) / 100, // Round up to 2 decimal places
    ];
  }, [filteredData]);

  // Update todayPrices based on realtime data
  useEffect(() => {
    if (realtimeData?.realtimePrice && todayPrices.prevClose) {
      const priceDiff = realtimeData.realtimePrice - todayPrices.prevClose;
      const percentChange = (priceDiff / todayPrices.prevClose) * 100;

      setTodayPrices((prev) => {
        todayData({
          ...prev,
          regular: realtimeData.realtimePrice,
          priceDifference: priceDiff,
          percentChange: percentChange,
        });

        return {
          ...prev,
          afterHours: isAfterHours ? realtimeData.realtimePrice : null,
          regular: realtimeData.realtimePrice,
          priceDifference: priceDiff,
          percentChange: percentChange,
        };
      });
    }
  }, [realtimeData?.realtimePrice, todayPrices.prevClose]);

  // Update the regular market price display
  useEffect(() => {
    if (realtimeData?.realtimePrice) {
      const percentChange = todayPrices.prevClose
        ? ((realtimeData.realtimePrice - todayPrices.prevClose) /
            todayPrices.prevClose) *
          100
        : null;

      setTodayPrices((prev) => {
        todayData({
          ...prev,
          regular: realtimeData.realtimePrice,
          percentChange,
          priceDifference: todayPrices.prevClose
            ? realtimeData.realtimePrice - todayPrices.prevClose
            : null,
        });

        return {
          ...prev,
          regular: realtimeData.realtimePrice,
          percentChange,
          priceDifference: todayPrices.prevClose
            ? realtimeData.realtimePrice - todayPrices.prevClose
            : null,
        };
      });
    }
  }, [realtimeData?.realtimePrice]);

  // Add state to track current time with more frequent updates
  const [currentTime, setCurrentTime] = useState(new Date());

  // Add useEffect for time updates
  useEffect(() => {
    // Update time every second for more accurate display
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    // Set initial time
    setCurrentTime(new Date());

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Use currentTime instead of new Date()
  const isAfterHours = currentTime.getHours() >= 16;

  const fetchFinnhubTimeSeriesData = async (
    symbol: string,
    timeframe: string = "1D"
  ): Promise<(StockData & { time: string })[]> => {
    try {
      // Get current date in EST
      const now = new Date();
      const estNow = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
      );

      // Calculate start and end dates based on timeframe
      let startDate = new Date(estNow);
      let endDate = new Date(estNow);
      let resolution = "1"; // Default 1 minute resolution for 1D

      switch (timeframe) {
        case "1D":
          startDate.setHours(4, 0, 0, 0); // Start at 4 AM EST
          endDate.setHours(20, 0, 0, 0); // End at 8 PM EST
          resolution = "1"; // 1 minute resolution
          break;
        case "1W":
          startDate.setDate(startDate.getDate() - 7);
          resolution = "5"; // 5 minute resolution
          break;
        case "1M":
          startDate.setMonth(startDate.getMonth() - 1);
          resolution = "15"; // 15 minute resolution
          break;
        case "6M":
          startDate.setMonth(startDate.getMonth() - 6);
          resolution = "D"; // Daily resolution for 6M
          break;
        case "1Y":
          startDate.setFullYear(startDate.getFullYear() - 1);
          resolution = "D"; // Daily resolution for 1Y
          break;
      }

      // Ensure we're not requesting future data
      if (endDate > estNow) {
        endDate = estNow;
      }

      const startTime = Math.floor(startDate.getTime() / 1000);
      const endTime = Math.floor(endDate.getTime() / 1000);

      console.log("Fetching data:", {
        timeframe,
        startDate: new Date(startTime * 1000).toISOString(),
        endDate: new Date(endTime * 1000).toISOString(),
        resolution,
      });

      const response = await fetch(
        `/api/timeFrame?symbol=${symbol}&resolution=${resolution}&from=${startTime}&to=${endTime}`
      );

      if (!response.ok) throw new Error("Failed to fetch Finnhub data");

      const result: FinnhubCandle = await response.json();

      if (result.s !== "ok" || !result.t || result.t.length === 0) {
        throw new Error("Invalid data received from Finnhub");
      }

      // Transform the data into StockData format
      const transformedData = result.t.map((timestamp, index) => {
        const date = new Date(timestamp * 1000);
        let timeStr;

        if (timeframe === "1D") {
          timeStr = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        } else {
          timeStr = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: timeframe === "1Y" ? "numeric" : undefined,
          });
        }

        const marketSession = getMarketSession(date, timeframe);

        return {
          date: date.toISOString(),
          time: timeStr,
          open: result.o[index],
          close: result.c[index],
          high: result.h[index],
          low: result.l[index],
          volume: result.v[index],
          gain: result.c[index] > result.o[index],
          marketSession,
        };
      });

      return transformedData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error("Error fetching Finnhub time series:", error);
      return [];
    }
  };

  // Add helper function to determine market session
  const getMarketSession = (
    date: Date,
    timeframe: string
  ): "pre" | "regular" | "post" => {
    if (timeframe !== "1D") return "regular";

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    if (timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30) {
      return "pre";
    } else if (timeInMinutes >= 16 * 60 && timeInMinutes <= 20 * 60) {
      return "post";
    }
    return "regular";
  };

  const getChartData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchFinnhubTimeSeriesData(symbol, timeframe);

      if (!data || data.length === 0) {
        console.log("No data received from Finnhub");
        setFilteredData([]);
        setIsLoading(false);
        return;
      }

      const timeframeData = getTimeframeData(data);
      setFilteredData(timeframeData);
    } catch (error) {
      console.error("Error in getChartData:", error);
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the useEffect for data fetching
  useEffect(() => {
    if (error) {
      console.log("Error ", error);
    }

    let isMounted = true;

    const fetchData = async () => {
      await getChartData();
      if (isMounted) {
        // Set up interval only for 1D timeframe
        if (timeframe === "1D") {
          const interval = setInterval(() => {
            getChartData();
          }, 60000); // Call every minute
          return () => clearInterval(interval);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [symbol, timeframe]);

  // Add a new function to handle timeframe changes
  const handleTimeframeChange = (tf: string) => {
    // Only set loading state for the chart section
    setIsLoading(true);
    onTimeframeChange(tf);

    // Fetch new data without clearing existing data
    getChartData().then(() => {
      setIsLoading(false);
    });
  };

  // Cleanup function will be called when component unmounts
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup function will be called when component unmounts
    return () => {
      // Clear any existing intervals or timeouts
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      {/* Price and Controls Section - Always Visible */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-700">
              {/* Price Display - Keep this visible during loading */}
              <div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`font-bold text-2xl ${
                          todayPrices.percentChange &&
                          todayPrices.percentChange > 0
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-red-600 dark:text-red-500"
                        }`}
                      >
                        $
                        {(isAfterHours
                          ? todayPrices.atClose
                          : todayPrices.regular) &&
                        todayPrices.regular &&
                        todayPrices.regular < 0
                          ? "-"
                          : ""}
                        {Math.abs(
                          (isAfterHours
                            ? todayPrices.atClose
                            : todayPrices.regular) || 0
                        ).toFixed(2)}
                      </span>
                    </div>

                    {todayPrices.percentChange !== null &&
                      todayPrices.priceDifference !== null &&
                      realtimeData?.realtimePrice &&
                      new Date().getHours() < 16 && (
                        <span
                          className={`text-sm font-medium ${
                            todayPrices.percentChange > 0
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {todayPrices.percentChange > 0 ? "▲" : "▼"} $
                          {todayPrices.priceDifference.toFixed(2)} (
                          {todayPrices.percentChange.toFixed(2)}%)
                        </span>
                      )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    As of{" "}
                    {(() => {
                      const estHour = currentTime.getHours();
                      if (estHour >= 16) {
                        return "4:00 PM";
                      }
                      return currentTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "America/New_York",
                        hour12: true,
                      });
                    })()}{" "}
                    EST.{" "}
                    {(() => {
                      const estHour = currentTime.getHours();
                      const estMinutes = currentTime.getMinutes();
                      if (estHour < 9 || (estHour === 9 && estMinutes < 30)) {
                        return "Market Closed";
                      } else if (estHour >= 16) {
                        return "Market Closed";
                      } else {
                        return "Market Open";
                      }
                    })()}
                  </div>
                  {(new Date().getHours() >= 16 ||
                    new Date().getHours() < 9 ||
                    (new Date().getHours() === 9 &&
                      new Date().getMinutes() < 30)) && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                      At close,{" "}
                      {todayPrices.mostRecentDate
                        ? new Date(
                            new Date(todayPrices.mostRecentDate).getTime() +
                              24 * 60 * 60 * 1000
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "MM/DD/YYYY"}{" "}
                      at 4:00pm EST, USD
                      <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
                        <span className="text-xs font-extrabold text-gray-600 dark:text-gray-300">
                          !
                        </span>
                      </div>
                    </span>
                  )}

                  {todayPrices.afterHours &&
                    (new Date().getHours() >= 16 ||
                      new Date().getHours() < 9 ||
                      (new Date().getHours() === 9 &&
                        new Date().getMinutes() < 30) ||
                      true) && (
                      <div className="flex items-center gap-2">
                        <span
                          className={` text-sm text-gray-500 dark:text-gray-400`}
                        >
                          After Hours
                        </span>
                        <span
                          className={` text-sm ${
                            todayPrices.afterHours > (todayPrices.atClose || 0)
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          ${todayPrices.afterHours.toFixed(2)}
                        </span>
                        {todayPrices.regular && (
                          <span
                            className={`text-sm font-medium ${
                              todayPrices.afterHours >
                              (todayPrices.atClose || 0)
                                ? "text-emerald-600 dark:text-emerald-500"
                                : "text-red-600 dark:text-red-500"
                            }`}
                          >
                            $
                            {Math.abs(
                              todayPrices.afterHours -
                                (todayPrices.atClose || 0)
                            ).toFixed(2)}{" "}
                            (
                            {(
                              ((todayPrices.afterHours -
                                (todayPrices.atClose || 0)) /
                                (todayPrices.atClose || 0)) *
                              100
                            ).toFixed(2)}
                            %)
                          </span>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeframe Controls - Always Visible */}
        <div className="w-full xs:w-auto grid grid-cols-5 xs:flex gap-0.5 p-0.5 bg-gray-100/80 dark:bg-slate-800/80 rounded-lg">
          {timeframeButtons.map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                timeframe === tf
                  ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section - Shows Loading State or Chart */}
      <div className="flex-1 min-h-[300px] max-h-[400px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-8 w-8 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 animate-spin" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Loading chart...
              </span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: -22, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="colorUpGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient
                  id="colorDownGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
                className="dark:stroke-gray-700/50"
              />
              <YAxis
                domain={yDomain}
                tickLine={false}
                axisLine={{
                  stroke: "#94a3b8",
                  strokeWidth: 1.5,
                  className: "dark:stroke-gray-600",
                }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                width={65}
                tick={{
                  fontSize: 11,
                  fill: "#64748b",
                  dx: -2,
                }}
                className="text-gray-500 dark:text-gray-400"
                allowDataOverflow={false}
                scale="linear"
                padding={{ top: 20, bottom: 20 }}
                interval="preserveStartEnd"
                tickCount={7}
              />
              <XAxis
                dataKey="date"
                height={40}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const hours = date.getHours();
                  const minutes = date.getMinutes();

                  // Format time more professionally
                  if (timeframe === "1D") {
                    // For 1D view, show hours with AM/PM
                    const ampm = hours >= 12 ? "PM" : "AM";
                    const hour = hours % 12 || 12;
                    const minuteStr = minutes.toString().padStart(2, "0");
                    return `${hour}:${minuteStr} ${ampm}`;
                  } else {
                    // For other timeframes, show date
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }
                }}
                axisLine={{
                  stroke: "#94a3b8",
                  strokeWidth: 1.5,
                  className: "dark:stroke-gray-600",
                }}
                tickLine={false}
                interval="preserveStart"
                minTickGap={50}
                tick={{
                  fontSize: 11,
                  fill: "#64748b",
                  dy: 10,
                }}
                className="text-gray-500 dark:text-gray-400"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as StockData;
                    const date = new Date(data.date);
                    return (
                      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                          {date.toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          <span className="text-gray-500 dark:text-gray-400">
                            {date.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </p>
                        <div
                          className={`space-y-1 ${
                            data.gain
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          <p className="text-sm font-semibold">
                            ${data.close.toFixed(2)}
                          </p>
                          <div className="text-xs space-y-0.5 pt-1 border-t border-gray-100 dark:border-gray-700">
                            <p>O: ${data.open.toFixed(2)}</p>
                            <p>H: ${data.high.toFixed(2)}</p>
                            <p>L: ${data.low.toFixed(2)}</p>
                            <p className="text-gray-500 dark:text-gray-400">
                              Vol: {(data.volume / 1e6).toFixed(2)}M
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {filteredData.length > 0 && (
                <Area
                  type="monotoneX"
                  dataKey="close"
                  stroke={
                    todayPrices.percentChange && todayPrices.percentChange > 0
                      ? "#10b981"
                      : "#ef4444"
                  }
                  strokeWidth={1.5}
                  fill={`url(#${
                    todayPrices.percentChange && todayPrices.percentChange > 0
                      ? "colorUpGradient"
                      : "colorDownGradient"
                  })`}
                  connectNulls={true}
                  isAnimationActive={false}
                  dot={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default React.memo(StockPriceChart);
