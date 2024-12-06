import { useQuery } from "@tanstack/react-query";
import { Transcript } from "@prisma/client";

export const useGetUpcomingEarnings = (symbol: string | undefined) => {
  return useQuery<Transcript[]>({
    queryKey: ["upcomingEarnings", symbol],
    queryFn: async () => {
      if (!symbol) throw new Error("No symbol provided");
      const response = await fetch(`/api/earnings/upcoming/${symbol}`, {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch upcoming earnings");
      return response.json();
    },
    enabled: !!symbol,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
