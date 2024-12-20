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
import { StockData } from "@/app/types/StockQuote";
import { useFinnhubTimeseries } from "@/hooks/use-finnhub-timeseries";
// import { useStockWebSocket } from "@/hooks/use-stock-websocket";

interface StockChartProps {
  symbol: string;
}

const StockPriceChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [timeframe, setTimeframe] = useState("1D");

  // const { lastPrice, isConnected } = useStockWebSocket(symbol);
  // console.log("lastPrice", lastPrice);
  // console.log("isConnected", isConnected);

  const { data: timeseriesData, isLoading } = useFinnhubTimeseries(
    symbol,
    timeframe
  );

  // console.log("timeseriesData", timeseriesData);

  const getTimeframeData = (data: StockData[]) => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    const filteredData = data.filter((point: StockData) => {
      const pointDate = new Date(point.date);

      switch (timeframe) {
        case "1D":
          const today = new Date(now);
          today.setHours(0, 0, 0, 0);

          const today4AM = new Date(today);
          today4AM.setHours(4, 0, 0, 0);

          const today8PM = new Date(today);
          today8PM.setHours(20, 0, 0, 0);

          // If current time is before 4AM, show previous day's data
          if (now.getHours() < 4) {
            today4AM.setDate(today4AM.getDate() - 1);
            today8PM.setDate(today8PM.getDate() - 1);
          }

          return pointDate >= today4AM && pointDate <= today8PM;
        case "1W":
          const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
          return pointDate >= oneWeekAgo;
        case "1M":
          const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return pointDate >= oneMonthAgo;
        case "6M":
          const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
          return pointDate >= sixMonthsAgo;
        case "1Y":
          const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          return pointDate >= oneYearAgo;
        default:
          return true;
      }
    });

    // For 1D view, ensure we have boundary points at 4AM and 8PM
    if (timeframe === "1D") {
      const today = new Date(now);
      if (now.getHours() < 4) {
        today.setDate(today.getDate() - 1);
      }

      const start4AM = new Date(today);
      start4AM.setHours(4, 0, 0, 0);

      const end8PM = new Date(today);
      end8PM.setHours(20, 0, 0, 0);

      // Add boundary points if they don't exist
      if (
        !filteredData.find(
          (d) => new Date(d.date).getTime() === start4AM.getTime()
        )
      ) {
        const firstPoint = filteredData[0];
        if (firstPoint) {
          filteredData.unshift({
            ...firstPoint,
            date: start4AM.toISOString(),
            close: firstPoint.close,
          });
        }
      }

      if (
        !filteredData.find(
          (d) => new Date(d.date).getTime() === end8PM.getTime()
        )
      ) {
        const lastPoint = filteredData[filteredData.length - 1];
        if (lastPoint) {
          filteredData.push({
            ...lastPoint,
            date: end8PM.toISOString(),
            close: lastPoint.close,
          });
        }
      }
    }

    return filteredData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const filteredData = useMemo(
    () => (timeseriesData ? getTimeframeData(timeseriesData) : []),
    [timeseriesData, timeframe]
  );

  const [currentTime, setCurrentTime] = useState(new Date());
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

  const timeframeButtons = useMemo(() => ["1D", "1W", "1M", "6M", "1Y"], []);

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

  // Add useEffect for time updates
  useEffect(() => {
    // Update time every second for more accurate display
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Set initial time
    setCurrentTime(new Date());

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
  };

  // Cleanup function will be called when component unmounts
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentTimeout = reconnectTimeout.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

  // Add a new state for current price data
  const [currentPriceData, setCurrentPriceData] = useState<StockData | null>(
    null
  );

  // Add this state at the top of the component with other states
  const [storedAfterHoursData, setStoredAfterHoursData] = useState<{
    price: number | null;
    atClose: number | null;
  } | null>(null);

  // Modify the useEffect
  useEffect(() => {
    if (!timeseriesData?.length) return;

    // Get the most recent regular market data
    const regularMarketData = timeseriesData
      .filter((d) => d.marketSession === "regular")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const mostRecentRegularClose = regularMarketData[0];
    const prevDayClose = regularMarketData[1]?.close;

    // Get after hours from the most recent data point
    const mostRecentData = timeseriesData.reduce((latest, current) => {
      if (!latest) return current;
      return new Date(current.date) > new Date(latest.date) ? current : latest;
    });

    // If this is 1-day view, store the after-hours data
    if (timeframe === "1D" && mostRecentData.marketSession === "post") {
      setStoredAfterHoursData({
        price: mostRecentData.close,
        atClose: mostRecentRegularClose?.close || null,
      });
    }

    setCurrentPriceData(mostRecentData);
    setTodayPrices({
      prevClose: prevDayClose || null,
      preMarket:
        mostRecentData.marketSession === "pre" ? mostRecentData.close : null,
      regular: mostRecentRegularClose?.close || null,
      // Use stored after-hours data if available, otherwise try current data
      afterHours:
        storedAfterHoursData?.price ||
        (mostRecentData.marketSession === "post" ? mostRecentData.close : null),
      regularOpen: regularMarketData[0]?.open || null,
      percentChange: prevDayClose
        ? ((mostRecentData.close - prevDayClose) / prevDayClose) * 100
        : null,
      priceDifference: prevDayClose
        ? mostRecentData.close - prevDayClose
        : null,
      mostRecentDate: mostRecentRegularClose?.date,
      atClose:
        storedAfterHoursData?.atClose || mostRecentRegularClose?.close || null,
    });
  }, [timeseriesData, timeframe, storedAfterHoursData]);

  const TimeframeButton = React.memo(
    ({
      tf,
      active,
      onClick,
    }: {
      tf: string;
      active: boolean;
      onClick: () => void;
    }) => (
      <button
        onClick={onClick}
        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
          active
            ? "bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-500"
            : "text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500"
        }`}
      >
        {tf}
      </button>
    )
  );
  TimeframeButton.displayName = "TimeframeButton";

  // Update the price display section to use currentPriceData
  const PriceDisplay = React.memo(() => (
    <div className="flex items-baseline gap-1">
      <span
        className={`font-bold text-2xl ${
          todayPrices.percentChange && todayPrices.percentChange > 0
            ? "text-emerald-600 dark:text-emerald-500"
            : "text-red-600 dark:text-red-500"
        }`}
      >
        ${currentPriceData?.close.toFixed(2)}
      </span>
      {todayPrices.percentChange !== null && (
        <span
          className={`text-sm font-medium ${
            todayPrices.percentChange > 0
              ? "text-emerald-600 dark:text-emerald-500"
              : "text-red-600 dark:text-red-500"
          }`}
        >
          {todayPrices.percentChange > 0 ? "▲" : "▼"}
          {todayPrices.priceDifference?.toFixed(2)}(
          {todayPrices.percentChange.toFixed(2)}%)
        </span>
      )}
    </div>
  ));
  PriceDisplay.displayName = "PriceDisplay";

  console.log("todayPrices", todayPrices);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-700">
              <div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <PriceDisplay />
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

                  {todayPrices.afterHours && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        After Hours
                      </span>
                      <span
                        className={`text-sm ${
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
                            todayPrices.afterHours > (todayPrices.atClose || 0)
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          $
                          {Math.abs(
                            todayPrices.afterHours - (todayPrices.atClose || 0)
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
      </div>

      <div className="flex-1 min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                vertical={false}
                stroke="#e5e7eb"
                className="dark:stroke-gray-700/30"
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
              <XAxis
                dataKey="date"
                height={40}
                tickFormatter={(value) => {
                  const date = new Date(value);

                  if (timeframe === "1D") {
                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const ampm = hours >= 12 ? "PM" : "AM";
                    const hour = hours % 12 || 12;
                    const minuteStr = minutes.toString().padStart(2, "0");
                    return `${hour}:${minuteStr} ${ampm}`;
                  } else {
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }
                }}
                ticks={
                  timeframe === "1D" && filteredData.length > 0
                    ? (() => {
                        const baseDate = new Date(filteredData[0].date);
                        const date = new Date(
                          baseDate.getFullYear(),
                          baseDate.getMonth(),
                          baseDate.getDate()
                        );

                        return [
                          new Date(date.setHours(4, 0, 0, 0)), // 4:00 AM
                          new Date(date.setHours(9, 30, 0, 0)), // 9:30 AM
                          new Date(date.setHours(12, 0, 0, 0)), // 12:00 PM
                          new Date(date.setHours(16, 0, 0, 0)), // 4:00 PM
                          new Date(date.setHours(20, 0, 0, 0)), // 8:00 PM
                        ].map((d) => d.toISOString());
                      })()
                    : undefined
                }
                axisLine={{
                  stroke: "#94a3b8",
                  strokeWidth: 1.5,
                  className: "dark:stroke-gray-600",
                }}
                tickLine={false}
                interval={timeframe === "1D" ? 0 : "preserveStartEnd"}
                minTickGap={timeframe === "1D" ? 30 : 50}
                tick={{
                  fontSize: 11,
                  fill: "#64748b",
                  dy: 10,
                }}
                className="text-gray-500 dark:text-gray-400"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.[0]) {
                    const data = payload[0].payload as StockData;
                    return (
                      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            ${data.close.toFixed(2)}
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

      <div className="w-full">
        <div className="flex items-center justify-between w-full">
          {timeframeButtons.map((tf) => (
            <TimeframeButton
              key={tf}
              tf={tf}
              active={tf === timeframe}
              onClick={() => handleTimeframeChange(tf)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(StockPriceChart);
