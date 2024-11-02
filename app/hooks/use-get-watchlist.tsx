import { useQuery } from "@tanstack/react-query";
import { WatchlistEntry } from "@prisma/client";

interface ProcessedWatchlistEntry extends WatchlistEntry {
  company: {
    id: number;
    name: string;
    symbol: string;
    logo?: {
      data: Buffer;
    } | null;
  };
}

interface WatchlistResponse {
  entries: ProcessedWatchlistEntry[];
}

export const useGetWatchlist = () => {
  return useQuery<WatchlistResponse>({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const response = await fetch("/api/watchlist");
      if (!response.ok) throw new Error("Failed to fetch watchlist");

      const data = await response.json();
      return {
        entries: data.map((entry: ProcessedWatchlistEntry) => ({
          ...entry,
          company: {
            ...entry.company,
            logo: entry.company.logo
              ? {
                  ...entry.company.logo,
                  data: entry.company.logo.data
                    ? `data:image/png;base64,${Buffer.from(
                        entry.company.logo.data
                      ).toString("base64")}`
                    : null,
                }
              : null,
          },
        })),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
