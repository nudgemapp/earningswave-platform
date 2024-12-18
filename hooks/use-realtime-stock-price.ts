import { useEffect } from "react";
import { useEarningsStore } from "@/store/EarningsStore";
import { useStockWebSocket } from "./use-stock-websocket";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type StockQuote = {
  c: number;
  h: number;
  d: number;
  dp: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};

export const useRealtimeStockPrice = (symbol: string) => {
  const queryClient = useQueryClient();

  // Initial price fetch
  const { data: stockPrice } = useQuery({
    queryKey: ["stockPrice", symbol],
    queryFn: async () => {
      if (!symbol) return null;
      const response = await fetch(
        `/api/companies/recentPrice?symbol=${symbol}`
      ).then((res: Response) => res.json() as Promise<any>);
      console.log("stockPrice", response);
      return response;
    },
    enabled: !!symbol,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  console.log("stockPrice", stockPrice);

  // Prefetch when symbol changes
  useEffect(() => {
    if (symbol) {
      queryClient.prefetchQuery({
        queryKey: ["stockPrice", symbol],
        queryFn: async () => {
          const response = await fetch(`/api/stocks/quote?symbol=${symbol}`);
          if (!response.ok) throw new Error("Failed to fetch stock price");
          console.log("response", response.json());
          return response.json();
        },
      });
    }
  }, [symbol, queryClient]);

  return {
    stockPrice,
  };
};
