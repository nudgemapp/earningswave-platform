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
  marketCapitalization: number | null;
  country: string | null;
  exchange: string | null;
  finnhubIndustry: string | null;
}

export const useSearchCompanies = (query: string) => {
  return useQuery<SearchCompany[]>({
    queryKey: ["companies", "search", query],
    queryFn: async () => {
      const response = await fetch(
        `/api/companies/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to search companies");
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
