import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface WebSocketMessage {
  type: string;
  data?: Array<{
    p: number; // price
    s: string; // symbol
    t: number; // timestamp
    v: number; // volume
  }>;
}

export const useStockWebSocket = (symbol: string) => {
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!symbol) return;

    const eventSource = new EventSource(`/api/websocket?symbol=${symbol}`);

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log("SSE Connection opened");
    };

    eventSource.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);

      if (data.type === "trade" && data.data?.[0]) {
        const trade = data.data[0];
        setLastPrice(trade.p);

        // Update React Query cache
        queryClient.setQueryData(["stockPrice", symbol], (old: any) => ({
          ...old,
          realtimePrice: trade.p,
          lastUpdate: new Date().toISOString(),
        }));
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      setIsConnected(false);
    };

    // Cleanup
    return () => {
      eventSource.close();
    };
  }, [symbol, queryClient]);

  return { lastPrice, isConnected };
};
