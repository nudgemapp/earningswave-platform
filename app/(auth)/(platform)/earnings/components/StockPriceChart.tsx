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
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface StockChartProps {
  symbol: string;
}

interface StockData {
  date: string;
  price: number;
  volume: number;
}

const StockPriceChart: React.FC<StockChartProps> = ({ symbol }) => {
  const [data, setData] = useState<StockData[]>([]);
  const [timeframe, setTimeframe] = useState("1M");
  const [isLoading, setIsLoading] = useState(true);

  const generateMockData = () => {
    const mockData: StockData[] = [];
    const basePrice = 150;
    const baseVolume = 1000000;

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      mockData.push({
        date: date.toISOString().split("T")[0],
        price: basePrice + Math.random() * 20 - 10,
        volume: baseVolume + Math.random() * 500000,
      });
    }

    return mockData;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const mockData = generateMockData();
        setData(mockData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeframe]);

  const timeframeButtons = ["1D", "1W", "1M", "6M", "1Y"];

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
          <p className="font-semibold text-blue-600">
            ${typeof data.price === "number" ? data.price.toFixed(2) : "N/A"}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">Price History</div>
          <div className="flex gap-2">
            {timeframeButtons.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
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

        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString()
                  }
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  opacity={0.1}
                />
                <Tooltip content={CustomTooltip} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#1d4ed8"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockPriceChart;
