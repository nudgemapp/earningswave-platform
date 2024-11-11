import { useQuery } from "@tanstack/react-query";

interface SearchCompany {
  id: string;
  symbol: string;
  name: string | null;
  logo: string | null;
  mic: string;
  _count: {
    transcripts: number;
  };
}

export const useSearchCompanies = (query: string) => {
  return useQuery<SearchCompany[]>({
    queryKey: ["companies", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await fetch(
        `/api/companies/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to search companies");
      return response.json();
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
