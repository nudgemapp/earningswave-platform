import { useQuery } from "@tanstack/react-query";
import { Earnings } from "@prisma/client";

export const useUpcomingEarnings = (symbol: string | undefined) => {
  return useQuery<{
    upcomingEarnings: Earnings[];
    recentEarnings: Earnings[];
  }>({
    queryKey: ["earnings", symbol],
    queryFn: async () => {
      if (!symbol) throw new Error("No symbol provided");
      const response = await fetch(`/api/companies/${symbol}/earnings`, {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch earnings data");
      return response.json();
    },
    enabled: !!symbol,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
