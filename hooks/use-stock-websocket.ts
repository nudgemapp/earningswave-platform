import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { StockData, WebSocketMessage, FinnhubTrade } from "@/app/(auth)/(platform)/earnings/types";

export const useStockWebSocket = (symbol: string) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const determineMarketSession = useCallback(
    (date: Date): "pre" | "regular" | "post" => {
      const timeInMinutes = date.getHours() * 60 + date.getMinutes();
      if (timeInMinutes >= 240 && timeInMinutes < 570) return "pre";
      if (timeInMinutes >= 570 && timeInMinutes < 960) return "regular";
      return "post";
    },
    []
  );

  const createStockDataPoint = useCallback(
    (trade: FinnhubTrade): StockData => ({
      date: new Date(trade.t).toISOString(),
      open: trade.p,
      close: trade.p,
      high: trade.p,
      low: trade.p,
      volume: trade.v,
      gain: true,
      marketSession: determineMarketSession(new Date(trade.t)),
    }),
    [determineMarketSession]
  );

  const processTradeData = useCallback((trades: FinnhubTrade[]) => {
    if (!trades.length) return;

    // Sort trades by timestamp
    const sortedTrades = [...trades].sort((a, b) => a.t - b.t);
    
    queryClient.setQueryData(["stockPrice", symbol], (oldData: any) => {
      const newData = oldData?.data || [];
      
      // Process each trade
      sortedTrades.forEach(trade => {
        newData.push(createStockDataPoint(trade));
      });

      // Keep only last 1000 data points
      while (newData.length > 1000) {
        newData.shift();
      }

      return {
        ...oldData,
        realtimePrice: sortedTrades[sortedTrades.length - 1].p,
        lastUpdate: new Date().toISOString(),
        data: newData,
      };
    });
  }, [queryClient, symbol, createStockDataPoint]);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "trade" && Array.isArray(message.data)) {
        processTradeData(message.data);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }, [processTradeData]);

  useEffect(() => {
    const connectSSE = async () => {
      try {
        // Initialize backend WebSocket
        await fetch('/api/ws');
        
        // Connect to SSE endpoint
        const eventSource = new EventSource(`/api/ws/events?symbol=${symbol}`);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        eventSource.onmessage = handleMessage;

        eventSource.onerror = () => {
          setIsConnected(false);
          setError("Connection failed");
          eventSource.close();
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
      }
    };

    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [symbol, handleMessage]);

  return useMemo(
    () => ({
      isConnected,
      error,
    }),
    [isConnected, error]
  );
};
