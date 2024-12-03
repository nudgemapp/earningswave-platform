import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/apiClient";

export const useWatchlistCheck = (companyId: string) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ["watchlist-check", companyId],
    queryFn: async () => {
      if (!companyId) return false;

      const response = await apiClient.get<any>(
        `/watchlist/check/${companyId}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to check watchlist status");
      }
      const data = response.data;
      return data.isWatchlisted;
    },
    enabled: !!companyId,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
};
