"use client";

import React, { useState, useEffect } from "react";
import { useFinnhubTimeseries } from "@/hooks/use-finnhub-timeseries";
import { useTimeframeStore } from "@/store/TimeframeStore";
import { Skeleton } from "@/components/ui/skeleton";

interface StockPriceHeaderProps {
  symbol: string;
}

const StockPriceHeader: React.FC<StockPriceHeaderProps> = ({ symbol }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const timeframe = useTimeframeStore((state) => state.timeframe);
  const { data: timeseriesData, isLoading } = useFinnhubTimeseries(
    symbol,
    timeframe
  );

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

  // Calculate market stats from timeseriesData
  const marketStats = React.useMemo(() => {
    if (!timeseriesData?.length) return null;

    const currentPrice = timeseriesData[timeseriesData.length - 1]?.close;
    const openPrice = timeseriesData[0]?.close;
    const priceDiff = currentPrice - openPrice;
    const percentChange = (priceDiff / openPrice) * 100;

    return {
      currentPrice,
      priceDiff,
      percentChange,
      isPositive: priceDiff >= 0,
      mostRecentDate: timeseriesData[timeseriesData.length - 1].date,
    };
  }, [timeseriesData]);

  if (isLoading || !marketStats) {
    return (
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-6">
            <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-700">
              <div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-48 mt-1" />
                  <Skeleton className="h-5 w-64 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default React.memo(StockPriceHeader);
