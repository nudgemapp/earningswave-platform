import { QueryClient, useQuery } from "@tanstack/react-query";
import { Company, Transcript } from "@prisma/client";

type ExtendedCompany = Company & {
  recentTranscripts?: Transcript[];
};

export const useGetCompany = (
  identifier: string | undefined,
  type: "id" | "symbol" = "id"
) => {
  return useQuery<ExtendedCompany>({
    queryKey: ["company", type, identifier],
    queryFn: async () => {
      if (!identifier) throw new Error("No identifier provided");
      const endpoint =
        type === "id"
          ? `/api/companies/${identifier}`
          : `/api/companies/symbol/${identifier}`;

      const response = await fetch(endpoint, {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch company data");
      return response.json();
    },
    enabled: !!identifier,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: (previousData) => previousData,
  });
};

export const prefetchCompany = async (
  identifier: string,
  type: "id" | "symbol",
  queryClient: QueryClient
) => {
  return queryClient.prefetchQuery({
    queryKey: ["company", type, identifier],
    queryFn: async () => {
      const endpoint =
        type === "id"
          ? `/api/companies/${identifier}`
          : `/api/companies/symbol/${identifier}`;

      const response = await fetch(endpoint, {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch company data");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};
