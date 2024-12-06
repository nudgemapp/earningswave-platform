import { useQuery } from "@tanstack/react-query";

interface AISummaryResponse {
  summary: {
    overview: string;
    quarterHighlights: string;
    challenges: string;
  };
  keyHighlights: Array<{
    category: string;
    title: string;
    description: string;
    impact: string;
  }>;
  performanceAnalysis: Array<{
    metric: string;
    value: string;
    analysis: string;
    trend: "positive" | "neutral" | "negative";
  }>;
  forwardGuidance: {
    outlook: string;
    keyInitiatives: string[];
    risks: string[];
  };
  sentiment: {
    score: number;
    label: "bullish" | "neutral" | "bearish";
    rationale: string;
  };
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
        body: JSON.stringify({ id: transcriptId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI analysis");
      }

      const data = await response.json();
      console.log(data);
      return data;
    },
    enabled: !!transcriptId,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
