import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useWatchlistMutations = () => {
  const queryClient = useQueryClient();

  const addToWatchlist = useMutation({
    mutationFn: async (companyId: string) => {
      const response = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to add to watchlist");
      }
      return response.json();
    },
    onMutate: async (companyId) => {
      await queryClient.cancelQueries({
        queryKey: ["watchlist-check", companyId],
      });

      const previousValue = queryClient.getQueryData([
        "watchlist-check",
        companyId,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(["watchlist-check", companyId], true);

      return { previousValue };
    },
    onError: (err, companyId, context) => {
      queryClient.setQueryData(
        ["watchlist-check", companyId],
        context?.previousValue
      );
    },
    onSettled: (data, error, companyId) => {
      if (!error) {
        // On success, update the cache without refetching
        queryClient.setQueryData(["watchlist-check", companyId], true);
      }
      // Only invalidate the watchlist query, not the check query
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (companyId: string) => {
      const response = await fetch("/api/watchlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to remove from watchlist");
      }
      return response.json();
    },
    onMutate: async (companyId) => {
      await queryClient.cancelQueries({
        queryKey: ["watchlist-check", companyId],
      });
      const previousValue = queryClient.getQueryData([
        "watchlist-check",
        companyId,
      ]);
      queryClient.setQueryData(["watchlist-check", companyId], false);
      return { previousValue };
    },
    onError: (err, companyId, context) => {
      queryClient.setQueryData(
        ["watchlist-check", companyId],
        context?.previousValue
      );
    },
    onSettled: (data, error, companyId) => {
      if (!error) {
        // On success, update the cache without refetching
        queryClient.setQueryData(["watchlist-check", companyId], false);
      }
      // Only invalidate the watchlist query, not the check query
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  return {
    addToWatchlist,
    removeFromWatchlist,
  };
};
