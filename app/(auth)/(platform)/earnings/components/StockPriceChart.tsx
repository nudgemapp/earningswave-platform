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
import { useQueryClient, useQuery } from "@tanstack/react-query";


interface StockChartProps {
  symbol: string;
  timeframe?: string;
  onTimeframeChange: (tf: string) => void;
  todayData: (data:{
    preMarket: number | null;
    regular: number | null;
    afterHours: number | null;
    regularOpen: number | null;
    percentChange: number | null;
    priceDifference: number | null;
    mostRecentDate: string | null;


  })=>void;
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

// const LiveIndicator = () => (
//   <div className="flex items-center gap-1.5">
//     <div className="relative flex h-2.5 w-2.5">
//       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//       <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
//     </div>
//     <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
//       LIVE
//     </span>
//   </div>
// );

const StockPriceChart: React.FC<StockChartProps> = ({
  symbol,
  timeframe = "1D",
  onTimeframeChange,
  todayData,
}) => {
  const websocketConnection = useStockWebSocket(symbol);
  const {  error } = useMemo(
    () => websocketConnection,
    [websocketConnection]
  );

  const { data: realtimeData } = useQuery<RealtimeStockData>({
    queryKey: ["stockPrice", symbol],
    enabled: !!symbol,
    staleTime: Infinity,
  });

  const [data, setData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayPrices, setTodayPrices] = useState<{
    prevClose:number|null
    preMarket: number | null;
    regular: number | null;
    afterHours: number | null;
    regularOpen: number | null;
    percentChange: number | null;
    priceDifference: number | null;
    mostRecentDate?: string | null;
    atClose?:number|null
  }>({
    prevClose:null,
    atClose:null,
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

  // You can show connection status if needed
  useEffect(() => {
    if (error) {
      console.error("WebSocket error:", error);
      // Handle error (show toast, etc.)
    }
  }, [error]);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;

      try {
        setIsLoading(true);
        const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;

        const endpoint =
          timeframe === "1D"
            ? `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&extended_hours=true&entitlement=delayed&apikey=${API_KEY}`
            : `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&entitlement=delayed&apikey=${API_KEY}`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch stock data");
        const result = await response.json();

        if (timeframe === "1D" && result["Time Series (1min)"]) {
          const entries = Object.entries(result["Time Series (1min)"]);
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
        const endpoint = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&extended_hours=true&entitlement=delayed&apikey=${API_KEY}`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch today's prices");
        const result = await response.json();
        console.log('result', result);

        if (result["Time Series (1min)"]) {
          const entries = Object.entries(result["Time Series (1min)"]);
          const mostRecentDate = entries[0][0].split(" ")[0];
          // Find previous day's closing price (4:00 PM EST)
          const prevDate = new Date(mostRecentDate);

          
          const prevDayClose = entries.find(([date]) => {
            const entryDate = new Date(date);
            return entryDate.getDate() === prevDate.getDate() && 
                   entryDate.getHours() === 16 && // 4 PM
                   entryDate.getMinutes() === 0;  // 00 minutes
          });

          const prevClosePrice = prevDayClose ? 
            parseFloat((prevDayClose[1] as AlphaVantageIntraday)["4. close"]) : 
            null;


          let preMarketPrice = null;
          let regularPrice = null;
          let afterHoursPrice = null;
          let regularOpenPrice = null;
          let latestPrice = null;
          const prevClose = prevClosePrice

          // Process entries for the most recent day only
          const todayEntries = entries.filter(
            ([date]) => date.split(" ")[0] === mostRecentDate
          ).reverse();
          const todayDate = todayEntries[0][0].split(" ")[0];

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
              if (!preMarketPrice) {
                // If no pre-market price found, get previous day's close at 4:00 PM
                const prevDayDate = new Date(dateObj);
                prevDayDate.setDate(prevDayDate.getDate() - 1);
                const prevDayEntries = entries.filter(([date]) => {
                  const entryDate = new Date(date);
                  return entryDate.getDate() === prevDayDate.getDate() && 
                         entryDate.getHours() === 16 && 
                         entryDate.getMinutes() === 0;
                });
                if (prevDayEntries.length > 0) {
                  preMarketPrice = parseFloat((prevDayEntries[0][1] as AlphaVantageIntraday)["4. close"]);
                } else {
                  preMarketPrice = close;
                }
              }
            }
            // Regular market (9:30 AM - 4:00 PM ET)
            else if (timeInMinutes >= 9 * 60 + 30 && timeInMinutes <= 16 * 60) {
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
           
          
           // Calculate actual price difference using regular price after 4pm EST
           const currentPrice = new Date().getHours() >= 16 ? regularPrice : latestPrice;
           const priceDifference = 
             preMarketPrice && currentPrice !== null
               ? currentPrice - preMarketPrice
               : null;
          // Calculate percent change using the previously calculated price difference  
          const percentChange =
            priceDifference && preMarketPrice
              ? (priceDifference / preMarketPrice) * 100
              : null;

              todayData({
                preMarket: preMarketPrice,
                regular: (new Date().getHours() >= 9 && new Date().getMinutes() >= 30 && new Date().getHours() < 16) ? regularPrice : latestPrice,
                afterHours: afterHoursPrice,
                regularOpen: regularOpenPrice,
                percentChange,
                priceDifference,
                mostRecentDate: todayDate
              });
              
              
              
          setTodayPrices({
            preMarket: preMarketPrice,
            regular: (new Date().getHours() >= 9 && new Date().getMinutes() >= 30 && new Date().getHours() < 16) ? regularPrice : latestPrice,
            atClose: new Date().getHours() >= 16 ? regularPrice : null,
            afterHours: afterHoursPrice,
            regularOpen: regularOpenPrice,
            percentChange,
           priceDifference: todayPrices.prevClose && realtimeData
          ? realtimeData.realtimePrice - todayPrices.prevClose 
          : null,
            mostRecentDate: todayDate,
            prevClose:prevClose
          });
        }
      } catch (error) {
        console.error("Error fetching today's prices:", error);
      }
    };

    fetchTodayPrices();
  }, [symbol]);

  const getTimeframeData = () => {
    if (timeframe === "1D") {
      // Set time range from 4am to 8pm
      const today = new Date();
      const marketOpen = new Date(today);
      marketOpen.setHours(4, 0, 0, 0);  // Start at 4 AM
      const marketClose = new Date(today);
      marketClose.setHours(20, 0, 0, 0); // End at 8 PM

      // Filter and sort the actual data points
      const validData = data
        .filter(point => {
          const pointTime = new Date(point.date);
          return pointTime >= marketOpen && pointTime <= marketClose;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // If we have valid data, use it directly
      if (validData.length > 0) {
        // Find the previous day's closing price
        const prevClose = validData[0]?.close || 0;

        // Create pre-market data if needed
        const preMarketData: StockData[] = [];
        if (new Date(validData[0]?.date) > marketOpen) {
          preMarketData.push({
            date: marketOpen.toISOString(),
            open: prevClose,
            close: prevClose,
            high: prevClose,
            low: prevClose,
            volume: 0,
            gain: false,
            marketSession: "regular"
          });
        }

        return [...preMarketData, ...validData];
      }

      return [];
    }

    return data;
  };

  const filteredData = getTimeframeData();

  // Update the yDomain calculation in the useMemo hook
  const yDomain = useMemo(() => {
    if (filteredData.length === 0) return ["auto", "auto"];
    
    const prices = filteredData.map(d => d.close);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1; // 10% padding
    
    return [
      Math.floor((min - padding) * 100) / 100, // Round down to 2 decimal places
      Math.ceil((max + padding) * 100) / 100   // Round up to 2 decimal places
    ];
  }, [filteredData]);

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
    if (realtimeData?.realtimePrice && todayPrices.prevClose) {
      const priceDiff = realtimeData.realtimePrice - todayPrices.prevClose;
      const percentChange = (priceDiff / todayPrices.prevClose) * 100;

      setTodayPrices(prev => ({
        ...prev,
        regular: realtimeData.realtimePrice,
        priceDifference: priceDiff,
        percentChange: percentChange
      }));

     
    }
  }, [realtimeData?.realtimePrice, todayPrices.prevClose]);

 
 

  // Update the regular market price display
  useEffect(() => {

    if (realtimeData?.realtimePrice) {
      const percentChange = todayPrices.prevClose 
      ? ((realtimeData.realtimePrice - todayPrices.prevClose) / todayPrices.prevClose) * 100
      : null;

      console.log('percentage',percentChange)
      setTodayPrices((prev) => ({
        ...prev,
        regular: realtimeData.realtimePrice,
        percentChange,
        priceDifference: todayPrices.prevClose 
          ? realtimeData.realtimePrice - todayPrices.prevClose 
          : null,
      }));
    }
  }, [realtimeData?.realtimePrice]);

  // Add state to track current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Add useEffect for time updates
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60000ms = 1 minute

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Use currentTime instead of new Date()
  const isAfterHours = currentTime.getHours() >= 16;

  return (
    <div className="h-full w-full">
    
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-4">
        <div className="flex items-center gap-2">
          {!isLoading && (
            <div className="flex items-center gap-6">
              <div className="flex items-center divide-x divide-gray-200 dark:divide-gray-700">
                {/* Pre-market price */}
                {/* <div className="pr-6">
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
                </div> */}

                {/* Regular Market Price with enhanced styling */}
                <div className="px-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                    {/* <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Regular Market
                      </span>
                      {timeframe === "1D" && <LiveIndicator />}
                    </div> */}
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`font-bold text-3xl ${
                          todayPrices.percentChange && todayPrices.percentChange > 0
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-red-600 dark:text-red-500"
                        }`}
                      >
                        
                        
                        ${(isAfterHours ? todayPrices.atClose : todayPrices.regular) && todayPrices.regular && todayPrices.regular < 0 ? "-" : ""}{Math.abs((isAfterHours ? todayPrices.atClose : todayPrices.regular) || 0).toFixed(2)}
                      </span>
                    </div>
                     
                      {todayPrices.percentChange !== null && 
                       todayPrices.priceDifference !== null && 
                       realtimeData?.realtimePrice &&
                       new Date().getHours() < 16 && (
                        <span
                          className={`text-sm font-medium ${
                            todayPrices.percentChange > 0
                              ? "text-emerald-600 dark:text-emerald-500" 
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {todayPrices.percentChange > 0 ? "▲" : "▼"} ${(todayPrices.priceDifference).toFixed(2)} ({(todayPrices.percentChange).toFixed(2)}%)
                        </span>
                      )}
                    </div>
                    {(new Date().getHours() >= 16 || new Date().getHours() < 9 || (new Date().getHours() === 9 && new Date().getMinutes() < 30)) && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        At close, {todayPrices.mostRecentDate ? new Date(new Date(todayPrices.mostRecentDate).getTime() + 24*60*60*1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'MM/DD/YYYY'} at 4:00pm EST, USD
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
                          <span className="text-xs font-extrabold text-gray-600 dark:text-gray-300">!</span>
                        </div>
                      </span>
                    )}
                    
                    {todayPrices.afterHours && (new Date().getHours() >= 16 || new Date().getHours() < 9 || (new Date().getHours() === 9 && new Date().getMinutes() < 30)) && (
                      <div className="flex items-center gap-2">
                        <span className={` text-sm text-gray-500 dark:text-gray-400`}>After Hours</span>
                        <span className={` text-sm ${
                          todayPrices.afterHours > (todayPrices.regular || 0)
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-red-600 dark:text-red-500"
                        }`}>
                          ${todayPrices.afterHours.toFixed(2)}
                        </span>
                        {todayPrices.regular && (
                          <span className={`text-sm font-medium ${
                            todayPrices.afterHours > todayPrices.regular
                              ? "text-emerald-600 dark:text-emerald-500"
                              : "text-red-600 dark:text-red-500"
                          }`}>
                             ${Math.abs(todayPrices.afterHours - todayPrices.regular).toFixed(2)} ({((todayPrices.afterHours - todayPrices.regular) / todayPrices.regular * 100).toFixed(2)}%)
                          </span>
                        )}
                      </div>
                    )}

                  </div>
                </div>

                {/* After-hours price */}
                {/* <div className="pl-6">
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
                </div> */}
              </div>

              {/* Currency indicator */}
              {/* <div className="flex items-center">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase">
                  USD
                </span>
              </div> */}
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
                  return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }).toLowerCase();
                }}
                ticks={[
                  new Date().setHours(4, 0, 0),   // 4:00 am
                  new Date().setHours(8, 0, 0),   // 8:00 am
                  new Date().setHours(12, 0, 0),  // 12:00 pm
                  new Date().setHours(16, 0, 0),  // 4:00 pm
                  new Date().setHours(20, 0, 0)   // 8:00 pm
                ]}
                tickLine={false}
                axisLine={false}
                interval={0}
                minTickGap={30}
                tick={{ 
                  fontSize: 11,
                  fill: '#9CA3AF'
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
                  type="monotoneX"
                  dataKey="close"
                  stroke={todayPrices.percentChange && todayPrices.percentChange > 0 ? "#10b981" : "#ef4444"}
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
        </div>
      )}
    </div>
  );
};

export default StockPriceChart;
