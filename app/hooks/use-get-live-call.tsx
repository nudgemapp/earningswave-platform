import { useQuery } from "@tanstack/react-query";

export const useGetLiveCall = (id: string | undefined) => {
  return useQuery({
    queryKey: ["liveCall", id],
    queryFn: async () => {
      if (!id) throw new Error("No company ID provided");
      const response = await fetch(`/api/companies/${id}/live-call`, {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch live call data");
      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
