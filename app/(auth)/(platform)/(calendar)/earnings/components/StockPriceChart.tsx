"use client";

import React, { useMemo } from "react";
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
import { useTimeframeStore } from "@/store/TimeframeStore";

interface StockChartProps {
  symbol: string;
}

const StockPriceChart: React.FC<StockChartProps> = ({ symbol }) => {
  const timeframe = useTimeframeStore((state) => state.timeframe);
  const { data: timeseriesData, isLoading } = useFinnhubTimeseries(
    symbol,
    timeframe
  );

  const getTimeframeData = (data: StockData[]) => {
    if (!data || data.length === 0) return [];

    const now = new Date();
    return data
      .filter((point: StockData) => {
        const pointDate = new Date(point.date);

        switch (timeframe) {
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
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const filteredData = useMemo(
    () => (timeseriesData ? getTimeframeData(timeseriesData) : []),
    [timeseriesData, timeframe]
  );

  const yDomain = useMemo(() => {
    if (filteredData.length === 0) return ["auto", "auto"];

    const prices = filteredData.map((d) => d.close);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;

    return [
      Math.floor((min - padding) * 100) / 100,
      Math.ceil((max + padding) * 100) / 100,
    ];
  }, [filteredData]);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-gray-50/50 dark:bg-slate-800/50 rounded-lg">
        <AreaChart
          data={[{ value: 0 }, { value: 100 }]}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="2 4"
            vertical={false}
            stroke="#e5e7eb"
            className="dark:stroke-gray-700/30"
          />
          <YAxis hide domain={[0, 100]} />
          <XAxis hide dataKey="value" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="transparent"
            fill="transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          </div>
        </AreaChart>
      </div>
    );
  }

  const isPositive =
    filteredData.length > 1 &&
    filteredData[filteredData.length - 1].close > filteredData[0].close;

  return (
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
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
          height={40}
          tick={{
            fontSize: 11,
            fill: "#64748b",
            dy: 10,
          }}
          minTickGap={50}
          interval="preserveStartEnd"
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
        <Area
          type="monotoneX"
          dataKey="close"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth={1.5}
          fill={`url(#${isPositive ? "colorUpGradient" : "colorDownGradient"})`}
          connectNulls={true}
          isAnimationActive={false}
          dot={false}
        />
        <defs>
          <linearGradient id="colorUpGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDownGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default React.memo(StockPriceChart);
