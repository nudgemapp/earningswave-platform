import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  StockData,
  WebSocketMessage,
  FinnhubTrade,
} from "@/app/(auth)/(platform)/earnings/types";

const FINNHUB_WS_URL = `wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`;
const MAX_RETRY_DELAY = 30000;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RECONNECT_ATTEMPTS = 5;

export const useStockWebSocket = (symbol: string) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

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

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log("WebSocket message received:", message);
        console.log(
          "Current queryClient data:",
          queryClient.getQueryData(["stockPrice", symbol])
        );

        if (message.type === "trade" && message.data.length > 0) {
          const trade = message.data[0];
          queryClient.setQueryData(["stockPrice", symbol], (oldData: any) => {
            const newData = {
              ...oldData,
              realtimePrice: trade.p,
              lastUpdate: new Date().toISOString(),
              data: oldData?.data
                ? [...oldData.data, createStockDataPoint(trade)]
                : [createStockDataPoint(trade)],
            };
            console.log("Updated data:", newData);
            return newData;
          });
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    },
    [queryClient, symbol, createStockDataPoint]
  );

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      ws.current?.close();
      ws.current = new WebSocket(FINNHUB_WS_URL);

      const socket = ws.current;

      socket.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        socket.send(JSON.stringify({ type: "subscribe", symbol }));
      };

      socket.onclose = () => {
        setIsConnected(false);
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(
            INITIAL_RETRY_DELAY * Math.pow(2, reconnectAttempts.current),
            MAX_RETRY_DELAY
          );
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            connect();
          }, delay);
        } else {
          setError("Maximum reconnection attempts reached");
        }
      };

      socket.onerror = () => {
        setError("WebSocket connection failed");
        socket.close();
      };

      socket.onmessage = handleMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  }, [symbol, handleMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "unsubscribe", symbol }));
        ws.current.close();
      }
    };
  }, [connect, symbol]);

  return useMemo(
    () => ({
      isConnected,
      error,
    }),
    [isConnected, error]
  );
};
