"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
  marketSession?: "pre" | "regular" | "post";
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

const StockPriceChart: React.FC<StockChartProps> = ({
  symbol,
  timeframe = "1D",
  onTimeframeChange,
}) => {
  const [data, setData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;

      try {
        setIsLoading(true);
        const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;

        const endpoint =
          timeframe === "1D"
            ? `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&extended_hours=true&apikey=${API_KEY}`
            : `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch stock data");
        const result = await response.json();

        if (timeframe === "1D" && result["Time Series (5min)"]) {
          // const estDate = new Date().toLocaleString("en-US", {
          //   timeZone: "America/New_York",
          // });
          // const today = new Date(estDate).toISOString().split("T")[0];

          const transformedData = Object.entries(result["Time Series (5min)"])
            .map(([date, values]) => {
              const typedValues = values as AlphaVantageIntraday;
              const open = parseFloat(typedValues["1. open"]);
              const close = parseFloat(typedValues["4. close"]);
              return {
                date,
                open,
                close,
                high: parseFloat(typedValues["2. high"]),
                low: parseFloat(typedValues["3. low"]),
                volume: parseFloat(typedValues["5. volume"]),
                gain: close > open,
              };
            })
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .filter((item) => {
              const itemDate = new Date(item.date);
              const hours = itemDate.getHours();
              const minutes = itemDate.getMinutes();
              const timeInMinutes = hours * 60 + minutes;
              return timeInMinutes >= 4 * 60 && timeInMinutes <= 20 * 60;
            });

          setData(transformedData);
        } else if (result["Time Series (Daily)"]) {
          const transformedData = Object.entries(result["Time Series (Daily)"])
            .map(([date, values]) => {
              const typedValues = values as AlphaVantageDaily;
              const open = parseFloat(typedValues["1. open"]);
              const close = parseFloat(typedValues["4. close"]);
              return {
                date,
                open,
                close,
                high: parseFloat(typedValues["2. high"]),
                low: parseFloat(typedValues["3. low"]),
                volume: parseFloat(typedValues["5. volume"]),
                gain: close > open,
              };
            })
            .reverse();

          setData(transformedData);
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

  const timeframeButtons = ["1D", "1W", "1M", "6M", "1Y"];

  const getTimeframeData = () => {
    if (timeframe === "1D") {
      return data;
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

  // Calculate domain for Y-axis
  const yDomain =
    filteredData.length > 0
      ? [
          Math.min(...filteredData.map((d) => d.low)) * 0.99,
          Math.max(...filteredData.map((d) => d.high)) * 1.01,
        ]
      : ["auto", "auto"];

  // Calculate optimal tick interval based on timeframe and data length
  const getTickInterval = () => {
    switch (timeframe) {
      case "1D":
        return Math.floor(filteredData.length / 6); // Show ~6 time labels
      case "1W":
        return 0;
      case "1M":
        return Math.floor(filteredData.length / 5);
      case "6M":
      case "1Y":
        return Math.floor(filteredData.length / 6);
      default:
        return "preserveStartEnd";
    }
  };

  const getMarketSession = (date: Date): "pre" | "regular" | "post" => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    if (timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30) {
      return "pre";
    } else if (timeInMinutes >= 9 * 60 + 30 && timeInMinutes < 16 * 60) {
      return "regular";
    } else if (timeInMinutes >= 16 * 60 && timeInMinutes <= 20 * 60) {
      return "post";
    }
    return "post"; // Default for any other time
  };

  return (
    <div className="h-full w-full">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-4">
        <div className="flex items-center gap-2">
          {/* <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Price History
          </h3> */}
          {!isLoading && filteredData.length > 0 && (
            <div className="flex items-center gap-6">
              {timeframe === "1D" && (
                <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-700">
                  {/* Pre-market price */}
                  <div className="pr-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        Pre-Market
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          $
                          {filteredData
                            .find((d) => {
                              const date = new Date(d.date);
                              return getMarketSession(date) === "pre";
                            })
                            ?.close.toFixed(2) || "-"}
                        </span>
                        {/* Show change from previous close if available */}
                        {/* <span className="text-xs text-emerald-600">+1.23%</span> */}
                      </div>
                    </div>
                  </div>

                  {/* Regular Market Price */}
                  <div className="px-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        Regular Market
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-base font-bold ${
                            filteredData[filteredData.length - 1].close >
                            filteredData[0].close
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          $
                          {filteredData[filteredData.length - 1].close.toFixed(
                            2
                          )}
                        </span>
                        <span
                          className={`text-xs font-medium ${
                            filteredData[filteredData.length - 1].close >
                            filteredData[0].close
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {(
                            ((filteredData[filteredData.length - 1].close -
                              filteredData[0].close) /
                              filteredData[0].close) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post-market price */}
                  <div className="pl-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        After Hours
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          $
                          {filteredData
                            .findLast((d) => {
                              const date = new Date(d.date);
                              return getMarketSession(date) === "post";
                            })
                            ?.close.toFixed(2) || "-"}
                        </span>
                        {/* Show change from regular close if available */}
                        {/* <span className="text-xs text-red-600">-0.45%</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
              <XAxis
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
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as StockData;
                    return (
                      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                          {new Date(data.date).toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <div
                          className={`space-y-1 ${
                            data.gain
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          <p className="text-sm font-semibold">
                            Close: ${data.close.toFixed(2)}
                          </p>
                          <div className="text-xs space-y-0.5 pt-1 border-t border-gray-100 dark:border-gray-700">
                            <p>Open: ${data.open.toFixed(2)}</p>
                            <p>High: ${data.high.toFixed(2)}</p>
                            <p>Low: ${data.low.toFixed(2)}</p>
                            <p className="text-gray-500 dark:text-gray-400 pt-1">
                              Volume: {(data.volume / 1e6).toFixed(2)}M
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
                  stroke={
                    filteredData[filteredData.length - 1].close >
                    filteredData[0].close
                      ? "#10b981"
                      : "#ef4444"
                  }
                  strokeWidth={1.5}
                  fill={`url(#${
                    filteredData[filteredData.length - 1].close >
                    filteredData[0].close
                      ? "colorUpGradient"
                      : "colorDownGradient"
                  })`}
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
