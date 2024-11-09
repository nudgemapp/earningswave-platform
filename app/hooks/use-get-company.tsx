import { useQuery } from "@tanstack/react-query";
import { Company } from "@prisma/client";

export const useGetCompany = (companyId: string | undefined) => {
  return useQuery<Company>({
    queryKey: ["company", companyId],
    queryFn: async () => {
      if (!companyId) throw new Error("No company ID provided");
      const response = await fetch(`/api/companies/${companyId}`);
      if (!response.ok) throw new Error("Failed to fetch company data");
      return response.json();
    },
    enabled: !!companyId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
