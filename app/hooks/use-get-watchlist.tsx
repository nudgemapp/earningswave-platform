import { useQuery } from "@tanstack/react-query";
import { WatchlistEntry, Company } from "@prisma/client";

// Define the extended types based on your schema
interface ExtendedCompany extends Company {
  logo: string | null;
}

interface ExtendedWatchlistEntry extends WatchlistEntry {
  company: ExtendedCompany;
}

interface WatchlistResponse {
  entries: ExtendedWatchlistEntry[];
}

export const useGetWatchlist = () => {
  return useQuery<WatchlistResponse>({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const response = await fetch("/api/watchlist");
      if (!response.ok) throw new Error("Failed to fetch watchlist");

      const data = await response.json();
      return {
        entries: data.map((entry: ExtendedWatchlistEntry) => ({
          ...entry,
          company: {
            ...entry.company,
            // No need to process logo as it's already a string URL in your schema
            logo: entry.company.logo || null,
          },
        })),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
