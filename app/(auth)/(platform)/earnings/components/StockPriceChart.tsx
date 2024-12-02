"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  c: number[];  // close prices
  h: number[];  // high prices
  l: number[];  // low prices
  o: number[];  // open prices
  s: string;    // status
  t: number[];  // timestamps
  v: number[];  // volume
}



const StockPriceChart: React.FC<StockChartProps> = ({
  symbol,
  timeframe = "1D",
  onTimeframeChange,
  todayData,
}) => {
  const websocketConnection = useStockWebSocket(symbol);
  const { error } = useMemo(() => websocketConnection, [websocketConnection]);

  const { data: realtimeData } = useQuery<RealtimeStockData>({
    queryKey: ["stockPrice", symbol],
    enabled: !!symbol,
    staleTime: Infinity,
  });

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
    const dateString = date.toISOString().split('T')[0];
    return MARKET_HOLIDAYS.some(holiday => holiday.date === dateString && holiday.closed);
  };

  const adjustToMarketDay = (date: Date): Date => {
    const adjustedDate = new Date(date);
    while (adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6 || isMarketHoliday(adjustedDate)) {
      adjustedDate.setDate(adjustedDate.getDate() - 1);
    }
    return adjustedDate;
  };




  const fetchTodayPrices = async () => {
    if (!symbol) return;

    try {
      const data = await fetch(`/api/companies/recentPrice?symbol=${symbol}`).then((res: Response) => res.json() as Promise<StockQuote>);
      const todayDate = new Date();
      const adjustedDate = adjustToMarketDay(todayDate);

      // Convert to string in YYYY-MM-DD format
      const todayDateString = adjustedDate.toISOString().split('T')[0];

      const preMarketPrice = null;
      const afterHoursPrice = null;

      // Check if current time is after hours, weekend, or holiday
      const isAfterMarketHours = new Date().getHours() >= 16;
      const isWeekend = adjustedDate.getDay() === 0 || adjustedDate.getDay() === 6;
      const isHoliday = isMarketHoliday(adjustedDate);
      const isMarketClosed = isAfterMarketHours || isWeekend || isHoliday;

      todayData({
        preMarket: preMarketPrice,
        regular: data.c,
        atClose: isMarketClosed ? data.c : null,
        afterHours: afterHoursPrice,
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
      console.log('No data received in getTimeframeData');
      return [];
    }

    const now = new Date();
    const filteredData = data.filter((point: StockData) => {
      const pointDate = new Date(point.date);

      switch (timeframe) {
        case '1D':
          return pointDate.getDate() === now.getDate() &&
            pointDate.getMonth() === now.getMonth() &&
            pointDate.getFullYear() === now.getFullYear();

        case '1W':
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          return pointDate >= oneWeekAgo;

        case '1M':
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return pointDate >= oneMonthAgo;

        case '6M':
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          return pointDate >= sixMonthsAgo;

        case '1Y':
          const oneYearAgo = new Date(now);
          oneYearAgo.setFullYear(now.getFullYear() - 1);
          return pointDate >= oneYearAgo;

        default:
          return true;
      }
    });
    console.log('filteredData', filteredData);

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
        

        return ({
          ...prev,
          afterHours: isAfterHours ? realtimeData.realtimePrice : null,
          regular: realtimeData.realtimePrice,
          priceDifference: priceDiff,
          percentChange: percentChange,
        })
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

        return ({
          ...prev,
          regular: realtimeData.realtimePrice,
          percentChange,
          priceDifference: todayPrices.prevClose
            ? realtimeData.realtimePrice - todayPrices.prevClose
            : null,
        })
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

  const fetchFinnhubTimeSeriesData = async (symbol: string, timeframe: string = "1D"): Promise<(StockData & { time: string })[]> => {
    try {
      // Get current date in EST
      const now = new Date();
      const estNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));

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
          resolution = "60"; // 1 hour resolution
          break;
        case "1Y":
          startDate.setFullYear(startDate.getFullYear() - 1);
          resolution = "D"; // 1 day resolution
          break;
      }

      // Adjust for weekends, holidays, and market hours for 1D timeframe
      if (timeframe === "1D") {
        const currentDay = estNow.getDay();
        if (currentDay === 0 || currentDay === 6 || isMarketHoliday(estNow)) {
          startDate = adjustToMarketDay(startDate);
          endDate = adjustToMarketDay(endDate);
        } else if (estNow.getHours() < 9 || (estNow.getHours() === 9 && estNow.getMinutes() < 30)) {
          startDate = adjustToMarketDay(new Date(startDate.setDate(startDate.getDate() - 1)));
          endDate = adjustToMarketDay(new Date(endDate.setDate(endDate.getDate() - 1)));
        }
      }

      const startTime = Math.floor(startDate.getTime() / 1000);
      const endTime = Math.floor(endDate.getTime() / 1000);

      

      const response = await fetch(
        `/api/timeFrame?symbol=${symbol}&resolution=${resolution}&from=${startTime}&to=${endTime}`
      );

      if (!response.ok) throw new Error('Failed to fetch Finnhub data');

      const result: FinnhubCandle = await response.json();

      if (result.s !== 'ok') {
        throw new Error('Invalid data received from Finnhub');
      }

      // Transform the data into StockData format with time
      const transformedData = result.t.map((timestamp, index) => {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timeInMinutes = hours * 60 + minutes;

        const timeStr = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        let marketSession: StockData["marketSession"] = "regular";
        if (timeframe === "1D") {
          if (timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30) {
            marketSession = "pre";
          } else if (timeInMinutes >= 16 * 60 && timeInMinutes <= 20 * 60) {
            marketSession = "post";
          }
        }

        return {
          date: date.toISOString(),
          time: timeStr,
          open: result.o[index],
          close: result.c[index],
          high: result.h[index],
          low: result.l[index],
          volume: result.v[index],
          gain: result.c[index] > result.o[index],
          marketSession
        };
      });

      return transformedData.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

    } catch (error) {
      console.error('Error fetching Finnhub time series:', error);
      return [];
    }
  };

  const getChartData = async () => {
    try {
     
      const data = await fetchFinnhubTimeSeriesData(symbol, timeframe);
      // Only check for closing price if it's after hours
      if (isAfterHours) {
        // Get current date in EST
        const now = new Date();
        const estNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));

        // Format date to match holiday.ts format (MM-DD-YYYY)
        const formattedDate = `${(estNow.getMonth() + 1).toString().padStart(2, '0')}-${estNow.getDate().toString().padStart(2, '0')}-${estNow.getFullYear()}`;

        // Check if today is a holiday with early closing
        const holiday = MARKET_HOLIDAYS.find(h => h.date === formattedDate);
        const closingTime = holiday?.closingTime || "16:00"; // Default to 4:00 PM EST if not early close

        // Get the last price at market close
        const lastCloseData = data
          .filter(point => {
            const pointDate = new Date(point.date);
            const hours = pointDate.getHours();
            const minutes = pointDate.getMinutes();
            const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            
            // Match exact closing time (either 4:00 PM or early close time)
            return point.marketSession === "regular" && timeStr === closingTime;
          })
          .slice(-1)[0];

        // If we have closing data, update the prices
        if (lastCloseData) {
          setTodayPrices(prev => {
            const updatedPrices = {
              ...prev,
              atClose: lastCloseData.close
            };
            
            todayData(updatedPrices);
            return updatedPrices;
          });
        }
      }


      if (!data || data.length === 0) {
        console.log('No data received from Finnhub');
        return;
      }
      const timeframeData = getTimeframeData(data);

      setFilteredData(timeframeData);
      setIsLoading(false); 

    } catch (error) {
      console.error('Error in testFinnhubData:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(error) {
      console.log('Error ', error);
    }
    getChartData(); 
    
    const interval = setInterval(() => {
      getChartData();
    }, 60000); // Call every minute (60000ms)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [symbol, timeframe]);

  // Add a new function to handle timeframe changes
  const handleTimeframeChange = (tf: string) => {
    setIsLoading(true);
    setFilteredData([]); // Clear existing data
    onTimeframeChange(tf);
  };

  return (
    <div className="h-full w-full">
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-4">
        <div className="flex items-center gap-2">
          {!isLoading && (
            <div className="flex items-center gap-6">
              <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-700">

                {/* Regular Market Price with enhanced styling */}
                <div className="px-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">

                      <div className="flex items-baseline gap-1">
                        <span
                          className={`font-bold text-3xl ${todayPrices.percentChange &&
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
                            className={`text-sm font-medium ${todayPrices.percentChange > 0
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
                          As of {(() => {
                            const estHour = currentTime.getHours();
                            if (estHour >= 16) {
                              return '4:00 PM';
                            }
                            return currentTime.toLocaleTimeString('en-US', {
                              hour: '2-digit', 
                              minute: '2-digit',
                              timeZone: 'America/New_York',
                              hour12: true
                            });
                          })()} EST. {
                            (() => {
                              const estHour = currentTime.getHours();
                              const estMinutes = currentTime.getMinutes();
                              if (estHour < 9 || (estHour === 9 && estMinutes < 30)) {
                                return 'Market Closed';
                              } else if (estHour >= 16) {
                                return 'Market Closed';
                              } else {
                                return 'Market Open';
                              }
                            })()
                          }
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
                      ((new Date().getHours() >= 16 ||
                        new Date().getHours() < 9 ||
                        (new Date().getHours() === 9 &&
                          new Date().getMinutes() < 30)) || true) && (
                        <div className="flex items-center gap-2">
                          <span
                            className={` text-sm text-gray-500 dark:text-gray-400`}
                          >
                            After Hours
                          </span>
                          <span
                            className={` text-sm ${todayPrices.afterHours >
                                (todayPrices.atClose || 0)
                                ? "text-emerald-600 dark:text-emerald-500"
                                : "text-red-600 dark:text-red-500"
                              }`}
                          >
                            ${todayPrices.afterHours.toFixed(2)}
                          </span>
                          {todayPrices.regular && (
                            <span
                              className={`text-sm font-medium ${todayPrices.afterHours > (todayPrices.atClose || 0)
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
          )}
        </div>
        <div className="w-full xs:w-auto grid grid-cols-5 xs:flex gap-0.5 p-0.5 bg-gray-100/80 dark:bg-slate-800/80 rounded-lg">
          {timeframeButtons.map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
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
              margin={{ top: 20, right: 20, left: -15, bottom: 20 }}
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
                  return date
                    .toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .toLowerCase();
                }}
                ticks={[
                  new Date().setHours(4, 0, 0), // 4:00 am
                  new Date().setHours(8, 0, 0), // 8:00 am
                  new Date().setHours(12, 0, 0), // 12:00 pm
                  new Date().setHours(16, 0, 0), // 4:00 pm
                  new Date().setHours(20, 0, 0), // 8:00 pm
                ]}
                tickLine={false}
                axisLine={false}
                interval={0}
                minTickGap={30}
                tick={{
                  fontSize: 11,
                  fill: "#9CA3AF",
                }}
                dy={10}
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
                          className={`space-y-1 ${data.gain
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
                  fill={`url(#${todayPrices.percentChange && todayPrices.percentChange > 0
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
        </div>
      )}
    </div>
  );
};

export default StockPriceChart;
