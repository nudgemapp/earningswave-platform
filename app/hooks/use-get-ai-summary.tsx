import { useQuery } from "@tanstack/react-query";
// import { Transcript } from "@prisma/client";

interface AISummaryResponse {
  analysis: string;
  keyPoints?: Record<string, unknown>;
  sentiment?: {
    overall: string;
    score?: number;
    details?: Record<string, string>;
  };
  lastUpdated?: Date;
}

export const useGetAISummary = (transcriptId: string | undefined) => {
  return useQuery<AISummaryResponse>({
    queryKey: ["ai-summary", transcriptId],
    queryFn: async () => {
      if (!transcriptId) throw new Error("No transcript ID provided");

      const response = await fetch(`/api/earnings/${transcriptId}/aiSummary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: transcriptId,
          //   symbol: "EXAMPLE",
          //   estimate: 0,
          //   lastYearEPS: 0,
          //   reportDate: new Date().toISOString(),
          //   fiscalDateEnding: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI analysis");

      return await response.json();
    },
    enabled: !!transcriptId,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
