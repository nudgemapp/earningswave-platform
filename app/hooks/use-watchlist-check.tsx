import { useQuery } from "@tanstack/react-query";

export const useWatchlistCheck = (companyId: string) => {
  return useQuery({
    queryKey: ["watchlist-check", companyId],
    queryFn: async () => {
      if (!companyId) return false;

      const response = await fetch(`/api/watchlist/check/${companyId}`);
      if (!response.ok) {
        throw new Error("Failed to check watchlist status");
      }
      const data = await response.json();
      return data.isWatchlisted;
    },
    enabled: !!companyId,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
};
