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
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface StockChartProps {
  symbol: string;
  timeframe: string;
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
}

interface AlphaVantageDaily {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. volume": string;
}

const StockPriceChart: React.FC<StockChartProps> = ({
  symbol,
  timeframe,
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
        // Use outputsize=full to get more historical data for 6M and 1Y views
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`
        );

        if (!response.ok) throw new Error("Failed to fetch stock data");
        const result = await response.json();

        if (result["Time Series (Daily)"]) {
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
  }, [symbol]);

  // Remove 1D from timeframe buttons since we only have daily data
  const timeframeButtons = ["1W", "1M", "6M", "1Y"];

  const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
    active,
    payload,
  }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload as StockData;
      return (
        <div className="bg-white shadow-lg rounded-lg p-3 border">
          <p className="text-gray-600">
            {new Date(data.date).toLocaleDateString()}
          </p>
          <div className={data.gain ? "text-green-600" : "text-red-600"}>
            <p className="font-medium">Open: ${data.open.toFixed(2)}</p>
            <p className="font-medium">Close: ${data.close.toFixed(2)}</p>
            <p className="font-medium">High: ${data.high.toFixed(2)}</p>
            <p className="font-medium">Low: ${data.low.toFixed(2)}</p>
            <p className="font-medium mt-1">
              Volume: {(data.volume / 1e6).toFixed(2)}M
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const getTimeframeData = () => {
    const currentDate = new Date();
    let startDate = new Date();
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

    // Get the last n trading days
    return data.slice(-tradingDays);
  };

  const filteredData = getTimeframeData();

  // Calculate domain for Y-axis
  const yDomain = filteredData.length > 0 ? [
    Math.min(...filteredData.map(d => d.low)) * 0.99,
    Math.max(...filteredData.map(d => d.high)) * 1.01
  ] : ['auto', 'auto'];

  // Calculate optimal tick interval based on timeframe and data length
  const getTickInterval = () => {
    switch (timeframe) {
      case "1W":
        return 0;  // Show all points
      case "1M":
        return Math.floor(filteredData.length / 5);
      case "6M":
      case "1Y":
        return Math.floor(filteredData.length / 6);
      default:
        return "preserveStartEnd";
    }
  };

  return (
    <div className="h-[300px] w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">Price History</div>
        <div className="flex gap-2">
          {timeframeButtons.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 rounded-md text-sm ${
                timeframe === tf
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              tickLine={false}
              axisLine={false}
              interval={getTickInterval()}
            />
            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip content={CustomTooltip} />
            {filteredData.length > 0 && (
              <Area
                type="monotone"
                dataKey="close"
                stroke={
                  filteredData[filteredData.length - 1].close >
                  filteredData[0].close
                    ? "#22c55e"
                    : "#ef4444"
                }
                fill={`url(#${
                  filteredData[filteredData.length - 1].close >
                  filteredData[0].close
                    ? "colorUpGradient"
                    : "colorDownGradient"
                })`}
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockPriceChart;
