import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  StockData,
  WebSocketMessage,
  FinnhubTrade,
} from "@/app/(auth)/(platform)/earnings/types";

const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;

export const useStockWebSocket = (symbol: string) => {
  const queryClient = useQueryClient();
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    try {
      ws.current = new WebSocket(FINNHUB_WS_URL);

      console.log(ws.current);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Only subscribe after connection is established
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: "subscribe", symbol }));
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);

        // Implement reconnection logic
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          setTimeout(connect, 1000 * Math.pow(2, reconnectAttempts.current)); // Exponential backoff
        } else {
          setError("Maximum reconnection attempts reached");
        }
      };

      ws.current.onerror = (event) => {
        setError("WebSocket error occurred");
        console.error("WebSocket error:", event);
      };

      ws.current.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === "trade" && message.data.length > 0) {
          const trade = message.data[0];

          // Update cached data using React Query
          queryClient.setQueryData(["stockPrice", symbol], (oldData: any) => {
            const newPoint = createStockDataPoint(trade);
            return {
              ...oldData,
              realtimePrice: trade.p,
              lastUpdate: new Date().toISOString(),
              data: oldData?.data ? [...oldData.data, newPoint] : [newPoint],
            };
          });
        }
      };
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to WebSocket"
      );
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        // Only try to unsubscribe if the connection is open
        if (ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: "unsubscribe", symbol }));
        }
        ws.current.close();
      }
    };
  }, [symbol]);

  const createStockDataPoint = (trade: FinnhubTrade): StockData => {
    const date = new Date(trade.t);
    return {
      date: date.toISOString(),
      open: trade.p,
      close: trade.p,
      high: trade.p,
      low: trade.p,
      volume: trade.v,
      gain: true, // This will be compared with previous price in the component
      marketSession: determineMarketSession(date),
    };
  };

  const determineMarketSession = (date: Date): "pre" | "regular" | "post" => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    if (timeInMinutes >= 4 * 60 && timeInMinutes < 9 * 60 + 30) return "pre";
    if (timeInMinutes >= 9 * 60 + 30 && timeInMinutes < 16 * 60)
      return "regular";
    return "post";
  };

  return {
    isConnected,
    error,
  };
};
