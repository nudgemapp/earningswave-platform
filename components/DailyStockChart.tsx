"use client";

import React, { useMemo, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  YAxis,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { StockData } from "@/app/types/StockQuote";
import { useFinnhubTimeseries } from "@/hooks/use-finnhub-timeseries";

interface DailyStockChartProps {
  symbol: string;
}

const DailyStockChart: React.FC<DailyStockChartProps> = ({ symbol }) => {
  const { data: timeseriesData, isLoading } = useFinnhubTimeseries(
    symbol,
    "1D"
  );

  // Create fixed time labels for x-axis
  const fixedTimeLabels = useMemo(() => {
    const labels = [];
    const today = new Date();
    const start = new Date(today);
    start.setHours(4, 0, 0, 0);

    for (let hour = 4; hour <= 20; hour += 2) {
      const time = new Date(today);
      time.setHours(hour, 0, 0, 0);
      labels.push(time.toISOString());
    }
    return labels;
  }, []);

  const { processedData, marketStats, fullDayData } = useMemo(() => {
    // Generate full day timeline with empty values
    const generateFullDayData = () => {
      const data = [];
      const today = new Date();
      const start = new Date(today);
      start.setHours(4, 0, 0, 0);
      const end = new Date(today);
      end.setHours(20, 0, 0, 0);

      for (
        let time = new Date(start);
        time <= end;
        time.setMinutes(time.getMinutes() + 1)
      ) {
        data.push({
          date: time.toISOString(),
          close: null,
          volume: 0,
        });
      }
      return data;
    };

    if (!timeseriesData?.length) {
      return {
        processedData: [],
        marketStats: null,
        fullDayData: generateFullDayData(),
      };
    }

    const now = new Date();
    const today = new Date(now);
    const start4AM = new Date(today);
    start4AM.setHours(4, 0, 0, 0);

    // Filter and sort data up to current time only
    const processed = timeseriesData
      .filter((point: StockData) => {
        const pointDate = new Date(point.date);
        return pointDate >= start4AM && pointDate <= now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Create a map of existing data points
    const dataMap = new Map(processed.map((point) => [point.date, point]));

    // Merge existing data with full day timeline
    const fullDay = generateFullDayData().map((point) => ({
      ...point,
      ...(dataMap.get(point.date) || {}),
    }));

    // Calculate market stats
    const currentPrice = processed[processed.length - 1]?.close;
    const openPrice = processed[0]?.close;
    const priceDiff = currentPrice - openPrice;
    const percentChange = (priceDiff / openPrice) * 100;

    return {
      processedData: processed,
      fullDayData: fullDay,
      marketStats: currentPrice
        ? {
            currentPrice,
            priceDiff,
            percentChange,
            isPositive: priceDiff >= 0,
            mostRecentDate: processed[processed.length - 1].date,
          }
        : null,
    };
  }, [timeseriesData]);

  const yDomain = useMemo(() => {
    if (!processedData.length) return ["auto", "auto"];

    const prices = processedData.map((d) => d.close);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;

    return [
      Math.floor((min - padding) * 100) / 100,
      Math.ceil((max + padding) * 100) / 100,
    ];
  }, [processedData]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    setCurrentTime(new Date());
    return () => clearInterval(timer);
  }, []);

  const isMarketClosed =
    currentTime.getHours() >= 16 ||
    currentTime.getHours() < 9 ||
    (currentTime.getHours() === 9 && currentTime.getMinutes() < 30);

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {marketStats && (
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-700">
                <div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-bold ${
                          marketStats.isPositive
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-red-600 dark:text-red-500"
                        }`}
                      >
                        ${marketStats.currentPrice.toFixed(2)}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          marketStats.isPositive
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-red-600 dark:text-red-500"
                        }`}
                      >
                        {marketStats.isPositive ? "▲" : "▼"}$
                        {Math.abs(marketStats.priceDiff).toFixed(2)} (
                        {marketStats.percentChange.toFixed(2)}%)
                      </span>
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
                    {isMarketClosed && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        At close,{" "}
                        {marketStats.mostRecentDate
                          ? new Date(
                              new Date(marketStats.mostRecentDate).getTime() +
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={fullDayData}
              margin={{ top: 0, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                vertical={false}
                stroke="#e5e7eb"
                className="dark:stroke-gray-700/30"
              />
              <XAxis
                dataKey="date"
                ticks={fixedTimeLabels}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });
                }}
                type="category"
                tick={{ fontSize: 11, fill: "#64748b" }}
                height={40}
                dy={10}
                scale="band"
                padding={{ left: 0, right: 0 }}
                interval={0}
                minTickGap={0}
                axisLine={{ stroke: "#94a3b8", strokeWidth: 1.5 }}
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
                  fontSize: 10,
                  fill: "#94a3b8",
                }}
                className="text-gray-400"
                allowDataOverflow={false}
                scale="linear"
                padding={{ top: 20, bottom: 20 }}
                interval="preserveStartEnd"
                tickCount={7}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.[0]) {
                    const data = payload[0].payload as StockData;
                    return (
                      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            ${data.close?.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(data.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={marketStats?.isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={marketStats?.isPositive ? "#10b981" : "#ef4444"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotoneX"
                dataKey="close"
                stroke={marketStats?.isPositive ? "#10b981" : "#ef4444"}
                fill="url(#colorGradient)"
                strokeWidth={1.5}
                isAnimationActive={false}
                connectNulls={true}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default React.memo(DailyStockChart);
