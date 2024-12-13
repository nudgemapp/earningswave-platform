import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  StockData,
  FinnhubTrade,
} from "@/app/(auth)/(platform)/earnings/types";

export const useStockWebSocket = (symbol: string) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  const createStockDataPoint = useCallback((trade: FinnhubTrade): StockData => {
    const date = new Date(trade.t);
    const timeInMinutes = date.getHours() * 60 + date.getMinutes();

    let marketSession: "pre" | "regular" | "post" = "regular";
    if (timeInMinutes >= 240 && timeInMinutes < 570) marketSession = "pre";
    else if (timeInMinutes >= 960) marketSession = "post";

    return {
      date: date.toISOString(),
      open: trade.p,
      close: trade.p,
      high: trade.p,
      low: trade.p,
      volume: trade.v,
      gain: true,
      marketSession,
    };
  }, []);

  const connect = useCallback(() => {
    if (!symbol) return;

    // Clean up previous connection
    if (eventSourceRef.current) {
      console.log(`Closing previous connection for ${symbol}`);
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    console.log(`Establishing new connection for ${symbol}`);
    const eventSource = new EventSource(`/api/websocket?symbol=${symbol}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log(`Connection established for ${symbol}`);
      setIsConnected(true);
      setError(null);
      reconnectAttemptsRef.current = 0;
    };

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "trade" && Array.isArray(message.data)) {
          const trade = message.data[0];
          queryClient.setQueryData(["stockPrice", symbol], (oldData: any) => {
            const stockData = createStockDataPoint(trade);
            return {
              ...oldData,
              realtimePrice: trade.p,
              lastUpdate: new Date().toISOString(),
              data: [...(oldData?.data || []), stockData].slice(-1000),
            };
          });
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
      setIsConnected(false);
      setError("Connection failed");

      // Attempt to reconnect if under max attempts
      if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttemptsRef.current++;
        console.log(
          `Reconnect attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS}`
        );

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 2000 * Math.pow(2, reconnectAttemptsRef.current - 1)); // Exponential backoff
      } else {
        setError("Max reconnection attempts reached");
      }
    };
  }, [symbol, queryClient, createStockDataPoint]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        console.log(`Cleaning up connection for ${symbol}`);
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [symbol, connect]);

  return { isConnected, error };
};
