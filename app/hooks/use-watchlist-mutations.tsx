import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useWatchlistMutations = () => {
  const queryClient = useQueryClient();

  const addToWatchlist = useMutation({
    mutationFn: async (companyId: number) => {
      const response = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });

      if (!response.ok) throw new Error("Failed to add to watchlist");
      return response.json();
    },
    onMutate: async (companyId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["watchlist-check", companyId],
      });

      // Save previous value
      const previousValue = queryClient.getQueryData([
        "watchlist-check",
        companyId,
      ]);

      // Optimistically update the cache
      queryClient.setQueryData(["watchlist-check", companyId], true);

      return { previousValue };
    },
    onError: (err, companyId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ["watchlist-check", companyId],
        context?.previousValue
      );
    },
    onSettled: (_, __, companyId) => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({
        queryKey: ["watchlist-check", companyId],
      });
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (companyId: number) => {
      const response = await fetch("/api/watchlist/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId }),
      });

      if (!response.ok) throw new Error("Failed to remove from watchlist");
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
    onSettled: (_, __, companyId) => {
      queryClient.invalidateQueries({
        queryKey: ["watchlist-check", companyId],
      });
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });

  return {
    addToWatchlist,
    removeFromWatchlist,
  };
};
