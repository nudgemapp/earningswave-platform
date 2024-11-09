import { useQuery } from "@tanstack/react-query";
import { EarningsCallTranscript } from "@/types/EarningsTranscripts";

export const useGetTranscriptData = (transcriptId: string | undefined) => {
  return useQuery<EarningsCallTranscript>({
    queryKey: ["transcript", transcriptId],
    queryFn: async () => {
      if (!transcriptId) throw new Error("No transcript selected");
      const response = await fetch(`/api/earnings/${transcriptId}`);
      if (!response.ok) throw new Error("Failed to fetch transcript");
      return response.json();
    },
    enabled: !!transcriptId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
