import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

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
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return useQuery<SearchCompany[]>({
    queryKey: ["companies", "search", debouncedQuery],
    queryFn: async () => {
      const response = await fetch(
        `/api/companies/search?q=${encodeURIComponent(debouncedQuery)}`
      );
      if (!response.ok) throw new Error("Failed to search companies");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};
