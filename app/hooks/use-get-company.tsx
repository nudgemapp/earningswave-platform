import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Company, Transcript } from "@prisma/client";

type ExtendedCompany = Company & {
  recentTranscripts?: Transcript[];
};

export const useGetCompany = (companyId: string | undefined) => {
  return useQuery<ExtendedCompany>({
    queryKey: ["company", companyId],
    queryFn: async () => {
      if (!companyId) throw new Error("No company ID provided");
      const response = await fetch(`/api/companies/${companyId}`, {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch company data");
      return response.json();
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    placeholderData: (previousData) => previousData,
  });
};

export const prefetchCompany = async (companyId: string, queryClient: any) => {
  return queryClient.prefetchQuery({
    queryKey: ["company", companyId],
    queryFn: async () => {
      const response = await fetch(`/api/companies/${companyId}`, {
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
