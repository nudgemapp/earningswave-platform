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
import { StockData } from "@/app/types/StockQuote";
import { useFinnhubTimeseries } from "@/hooks/use-finnhub-timeseries";

interface StockChartProps {
  symbol: string;
  timeframe?: string;
  onTimeframeChange: (tf: string) => void;
}

const StockPriceChart: React.FC<StockChartProps> = ({
  symbol,
  timeframe = "1D",
  onTimeframeChange,
}) => {
  const { lastPrice, isConnected } = useStockWebSocket(symbol);
  console.log("lastPrice", lastPrice);
  console.log("isConnected", isConnected);

  const { data: timeseriesData, isLoading } = useFinnhubTimeseries(
    symbol,
    timeframe
  );

  // Define getTimeframeData before using it
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

    return filteredData;
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

  // Use currentTime instead of new Date()
  const isAfterHours = currentTime.getHours() >= 16;

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

  // useEffect(() => {
  //   if (lastPrice && timeseriesData) {
  //     const newDataPoint: StockData = {
  //       date: new Date().toISOString(),
  //       close: lastPrice,
  //       marketSession: "regular",
  //       // ... other required properties
  //     };

  //     // Update the timeseries data with the new price
  //     setTimeseriesData((prev) => [...(prev || []), newDataPoint]);
  //   }
  // }, [lastPrice]);

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
    onTimeframeChange(tf);
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

  // Add a new state for current price data
  const [currentPriceData, setCurrentPriceData] = useState<StockData | null>(
    null
  );

  // Separate useEffect for current price data
  useEffect(() => {
    if (!timeseriesData?.length) return;

    // Get the most recent data point
    const mostRecentData = timeseriesData.reduce((latest, current) => {
      if (!latest) return current;
      return new Date(current.date) > new Date(latest.date) ? current : latest;
    });

    // Get today's data for pre/post market
    const today = new Date();
    const todayData = timeseriesData.filter(
      (d) => new Date(d.date).toDateString() === today.toDateString()
    );

    const regularMarketData = todayData.filter(
      (d) => d.marketSession === "regular"
    );
    const preMarketData = todayData.filter((d) => d.marketSession === "pre");
    const afterHoursData = todayData.filter((d) => d.marketSession === "post");

    // Find previous day's close
    const prevDayClose = timeseriesData.find(
      (d) =>
        new Date(d.date).toDateString() ===
          new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString() &&
        d.marketSession === "regular"
    )?.close;

    setCurrentPriceData(mostRecentData);
    setTodayPrices({
      prevClose: prevDayClose || null,
      preMarket: preMarketData[preMarketData.length - 1]?.close || null,
      regular: regularMarketData[regularMarketData.length - 1]?.close || null,
      afterHours: afterHoursData[afterHoursData.length - 1]?.close || null,
      regularOpen: regularMarketData[0]?.open || null,
      percentChange: prevDayClose
        ? ((mostRecentData.close - prevDayClose) / prevDayClose) * 100
        : null,
      priceDifference: prevDayClose
        ? mostRecentData.close - prevDayClose
        : null,
      mostRecentDate: mostRecentData.date,
      atClose: regularMarketData[regularMarketData.length - 1]?.close || null,
    });
  }, [timeseriesData]); // Remove timeframe dependency

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
        className={`flex-1 text-xs font-medium px-3 py-[5px] rounded-[3px] transition-all duration-200 ${
          active
            ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/50 dark:ring-slate-600/50"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
        }`}
      >
        {tf}
      </button>
    )
  );

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

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-2">
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
        <div className="w-full">
          <div className="flex items-center bg-gray-50/80 dark:bg-slate-800/80 rounded-md p-[2px] shadow-sm">
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

      <div className="flex-1 min-h-[300px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 0, right: 8, left: -20, bottom: 0 }}
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
                  const hours = date.getHours();
                  const minutes = date.getMinutes();

                  if (timeframe === "1D") {
                    // For 1D view, show hours with AM/PM
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
    </div>
  );
};

export default React.memo(StockPriceChart);
