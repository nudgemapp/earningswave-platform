"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useStockWebSocket } from "@/hooks/use-stock-websocket";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface StockChartProps {
  symbol: string;
  timeframe?: string;
  onTimeframeChange: (tf: string) => void;
}

interface StockData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  gain: boolean;
  marketSession: "pre" | "regular" | "post";
}

interface AlphaVantageDaily {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

interface AlphaVantageIntraday {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

interface RealtimeStockData {
  realtimePrice: number;
  lastUpdate: string;
  data: StockData[];
}

const LiveIndicator = () => (
  <div className="flex items-center gap-1.5">
    <div className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
    </div>
    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
      LIVE
    </span>
  </div>
);

const StockPriceChart: React.FC<StockChartProps> = ({
  symbol,
  timeframe = "1D",
  onTimeframeChange,
}) => {
  const queryClient = useQueryClient();
  const { isConnected, error } = useStockWebSocket(symbol);

  console.log(timeframe);
  console.log(symbol);
  console.log(isConnected);
  console.log(error);

  // Get real-time data from React Query cache
  const realtimeData = queryClient.getQueryData<RealtimeStockData>([
    "stockPrice",
    symbol,
  ]);

  console.log(realtimeData);

  const [data, setData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayPrices, setTodayPrices] = useState<{
    preMarket: number | null;
    regular: number | null;
    afterHours: number | null;
    regularOpen: number | null;
    percentChange: number | null;
  }>({
    preMarket: null,
    regular: null,
    afterHours: null,
    regularOpen: null,
    percentChange: null,
  });

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;

      try {
        setIsLoading(true);
        const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;

        const endpoint =
          timeframe === "1D"
            ? `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&extended_hours=true&entitlement=delayed&apikey=${API_KEY}`
            : `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&entitlement=delayed&apikey=${API_KEY}`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch stock data");
        const result = await response.json();

        if (timeframe === "1D" && result["Time Series (5min)"]) {
          const entries = Object.entries(result["Time Series (5min)"]);
          const mostRecentDate = entries[0][0].split(" ")[0];

          const transformedData = entries
            .map(([date, values]): StockData | null => {
              const typedValues = values as AlphaVantageIntraday;
              const dateStr = date.split(" ")[0];

              if (dateStr !== mostRecentDate) return null;

              const dateObj = new Date(date);
              const open = parseFloat(typedValues["1. open"]);
              const close = parseFloat(typedValues["4. close"]);
              const hours = dateObj.getHours();
              const minutes = dateObj.getMinutes();
              const timeInMinutes = hours * 60 + minutes;

              let marketSession: StockData["marketSession"] = "regular";

              if (timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30) {
                marketSession = "pre";
              } else if (
                timeInMinutes >= 9 * 60 + 30 &&
                timeInMinutes < 16 * 60
              ) {
                marketSession = "regular";
              } else if (timeInMinutes >= 16 * 60 && timeInMinutes <= 20 * 60) {
                marketSession = "post";
              }

              return {
                date,
                open,
                close,
                high: parseFloat(typedValues["2. high"]),
                low: parseFloat(typedValues["3. low"]),
                volume: parseFloat(typedValues["5. volume"]),
                gain: close > open,
                marketSession,
              };
            })
            .filter((item): item is StockData => item !== null)
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );

          setData(transformedData);
        } else if (result["Time Series (Daily)"]) {
          const entries = Object.entries(result["Time Series (Daily)"]);
          const transformedData: StockData[] = entries
            .map(([date, values]) => {
              const typedValues = values as AlphaVantageDaily;
              const open = parseFloat(typedValues["1. open"]);
              const close = parseFloat(typedValues["4. close"]);
              const high = parseFloat(typedValues["2. high"]);
              const low = parseFloat(typedValues["3. low"]);

              let marketSession: StockData["marketSession"] = "regular";

              if (open < low) {
                marketSession = "pre";
              } else if (close > high) {
                marketSession = "post";
              }

              return {
                date,
                open,
                close,
                high,
                low,
                volume: parseFloat(typedValues["5. volume"]),
                gain: close > open,
                marketSession,
              };
            })
            .reverse();

          const dataPoints = getTimeframeDataPoints(timeframe);
          setData(transformedData.slice(-dataPoints));
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, timeframe]);

  useEffect(() => {
    const fetchTodayPrices = async () => {
      if (!symbol) return;

      try {
        const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;
        const endpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&extended_hours=true&entitlement=delayed&apikey=${API_KEY}`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch today's prices");
        const result = await response.json();

        if (result["Time Series (5min)"]) {
          const entries = Object.entries(result["Time Series (5min)"]);
          const mostRecentDate = entries[0][0].split(" ")[0];

          let preMarketPrice = null;
          let regularPrice = null;
          let afterHoursPrice = null;
          let regularOpenPrice = null;
          let latestPrice = null;

          // Process entries for the most recent day only
          const todayEntries = entries.filter(
            ([date]) => date.split(" ")[0] === mostRecentDate
          );

          // Get the latest price first
          if (todayEntries.length > 0) {
            const [, latestValues] = todayEntries[0];
            latestPrice = parseFloat(
              (latestValues as AlphaVantageIntraday)["4. close"]
            );
          }

          for (const [date, values] of todayEntries) {
            const typedValues = values as AlphaVantageIntraday;
            const dateObj = new Date(date);
            const hours = dateObj.getHours();
            const minutes = dateObj.getMinutes();
            const timeInMinutes = hours * 60 + minutes;
            const close = parseFloat(typedValues["4. close"]);

            // Pre-market (4:00 AM - 9:30 AM ET)
            if (timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30) {
              if (!preMarketPrice) preMarketPrice = close;
            }
            // Regular market (9:30 AM - 4:00 PM ET)
            else if (timeInMinutes >= 9 * 60 + 30 && timeInMinutes < 16 * 60) {
              regularPrice = close;
              if (!regularOpenPrice) {
                regularOpenPrice = parseFloat(typedValues["1. open"]);
              }
            }
            // After-hours (4:00 PM - 8:00 PM ET)
            else if (timeInMinutes >= 16 * 60 && timeInMinutes <= 20 * 60) {
              afterHoursPrice = close;
            }
          }

          // Calculate percent change using the latest regular market price
          const percentChange =
            regularOpenPrice && regularPrice
              ? ((regularPrice - regularOpenPrice) / regularOpenPrice) * 100
              : null;

          setTodayPrices({
            preMarket: preMarketPrice,
            regular: latestPrice, // Use the latest price here
            afterHours: afterHoursPrice,
            regularOpen: regularOpenPrice,
            percentChange,
          });
        }
      } catch (error) {
        console.error("Error fetching today's prices:", error);
      }
    };

    fetchTodayPrices();
  }, [symbol]);

  const timeframeButtons = ["1D", "1W", "1M", "6M", "1Y"];

  const getTimeframeData = () => {
    if (timeframe === "1D") {
      // Create a full day timeline from 4:00 AM to 8:00 PM
      const today = new Date();
      today.setHours(4, 0, 0, 0); // Start at 4 AM
      const endTime = new Date(today);
      endTime.setHours(20, 0, 0, 0); // End at 8 PM

      // Create baseline data points every 5 minutes
      const baselineData: StockData[] = [];
      const currentTime = new Date();

      for (
        let time = new Date(today);
        time <= endTime;
        time.setMinutes(time.getMinutes() + 5)
      ) {
        let marketSession: StockData["marketSession"] = "regular";
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const timeInMinutes = hours * 60 + minutes;

        if (timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30) {
          marketSession = "pre";
        } else if (timeInMinutes >= 9 * 60 + 30 && timeInMinutes < 16 * 60) {
          marketSession = "regular";
        } else if (timeInMinutes >= 16 * 60 && timeInMinutes <= 20 * 60) {
          marketSession = "post";
        }

        // For times after current time, set close to null instead of 0
        const isAfterCurrentTime = time > currentTime;
        baselineData.push({
          date: time.toISOString(),
          open: isAfterCurrentTime ? null : 0,
          close: isAfterCurrentTime ? null : 0,
          high: isAfterCurrentTime ? null : 0,
          low: isAfterCurrentTime ? null : 0,
          volume: 0,
          gain: false,
          marketSession,
        });
      }

      // Merge realtime data with baseline
      if (realtimeData?.data) {
        const realtimeMap = new Map(
          realtimeData.data.map((item) => [item.date, item])
        );

        let lastPrice: number = realtimeData.data[0]?.close || 0;

        baselineData.forEach((point, index) => {
          const pointTime = new Date(point.date);
          if (pointTime <= currentTime) {
            const realtimePoint = realtimeMap.get(point.date);
            if (realtimePoint) {
              baselineData[index] = realtimePoint;
              lastPrice = realtimePoint.close;
            } else {
              baselineData[index] = {
                ...point,
                open: lastPrice,
                close: lastPrice,
                high: lastPrice,
                low: lastPrice,
                gain: lastPrice > (baselineData[index - 1]?.close || 0),
              };
            }
          }
        });

        // Update the last known price point with realtime price
        if (realtimeData.realtimePrice) {
          const lastValidIndex =
            baselineData.findIndex(
              (point) => new Date(point.date) > currentTime
            ) - 1;

          if (lastValidIndex >= 0) {
            baselineData[lastValidIndex].close = realtimeData.realtimePrice;
            baselineData[lastValidIndex].gain =
              realtimeData.realtimePrice > baselineData[lastValidIndex].open;
          }
        }
      }

      return baselineData;
    }

    let tradingDays = 0;

    switch (timeframe) {
      case "1W":
        tradingDays = 5; // Approximately 5 trading days in a week
        break;
      case "1M":
        tradingDays = 21; // Approximately 21 trading days in a month
        break;
      case "6M":
        tradingDays = 126; // Approximately 126 trading days in 6 months
        break;
      case "1Y":
        tradingDays = 252; // Approximately 252 trading days in a year
        break;
      default:
        tradingDays = 21; // Default to 1M
    }

    return data.slice(-tradingDays);
  };

  const filteredData = getTimeframeData();

  // Calculate domain for Y-axis using realtime data for 1D view
  const yDomain = useMemo(() => {
    if (timeframe === "1D" && realtimeData?.data.length) {
      const prices = realtimeData.data.map((d) => d.close);
      return [Math.min(...prices) * 0.999, Math.max(...prices) * 1.001];
    }

    return filteredData.length > 0
      ? [
          Math.min(...filteredData.map((d) => d.low)) * 0.99,
          Math.max(...filteredData.map((d) => d.high)) * 1.01,
        ]
      : ["auto", "auto"];
  }, [filteredData, timeframe, realtimeData]);

  // Calculate optimal tick interval based on timeframe and data length
  // const getTickInterval = () => {
  //   switch (timeframe) {
  //     case "1D":
  //       return Math.floor(filteredData.length / 6); // Show ~6 time labels
  //     case "1W":
  //       return 0;
  //     case "1M":
  //       return Math.floor(filteredData.length / 5);
  //     case "6M":
  //     case "1Y":
  //       return Math.floor(filteredData.length / 6);
  //     default:
  //       return "preserveStartEnd";
  //   }
  // };

  const getTimeframeDataPoints = (tf: string): number => {
    switch (tf) {
      case "1W":
        return 5; // 5 trading days
      case "1M":
        return 21; // ~
      case "6M":
        return 126; // ~
      case "1Y":
        return 252; // ~
      default:
        return 21; // Default to 1M
    }
  };

  // You can show connection status if needed
  useEffect(() => {
    if (error) {
      console.error("WebSocket error:", error);
      // Handle error (show toast, etc.)
    }
  }, [error]);

  // Update todayPrices based on realtime data
  useEffect(() => {
    if (realtimeData) {
      const latestData = realtimeData.data[realtimeData.data.length - 1];
      if (!latestData) return;

      const preMarketData = realtimeData.data.find(
        (d) => d.marketSession === "pre"
      );
      const regularMarketData = realtimeData.data.find(
        (d) => d.marketSession === "regular"
      );
      const afterHoursData = realtimeData.data.find(
        (d) => d.marketSession === "post"
      );

      setTodayPrices({
        preMarket: preMarketData?.close ?? null,
        regular: regularMarketData?.close ?? realtimeData.realtimePrice,
        afterHours: afterHoursData?.close ?? null,
        regularOpen: regularMarketData?.open ?? null,
        percentChange: regularMarketData?.open
          ? ((realtimeData.realtimePrice - regularMarketData.open) /
              regularMarketData.open) *
            100
          : null,
      });
    }
  }, [realtimeData]);

  // Update the Area component to use different colors based on price movement
  const priceChange = useMemo(() => {
    if (timeframe === "1D" && realtimeData?.data.length) {
      const firstPrice = realtimeData.data[0]?.close;
      const lastPrice = realtimeData.realtimePrice;
      return lastPrice - firstPrice;
    }
    return 0;
  }, [realtimeData, timeframe]);

  // Update the regular market price display
  useEffect(() => {
    if (realtimeData?.realtimePrice) {
      setTodayPrices((prev) => ({
        ...prev,
        regular: realtimeData.realtimePrice,
        percentChange: prev.regularOpen
          ? ((realtimeData.realtimePrice - prev.regularOpen) /
              prev.regularOpen) *
            100
          : null,
      }));
    }
  }, [realtimeData?.realtimePrice]);

  return (
    <div className="h-full w-full">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-4">
        <div className="flex items-center gap-2">
          {!isLoading && (
            <div className="flex items-center gap-6">
              <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-700">
                {/* Price Display Section */}
                <div className="pr-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Pre-Market
                      </span>
                      {timeframe === "1D" && <LiveIndicator />}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          timeframe === "1D"
                            ? "transition-colors duration-150"
                            : "",
                          todayPrices.preMarket !== null
                            ? todayPrices.preMarket >
                              (todayPrices.regularOpen ?? 0)
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                            : "text-gray-700 dark:text-gray-200"
                        )}
                      >
                        ${todayPrices.preMarket?.toFixed(2) || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Regular Market Price with enhanced styling */}
                <div className="px-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Regular Market
                      </span>
                      {timeframe === "1D" && <LiveIndicator />}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className={cn(
                          "text-base font-bold transition-all duration-150",
                          timeframe === "1D" && "animate-price-update",
                          todayPrices.percentChange &&
                            todayPrices.percentChange > 0
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-red-600 dark:text-red-500"
                        )}
                      >
                        ${todayPrices.regular?.toFixed(2) || "-"}
                      </span>
                      {todayPrices.percentChange && (
                        <span
                          className={`text-xs font-medium ${
                            todayPrices.percentChange > 0
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {todayPrices.percentChange.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* After-hours price */}
                <div className="pl-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                      After Hours
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        ${todayPrices.afterHours?.toFixed(2) || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Currency indicator */}
              <div className="flex items-center">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                  USD
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="w-full xs:w-auto grid grid-cols-5 xs:flex gap-0.5 p-0.5 bg-gray-100/80 dark:bg-slate-800/80 rounded-lg">
          {timeframeButtons.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-1.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${
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

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100%-40px)]">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 animate-spin" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Loading data...
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-[calc(100%-40px)]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
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
                className="dark:stroke-gray-700"
              />
              <YAxis
                domain={yDomain}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                width={65}
                tick={{ fontSize: 11 }}
                dx={-5}
                className="text-gray-500 dark:text-gray-400"
              />
              {/* <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (timeframe === "1D") {
                    return date.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }
                  return timeframe === "1W"
                    ? date.toLocaleDateString(undefined, { weekday: "short" })
                    : date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      });
                }}
                tickLine={false}
                axisLine={false}
                interval={getTickInterval()}
                height={30}
                tick={{ fontSize: 11 }}
                dy={10}
                className="text-gray-500 dark:text-gray-400"
              /> */}
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
                  type="monotone"
                  dataKey="close"
                  stroke={priceChange >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth={1.5}
                  fill={`url(#${
                    priceChange >= 0 ? "colorUpGradient" : "colorDownGradient"
                  })`}
                  connectNulls={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StockPriceChart;
