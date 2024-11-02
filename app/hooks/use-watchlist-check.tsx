import { useQuery } from "@tanstack/react-query";

export const useWatchlistCheck = (companyId: number) => {
  return useQuery({
    queryKey: ["watchlist-check", companyId],
    queryFn: async () => {
      const response = await fetch(`/api/watchlist/check/${companyId}`);
      if (!response.ok) {
        throw new Error("Failed to check watchlist status");
      }
      const data = await response.json();
      return data.isWatchlisted as boolean;
    },
    staleTime: 1000 * 60, // Cache for 1 minute
    retry: 1, // Only retry once on failure
  });
};
